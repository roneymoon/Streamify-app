import express from "express"
import { createPost, getAllPosts } from "../controllers/post.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"



const router = express.Router();


// @route   POST /api/posts
// @desc    Create a new post
// @access  Private

router.post("/", protectRoute, createPost)
router.get("/", getAllPosts)

export default router;