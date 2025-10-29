import express from "express";
import dotenv from "dotenv";
import { videos } from "../db/schema.js";
import { db } from "../db/drizzle.js";
import { sendVideoLinkEmail } from "../lib/mailer.js";
import { generateTitleAndReason } from "../lib/gemini.js";
import {
  fetchRecentVideosByChannel,
  getChannelIdFromUsername,
} from "../lib/youtube.js";
dotenv.config();

const router = express.Router();
const YT_KEY = process.env.YOUTUBE_API_KEY!;

router.post("/analyze", async (req, res) => {
  try {
    const { username, channelId, maxResults = 5, emailTo, onlyNew } = req.body;

    let cid = channelId;
    if (!cid) {
      if (!username)
        return res
          .status(400)
          .json({ error: "username or channelId required" });
      cid = await getChannelIdFromUsername(username, YT_KEY);
    }

    const videosList = await fetchRecentVideosByChannel(
      cid,
      YT_KEY,
      maxResults
    );
    const results: any[] = [];
    let emailHtmlContent = ""; // ✅ Collect content here

    for (const v of videosList) {
      const { newTitle, reason } = await generateTitleAndReason(v.title, v.url);

      await db.insert(videos).values({
        youtubeId: v.youtubeId,
        channelId: cid,
        originalTitle: v.title,
        newTitle,
        reason,
        url: v.url,
      });

      results.push({
        youtubeId: v.youtubeId,
        originalTitle: v.title,
        newTitle,
        reason,
        url: v.url,
      });

      // ✅ Append to one email body
      if (emailTo) {
        emailHtmlContent += `
          <div style="margin-bottom:20px;">
            <p><strong>Original:</strong> ${v.title}</p>
            <p><strong>Suggested:</strong> ${newTitle}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p><a href="${v.url}">${v.url}</a></p>
          </div>
          <hr />
        `;
      }
    }

    // ✅ Send only one email for all videos
    if (emailTo && emailHtmlContent.trim()) {
      const now = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

      const summaryHtml = `
    <div style="margin-bottom:20px; font-size:16px;">
      <p><strong>User:</strong> ${username || channelId}</p>
      <p><strong>Total Videos Analyzed:</strong> ${results.length}</p>
      <p><strong>Date:</strong> ${now}</p>
    </div>
    <hr/>
  `;

      await sendVideoLinkEmail(
        emailTo,
        `YouTube Video Analysis Report (${results.length} videos)`,
        `<h2>YouTube AI Analysis Report</h2>
     ${summaryHtml}
     ${emailHtmlContent}`
      );
    }

    return res.json({
      ok: true,
      channelId: cid,
      count: results.length,
      results,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "internal error" });
  }
});

export default router;
