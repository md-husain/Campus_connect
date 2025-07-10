import rateLimit from "express-rate-limit";

// Login Rate Limiter: max 5 attempts per 15 min
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

//  Register Rate Limiter: max 10 per 1 hour
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Too many accounts created from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
