import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, getAllPosts, toggleLikePost } from "../controllers/post.controller.js";

const router = Router();

// Public routes
router.get("/all", getAllPosts);

// Protected routes (require authentication)
router.post("/create", VerifyJWT, createPost);
router.post("/:postId/like", VerifyJWT, toggleLikePost);

export default router;




