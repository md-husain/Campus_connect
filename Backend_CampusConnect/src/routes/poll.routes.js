import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPoll,
  getAllPolls,
  getActivePolls,
  getPollById,
  votePoll,
  updatePoll,
  deletePoll
} from "../controllers/poll.controller.js";

const router = Router();

// Public routes
router.get("/all", getAllPolls);
router.get("/active", getActivePolls);
router.get("/:pollId", getPollById);

// Protected routes (require authentication)
router.post("/create", VerifyJWT, createPoll);
router.post("/:pollId/vote", VerifyJWT, votePoll);
router.put("/:pollId", VerifyJWT, updatePoll);
router.delete("/:pollId", VerifyJWT, deletePoll);

export default router;





