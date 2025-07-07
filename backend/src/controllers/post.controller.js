import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Post Content is Required" });
    }

    // extract userID from middleware
    const userId = req.user._id;

    const newPost = new Post({
      content,
      author: userId,
    });

    newPost.save();

    return res.status(201).json({
      message: "Post Successfully Created!",
      post: newPost,
    });
  } catch (error) {
    console.log("Error creating Post: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "fullName profilePic")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "fullName profilePic",
        },
      })
      .sort({createdAt: -1}) // newest first
    res.status(200).json(posts)
  } catch (error) {
    console.log("Error getting all-posts: ", error)
    res.status(400).json({message: "Server Error"})
  }
};
