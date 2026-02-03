
const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

export async function getChannelVideos() {
  if (!API_KEY || !CHANNEL_ID) {
    console.warn("YouTube API Key or Channel ID is not set in .env file. Returning empty array.");
    return [];
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=12&order=date&type=video&key=${API_KEY}`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );

    if (!res.ok) {
      console.error('Failed to fetch YouTube videos:', await res.text());
      return [];
    }

    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching youtube videos:', error);
    return [];
  }
}
