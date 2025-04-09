import rateLimit from "express-rate-limit";
import RedisStore, { RedisReply } from "rate-limit-redis";
import redis from "../database/redis.js";

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 5,
  keyPrefix = "rl"
}) => {
  if (process.env.NODE_ENV !== "production") {
    return (req: any, res: any, next: any) => next();
  }

  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) =>
        redis.call(...(args as [string, ...string[]])) as Promise<RedisReply>,
      prefix: keyPrefix
    }),
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 429,
        message: "You are being ratelimited."
      });
    }
  });
};
