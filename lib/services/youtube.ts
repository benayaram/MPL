import { dbStore } from '../db/store';
import { LiveStatusCache } from '../models/schema';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export async function fetchLiveStatus(): Promise<LiveStatusCache> {
  const cached = dbStore.getLiveStatusCache();
  const now = Date.now();

  // If cache is fresh, return cached status
  if (cached && now - cached.checkedAt < CACHE_TTL_MS) {
    return cached;
  }

  const settings = dbStore.getSettings();
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || settings.youtubeChannelId;

  // Fallback defaults if API key is not yet set
  const fallback: LiveStatusCache = {
    isLive: false,
    videoId: 'live_stream_placeholder', // YouTube video ID or placeholder
    title: 'MPL Ministries Weekly Live Prayer & Fellowship',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    checkedAt: now
  };

  if (!apiKey || !channelId) {
    dbStore.setLiveStatusCache(fallback);
    return fallback;
  }

  try {
    // 1. Query YouTube API for active live broadcast
    const liveUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`;
    const liveRes = await fetch(liveUrl);
    const liveData = await liveRes.json();

    if (liveData.items && liveData.items.length > 0) {
      const item = liveData.items[0];
      const liveStatus: LiveStatusCache = {
        isLive: true,
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        checkedAt: now
      };
      dbStore.setLiveStatusCache(liveStatus);
      return liveStatus;
    }

    // 2. If not live, fetch the latest video from channel
    const latestUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1&key=${apiKey}`;
    const latestRes = await fetch(latestUrl);
    const latestData = await latestRes.json();

    if (latestData.items && latestData.items.length > 0) {
      const item = latestData.items[0];
      const status: LiveStatusCache = {
        isLive: false,
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        checkedAt: now
      };
      dbStore.setLiveStatusCache(status);
      return status;
    }

    dbStore.setLiveStatusCache(fallback);
    return fallback;
  } catch (error) {
    console.error('Error fetching YouTube live status:', error);
    dbStore.setLiveStatusCache(fallback);
    return fallback;
  }
}
