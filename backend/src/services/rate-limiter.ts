// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const searchRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 15, // limit each IP to 20 requests per windowMs
  message: 'Too many search requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});
