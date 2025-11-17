import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";

// @desc    Create a comment on a post
const createComment = asynchandler(async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  if (!text) {
    throw new ApiError(400, "Comment text is required");
  }

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    text,
    post: postId,
    owner: userId
  });

  // Add comment to post
  post.comments.push(comment._id);
  await post.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate("owner", "username fullname avatar");

  return res.status(201).json(
    new ApiResponse(201, populatedComment, "Comment created successfully")
  );
});

// @desc    Get all comments for a post
const getPostComments = asynchandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .populate("owner", "username fullname avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, comments, "Comments fetched successfully")
  );
});

// @desc    Update a comment
const updateComment = asynchandler(async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  if (!text) {
    throw new ApiError(400, "Comment text is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only update your own comments");
  }

  comment.text = text;
  await comment.save();

  const updatedComment = await Comment.findById(commentId)
    .populate("owner", "username fullname avatar");

  return res.status(200).json(
    new ApiResponse(200, updatedComment, "Comment updated successfully")
  );
});

// @desc    Delete a comment
const deleteComment = asynchandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if user owns the comment or is admin
  if (comment.owner.toString() !== userId.toString() && req.user.role !== "Admin") {
    throw new ApiError(403, "You can only delete your own comments");
  }

  // Remove comment from post
  await Post.findByIdAndUpdate(
    comment.post,
    { $pull: { comments: commentId } }
  );

  // Delete the comment
  await Comment.findByIdAndDelete(commentId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Comment deleted successfully")
  );
});

export {
  createComment,
  getPostComments,
  updateComment,
  deleteComment
};

