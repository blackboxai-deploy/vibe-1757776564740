import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Validate video ID format
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return NextResponse.json(
        { error: 'Invalid video ID format' },
        { status: 400 }
      );
    }

    try {
      // Import ytdl-core dynamically to avoid build issues
      const ytdl = await import('ytdl-core');
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Check if video exists and is valid
      if (!ytdl.validateURL(videoUrl)) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL' },
          { status: 400 }
        );
      }

      // Get video info
      const info = await ytdl.getInfo(videoUrl);
      
      // Find the best audio format
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      const bestAudio = audioFormats.find(format => 
        format.hasAudio && 
        !format.hasVideo && 
        format.container === 'mp4' &&
        format.audioBitrate
      ) || audioFormats[0];

      if (!bestAudio) {
        return NextResponse.json(
          { error: 'No audio stream available' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        streamUrl: bestAudio.url,
        quality: bestAudio.audioBitrate,
        container: bestAudio.container,
        contentLength: bestAudio.contentLength,
        videoDetails: {
          title: info.videoDetails.title,
          author: info.videoDetails.author.name,
          lengthSeconds: info.videoDetails.lengthSeconds,
          thumbnail: info.videoDetails.thumbnails[0]?.url
        }
      });
    } catch (importError) {
      console.error('Failed to import ytdl-core:', importError);
      return NextResponse.json(
        { error: 'Audio streaming service unavailable' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Stream API error:', error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes('Video unavailable')) {
        return NextResponse.json(
          { error: 'Video is unavailable' },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Private video')) {
        return NextResponse.json(
          { error: 'Video is private' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to get audio stream' },
      { status: 500 }
    );
  }
}

// Handle CORS for audio streaming
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}