import { Queue } from "bullmq";
import redisClient, { redisConnection } from "./redisClient.js";

export const emailQueue = new Queue("email-queue", {
  connection: redisConnection,
});

export const addEmailToQueue = async (emailData) => {
  // Calculate job size
  const sizeBytes = Buffer.byteLength(JSON.stringify(emailData), "utf8");
  const sizeKB = (sizeBytes / 1024).toFixed(2);

  // Get Redis memory usage before adding
  const info = await redisClient.info("memory");
  const usedMemory = info.match(/used_memory_human:(.*)/)?.[1]?.trim();

  console.log(`🧠 Redis Used Before Add: ${usedMemory}`);
  console.log(`📦 Job Size: ${sizeKB} KB`);

  await emailQueue.add("send-email", emailData);

  // Optional: Get memory after adding
  const infoAfter = await redisClient.info("memory");
  const usedAfter = infoAfter.match(/used_memory_human:(.*)/)?.[1]?.trim();
  console.log(`📈 Redis Used After Add: ${usedAfter}`);
};
