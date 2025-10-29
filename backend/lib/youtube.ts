import axios from "axios";

const YT_BASE = "https://www.googleapis.com/youtube/v3";

export async function getChannelIdFromUsername(
  username: string,
  apiKey: string
) {
  // Remove @ if user entered handle
  const cleanUser = username.startsWith("@") ? username.substring(1) : username;

  try {
    // Try old-style username
    const res = await axios.get(`${YT_BASE}/channels`, {
      params: { part: "id", forUsername: cleanUser, key: apiKey },
    });

    if (res.data.items && res.data.items.length > 0) {
      return res.data.items[0].id;
    }
  } catch (e) {
    console.log("channels API failed -> fallback to search");
  }

  // ✅ Fallback: search by query
  const s = await axios.get(`${YT_BASE}/search`, {
    params: {
      part: "snippet",
      q: cleanUser,
      type: "channel",
      maxResults: 1,
      key: apiKey,
    },
  });
  if (s.data.items && s.data.items.length > 0) {
    return s.data.items[0].snippet.channelId;
  }

  throw new Error("Channel not found for username");
}

export async function fetchRecentVideosByChannel(
  channelId: string,
  apiKey: string,
  maxResults = 10
) {
  // Use search.list to get recent uploads
  const res = await axios.get(`${YT_BASE}/search`, {
    params: {
      part: "snippet",
      channelId,
      order: "date",
      maxResults,
      type: "video",
      key: apiKey,
    },
  });

  return res.data.items.map((it: any) => ({
    youtubeId: it.id.videoId,
    title: it.snippet.title,
    publishedAt: it.snippet.publishedAt,
    description: it.snippet.description,
    url: `https://www.youtube.com/watch?v=${it.id.videoId}`,
  }));
}
