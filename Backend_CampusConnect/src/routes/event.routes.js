import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  getAllEvents,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleAttendance
} from "../controllers/event.controller.js";

const router = Router();

// Public routes
router.get("/all", getAllEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/:eventId", getEventById);

// Protected routes (require authentication)
router.post("/create", VerifyJWT, createEvent);
router.put("/:eventId", VerifyJWT, updateEvent);
router.delete("/:eventId", VerifyJWT, deleteEvent);
router.post("/:eventId/attend", VerifyJWT, toggleAttendance);

export default router;





