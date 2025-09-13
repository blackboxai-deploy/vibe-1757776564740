"use client";

import { useEffect, useState } from 'react';
import { TrackCard } from '@/components/TrackCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { YouTubeAPI, generateMockTracks } from '@/lib/youtube-api';
import { useAudioStore } from '@/lib/audio-context';
import { Track } from '@/types/music';

export default function HomePage() {
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loadTrack, play } = useAudioStore();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // For now, use mock data. In production, this would fetch from YouTube API
      const mockTracks = generateMockTracks();
      setFeaturedTracks(mockTracks.slice(0, 6));
      setTrendingTracks(mockTracks.slice(0, 10));
      setRecentlyPlayed(mockTracks.slice(2, 7));

      // Try to load some real trending music
      try {
        const trending = await YouTubeAPI.getTrendingMusic(10);
        if (trending.length > 0) {
          setTrendingTracks(trending);
        }
      } catch (error) {
        console.log('Using mock data for trending tracks');
      }

    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPlay = (track: Track) => {
    loadTrack(track);
    setTimeout(() => play(), 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to Freefy
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Stream millions of songs for free
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => featuredTracks[0] && handleQuickPlay(featuredTracks[0])}
              >
                Play Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Browse Music
              </Button>
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/46d14b63-95a5-467d-8ad3-9ff0106af711.png"
              alt="Background"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
        </div>
      </section>

      {/* Quick Play Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Featured Tracks</h2>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Show all
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTracks.map((track) => (
            <TrackCard 
              key={track.id} 
              track={track} 
              variant="grid"
            />
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Show all
          </Button>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <div className="space-y-1">
            {trendingTracks.map((track, index) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                variant="list"
                showIndex
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recently Played</h2>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Show all
            </Button>
          </div>
          
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {recentlyPlayed.map((track) => (
                <div key={track.id} className="flex-shrink-0 w-48">
                  <TrackCard 
                    track={track} 
                    variant="grid"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>
      )}

      {/* Made For You */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Made For You</h2>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Show all
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mock playlists */}
          {[
            { name: 'Discover Weekly', description: 'Your weekly mixtape of fresh music' },
            { name: 'Daily Mix 1', description: 'Ed Sheeran, Harry Styles, and more' },
            { name: 'Liked Songs', description: 'All your favorite tracks in one place' },
            { name: 'Chill Hits', description: 'Chill vibes and relaxed beats' },
          ].map((playlist, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
              <img
                src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1a60500f-58da-4a13-8da9-d82cc7740a0b.png '+')}+Playlist+Cover`}
                alt={playlist.name}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-white text-sm truncate mb-1">
                {playlist.name}
              </h3>
              <p className="text-gray-400 text-xs line-clamp-2">
                {playlist.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}