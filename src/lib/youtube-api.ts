import { Track, YouTubeSearchOptions, SearchResult } from '@/types/music';

// YouTube search functionality (using YouTube Data API v3)
export class YouTubeAPI {
  private static readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';
  private static readonly YOUTUBE_API_KEY = (typeof window === 'undefined' ? process?.env?.NEXT_PUBLIC_YOUTUBE_API_KEY : '') || '';

  // Search for videos
  static async searchVideos(options: YouTubeSearchOptions): Promise<SearchResult> {
    try {
      const { query, type = 'video', limit = 20 } = options;
      
      const searchUrl = new URL(`${this.BASE_URL}/search`);
      searchUrl.searchParams.append('part', 'snippet');
      searchUrl.searchParams.append('type', type);
      searchUrl.searchParams.append('maxResults', limit.toString());
      searchUrl.searchParams.append('q', query);
      searchUrl.searchParams.append('key', this.YOUTUBE_API_KEY);
      searchUrl.searchParams.append('videoDefinition', 'any');
      searchUrl.searchParams.append('videoCategory', '10'); // Music category

      const response = await fetch(searchUrl.toString());
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Search failed');
      }

      const tracks: Track[] = await Promise.all(
        data.items?.map(async (item: any) => {
          const videoId = item.id.videoId;
          const duration = await this.getVideoDuration(videoId);
          
          return {
            id: videoId,
            title: this.cleanTitle(item.snippet.title),
            artist: item.snippet.channelTitle,
            duration,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            videoId
          };
        }) || []
      );

      return {
        tracks: tracks.filter(track => track.duration > 0), // Filter out non-music content
        artists: [],
        albums: [],
        playlists: []
      };
    } catch (error) {
      console.error('YouTube search error:', error);
      return { tracks: [], artists: [], albums: [], playlists: [] };
    }
  }

  // Get video duration using YouTube Data API
  private static async getVideoDuration(videoId: string): Promise<number> {
    try {
      const url = new URL(`${this.BASE_URL}/videos`);
      url.searchParams.append('part', 'contentDetails');
      url.searchParams.append('id', videoId);
      url.searchParams.append('key', this.YOUTUBE_API_KEY);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const duration = data.items[0].contentDetails.duration;
        return this.parseISO8601Duration(duration);
      }
      
      return 0;
    } catch (error) {
      console.error('Duration fetch error:', error);
      return 0;
    }
  }

  // Parse ISO 8601 duration format (PT4M33S) to seconds
  private static parseISO8601Duration(duration: string): number {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
    
    if (!matches) return 0;
    
    const hours = parseInt(matches[1] || '0');
    const minutes = parseInt(matches[2] || '0');
    const seconds = parseInt(matches[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Clean YouTube video titles (remove common music video indicators)
  private static cleanTitle(title: string): string {
    return title
      .replace(/\(Official .*?\)/gi, '')
      .replace(/\[Official .*?\]/gi, '')
      .replace(/\(.*?Video\)/gi, '')
      .replace(/\[.*?Video\]/gi, '')
      .replace(/\(HD\)/gi, '')
      .replace(/\[HD\]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Get trending music videos
  static async getTrendingMusic(limit: number = 20): Promise<Track[]> {
    try {
      const url = new URL(`${this.BASE_URL}/videos`);
      url.searchParams.append('part', 'snippet,contentDetails');
      url.searchParams.append('chart', 'mostPopular');
      url.searchParams.append('regionCode', 'US');
      url.searchParams.append('videoCategoryId', '10'); // Music category
      url.searchParams.append('maxResults', limit.toString());
      url.searchParams.append('key', this.YOUTUBE_API_KEY);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch trending music');
      }

      return data.items?.map((item: any) => ({
        id: item.id,
        title: this.cleanTitle(item.snippet.title),
        artist: item.snippet.channelTitle,
        duration: this.parseISO8601Duration(item.contentDetails.duration),
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        videoId: item.id
      })) || [];
    } catch (error) {
      console.error('Trending music fetch error:', error);
      return [];
    }
  }
}

// Get audio stream URL using ytdl-core (server-side only)
export async function getAudioStreamUrl(videoId: string): Promise<string | null> {
  try {
    // This will be handled by the API route
    const response = await fetch(`/api/stream/${videoId}`);
    if (response.ok) {
      const data = await response.json();
      return data.streamUrl;
    }
    return null;
  } catch (error) {
    console.error('Audio stream error:', error);
    return null;
  }
}

// Format time in MM:SS format
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Generate mock data for development
export function generateMockTracks(): Track[] {
  return [
    {
      id: 'mock-1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      thumbnail: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/13b5112a-2e06-4e74-b8a9-ce59c07cf756.png',
      url: 'https://example.com/mock-audio-1',
      videoId: 'mock-video-1'
    },
    {
      id: 'mock-2',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: 233,
      thumbnail: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b72ae2f9-c055-41ce-94d8-a0d777fd0873.png',
      url: 'https://example.com/mock-audio-2',
      videoId: 'mock-video-2'
    },
    {
      id: 'mock-3',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      duration: 174,
      thumbnail: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/77e3b092-0402-45d8-a49b-777b5197ef42.png',
      url: 'https://example.com/mock-audio-3',
      videoId: 'mock-video-3'
    },
    {
      id: 'mock-4',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      duration: 178,
      thumbnail: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/175c9033-0768-44f2-bdee-d703fa50b765.png',
      url: 'https://example.com/mock-audio-4',
      videoId: 'mock-video-4'
    },
    {
      id: 'mock-5',
      title: 'As It Was',
      artist: 'Harry Styles',
      album: "Harry's House",
      duration: 167,
      thumbnail: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/92032ba5-28a7-455a-ae1c-e4b9455f43d6.png',
      url: 'https://example.com/mock-audio-5',
      videoId: 'mock-video-5'
    }
  ];
}