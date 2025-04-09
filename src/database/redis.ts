import Redis from "ioredis";
import productionValue from "../modules/production.js";

const redisUrl = productionValue(
  process.env.REDIS_URL,
  process.env.REDIS_PUBLIC_URL
);

if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is required");
}

const start = Date.now();
console.log("Connecting to Redis...");

const redis = new Redis(redisUrl);

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
  process.exit(-1);
});

redis.on("connect", () => {
  console.log(`Connected to Redis in ${Date.now() - start}ms`);
});

export default redis;
