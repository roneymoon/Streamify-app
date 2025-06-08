import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests
} from "../controllers/user.controller.js";

const router = express.Router();

// apply this middleware to all user routes
router.use(protectRoute);

// fetching data for displaying on home page
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

// friend request functionalities
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
// in-future try to implement a reject a friendrequest route

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default router;
