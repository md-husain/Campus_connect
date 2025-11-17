import rateLimit from "express-rate-limit";

// Completely disable rate limiting in development
const isDevelopment = process.env.NODE_ENV !== 'production';

// Login Rate Limiter
export const loginRateLimiter = isDevelopment
  ? (req, res, next) => {
      // Skip rate limiting completely in development
      next();
    }
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5,
      message: {
        success: false,
        message: "Too many login attempts from this IP, please try again after 15 minutes.",
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message: "Too many login attempts from this IP, please try again after 15 minutes.",
        });
      }
    });

// Register Rate Limiter
export const registerRateLimiter = isDevelopment
  ? (req, res, next) => {
      // Skip rate limiting completely in development
      next();
    }
  : rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10,
      message: {
        success: false,
        message: "Too many accounts created from this IP, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message: "Too many accounts created from this IP, please try again later.",
        });
      }
    });
