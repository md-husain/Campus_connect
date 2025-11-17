import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./src/utils/ApiError.js";

const app = express()

// CORS setup
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));
/// ✅ Handle preflight requests globally
app.options("*", cors());
// Security and payload limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Serve static files from public/
app.use(express.static('public'));

// Cookie parser
app.use(cookieParser());

// Import routes
import userroutes from "./src/routes/user.routes.js";
import postroutes from "./src/routes/post.routes.js";
import commentroutes from "./src/routes/comment.routes.js";
import eventroutes from "./src/routes/event.routes.js";
import resourceroutes from "./src/routes/resource.routes.js";
import pollroutes from "./src/routes/poll.routes.js";

// Route declarations
app.use("/api/v1/user", userroutes);
app.use("/api/v1/posts", postroutes);
app.use("/api/v1/comments", commentroutes);
app.use("/api/v1/events", eventroutes);
app.use("/api/v1/resources", resourceroutes);
app.use("/api/v1/polls", pollroutes);

// Health check route
app.get("/", (req, res) => {
  res.send("CampusConnect Backend API is running");
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: null
    });
  }

  // Handle other errors
  console.error("Error:", err);
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null
  });
});

export default app;