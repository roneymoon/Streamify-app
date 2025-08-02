import express from "express"
import { createPost, editPost, getAllPosts, getSinglePost, deletePost, toggleLikePost, addComment, deleteComment } from "../controllers/post.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"



const router = express.Router();


// @route   POST /api/posts
// @desc    Create a new post
// @access  Private

router.post("/", protectRoute, createPost)
router.get("/", getAllPosts)
router.get("/:id", getSinglePost)
router.put("/:id", protectRoute, editPost)
router.delete("/:id", protectRoute, deletePost)
router.post("/:id/like", protectRoute, toggleLikePost)

// comments routes
router.post("/:id/comment", protectRoute, addComment)
router.delete("/comments/:id", protectRoute, deleteComment)

export default router;