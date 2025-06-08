import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude the current user
        { _id: { $nin: currentUser.friends } }, // Exclude user's friends
        { isOnboarded: true } // Include only onboarded users
      ],
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommendedUsers Controller", error);
    res.status(500).json({ message: "Internal Error in server" });
  }
}


export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriends Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id;
    console.log("this is send-friend-request", myId)
    const { id: recipientId } = req.params;

    // prevent sending the request to yourself
    if (req.user.id === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't Send Friend Request To Yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(400).json({ message: "Recipient Not Found" });
    }

    // check if the recipient is already a friend
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already Friend with this User" });
    }

    // check if the Friend Request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A Friend Request Already Exists between you and this User.",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error in SendFriendRequest Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: recipientId } = req.params;
    console.log("REQ.USER.ID:", req.user.id); // ✅
    console.log("REQ.PARAMS.ID:", req.params.id); // ✅
  
    const friendRequest = await FriendRequest.findById(recipientId);

    if (!friendRequest) {
      return res
        .status(400)
        .json({ message: "No Authorized Friend Request Found" });
    }

    // current user should not be the recipient, just make sure of it
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(400)
        .json({ message: "You are not Authorized to Accept this Request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each user's ID to their each others friends List

    // adding recipient in senders friend's list
    await User.findOneAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    // adding sender in recipients friend's list
    await User.findOneAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend Request Accepted" });
  } catch (error) {
    console.log("Error in AcceptFriendRequest Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (error) {
    console.log("Error in getFriendRequests Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const OutgoingFriendRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json({ OutgoingFriendRequests });
  } catch (error) {
    console.log("Error in getOutgoingFriendRequests", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
