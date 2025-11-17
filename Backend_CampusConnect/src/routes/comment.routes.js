import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment
} from "../controllers/comment.controller.js";

const router = Router();

// Public route
router.get("/post/:postId", getPostComments);

// Protected routes (require authentication)
router.post("/post/:postId", VerifyJWT, createComment);
router.put("/:commentId", VerifyJWT, updateComment);
router.delete("/:commentId", VerifyJWT, deleteComment);

export default router;





