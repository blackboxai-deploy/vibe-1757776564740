import { NextRequest, NextResponse } from 'next/server';
import { YouTubeAPI } from '@/lib/youtube-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const trendingTracks = await YouTubeAPI.getTrendingMusic(limit);

    return NextResponse.json({
      tracks: trendingTracks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trending API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending music' },
      { status: 500 }
    );
  }
}