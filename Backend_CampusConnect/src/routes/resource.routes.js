import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {
  uploadResource,
  getAllResources,
  getResourceById,
  getResourcesByCourse,
  getUserResources,
  updateResource,
  deleteResource
} from "../controllers/resource.controller.js";
import { upload } from "../middlewares/mullter_middlewares.js";

const router = Router();

// Public routes
router.get("/all", getAllResources);
router.get("/:resourceId", getResourceById);
router.get("/course/:courseId", getResourcesByCourse);
router.get("/user/:userId", getUserResources);

// Protected routes (require authentication)
router.post("/upload", VerifyJWT, upload.single("file"), uploadResource);
router.put("/:resourceId", VerifyJWT, updateResource);
router.delete("/:resourceId", VerifyJWT, deleteResource);

export default router;





