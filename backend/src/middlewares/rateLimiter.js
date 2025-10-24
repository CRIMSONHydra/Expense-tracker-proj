import {ratelimit} from '../config/upstash.js';

const rateLimiter = async (req, res, next) => {
  try {
    // Use req.ip as the identifier to rate limit based on IP
    const ip = req.ip || "127.0.0.1"; // Fallback for environments where req.ip is not set
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;