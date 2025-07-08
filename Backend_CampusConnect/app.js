import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()


// CORS setup
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Security and payload limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Serve static files from public/
app.use(express.static('public'));

// Cookie parser
app.use(cookieParser());

// Import routes
// Example: import authRoutes from "./routes/auth.routes.js";
// app.use("/api/v1/auth", authRoutes);

app.use("/", (req, res) => {
  res.send("CampusConnect Backend API is running ");
});

export default app;