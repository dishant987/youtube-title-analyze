import { Worker } from "bullmq";
import redisClient, { redisConnection } from "../redisClient.js";
import { sendVideoLinkEmail } from "../../lib/mailer.js";

const worker = new Worker(
  "email-queue",
  async (job) => {
    const { to, subject, html } = job.data;
    console.log("📨 Sending queued email to:", to);
    await sendVideoLinkEmail(to, subject, html);
  },
  {
    connection: redisConnection,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Email Job Completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Email Job Failed: ${job?.id}`, err);
});
