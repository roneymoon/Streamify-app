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

    // Check if content is a string
    if (typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ message: "Post content must be a non-empty string." });
    }

    const userId = req.user._id;

    const newPost = await new Post({
      content,
      author: userId,
    }).save();

    return res.status(201).json({
      message: "Post successfully created!",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating Post:", error);
    return res.status(500).json({ message: "Internal Server Error" });
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
      .sort({ createdAt: -1 }); // newest first
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error getting all-posts: ", error);
    res.status(400).json({ message: "Server Error" });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId)
      .populate("author", "fullName profilePic")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "fullName profilePic",
        },
      });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.log("Error fetching single post: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim() == "") {
      return res.status(400).json({ message: "content cannot be empty" });
    }

    const post = await Post.findById(id);

    // validation check
    if (!post) {
      return res.status(400).json({ message: "Post is not found" });
    }

    // auth checking - invalid credentials
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "User is not authenticated" });
    }

    post.content = content;
    await post.save();

    return res.status(200).json({
      message: "Post Updated Successfully",
      post,
    });
  } catch (error) {
    console.log("Error Updating Post: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    // validation check
    if (!post) {
      return res.status(400).json({ message: "Post is not found" });
    }

    // auth checking - invalid credentials
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "User is not authenticated" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post is Deleted Successfully" });
  } catch (error) {
    console.log("Error deleting post:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params; // post id
    const userId = req.user._id; // user id

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
      likedByUser: !alreadyLiked,
    });
  } catch (error) {
    console.log("Error toggling like: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body
    const userId = req.user._id;

    if(!content || content.trim() === ""){
      return res.status(400).json({message: "Comment content cannot be empty"})
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      post: id,
      author: userId,
      content
    })

    const savedComment = await newComment.save()

    // push the comments-id into post's comments array
    post.comments.push(savedComment._id)
    await post.save()

    return res.status(201).json({
      message: 'comment added Successfully',
      comment: savedComment
    })

  } catch (error) {
    console.log("Error adding comment:", error);
    return res.status(500).json({ message: "Internal Server Error" })
  }9
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.author || comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "User not authorized to delete this comment" });
    }

    // Remove comment ID from the post.comments array
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    // Delete the comment
    await comment.deleteOne();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("Error deleting comment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
