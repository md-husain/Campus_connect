import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

// @desc    Create a new post
const createPost = asynchandler(async (req, res) => {
  const { content, tags, title } = req.body;
  const userId = req.user._id;

  console.log("📝 Creating post for user:", userId);
  console.log("📝 Post data:", { content: content?.substring(0, 50), tags, title });

  if (!content || !content.trim()) {
    throw new ApiError(400, "Post content is required");
  }

  // Create tags array from comma-separated string
  const tagsArray = tags ? tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

  // For now, completely skip media handling
  const mediaUrl = "";

  try {
    const post = await Post.create({
      content: content.trim(),
      title: title ? title.trim() : "",
      media: mediaUrl,
      owner: userId,
      tags: tagsArray
    });

    console.log("✅ Post created with ID:", post._id);

    const createdPost = await Post.findById(post._id).populate("owner", "username fullname avatar");

    return res.status(201).json(
      new ApiResponse(201, createdPost, "Post created successfully")
    );
  } catch (dbError) {
    console.error("❌ Database error creating post:", dbError);
    throw new ApiError(500, "Failed to create post");
  }
});

// @desc    Get all posts with pagination
const getAllPosts = asynchandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .populate("owner", "username fullname avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments();
  const totalPages = Math.ceil(totalPosts / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, "Posts fetched successfully")
  );
});

// @desc    Toggle like on post
const toggleLikePost = asynchandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    // Unlike the post
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());
  } else {
    // Like the post
    post.likes.push(userId);
  }

  await post.save();

  return res.status(200).json(
    new ApiResponse(200, {
      postId,
      isLiked: !isLiked,
      likesCount: post.likes.length
    }, isLiked ? "Post unliked" : "Post liked")
  );
});

export { createPost, getAllPosts, toggleLikePost };
