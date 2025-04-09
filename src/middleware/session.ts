import session from "express-session";
import { RedisStore } from "connect-redis";
import redis from "../database/redis.js";
import productionValue from "../modules/production.js";

export const sessionMiddleware = session({
  store: new RedisStore({ client: redis, ttl: 60 * 60 * 24 }),
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: productionValue(true, false),
    httpOnly: productionValue(true, false),
    maxAge: 1000 * 60 * 60 * 24
  }
});
