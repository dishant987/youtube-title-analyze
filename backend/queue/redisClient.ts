import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

// Export connection config for BullMQ
export const redisConnection = {
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

// Optional: Keep a shared client for other Redis operations
export const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));

await redisClient.connect();
console.log("✅ Redis Connected Successfully");

export default redisClient;
