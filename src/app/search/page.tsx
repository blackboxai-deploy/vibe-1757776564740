"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TrackCard } from '@/components/TrackCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { YouTubeAPI } from '@/lib/youtube-api';
import { SearchResult } from '@/types/music';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState<SearchResult>({
    tracks: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await YouTubeAPI.searchVideos({
        query: searchQuery,
        limit: 50
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults({
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Searching for "{query}"...</p>
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="space-y-8">
        {/* Search Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Search Music</h1>
          <p className="text-gray-400 text-lg">Find your favorite songs, artists, and albums</p>
        </div>

        {/* Popular Categories */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Pop', color: 'from-pink-500 to-red-500', query: 'pop music hits' },
              { name: 'Rock', color: 'from-red-500 to-orange-500', query: 'rock music' },
              { name: 'Hip Hop', color: 'from-green-500 to-teal-500', query: 'hip hop rap' },
              { name: 'Electronic', color: 'from-blue-500 to-purple-500', query: 'electronic dance music' },
              { name: 'Jazz', color: 'from-yellow-500 to-orange-500', query: 'jazz music' },
              { name: 'Classical', color: 'from-indigo-500 to-purple-500', query: 'classical music' },
              { name: 'R&B', color: 'from-purple-500 to-pink-500', query: 'r&b soul music' },
              { name: 'Country', color: 'from-orange-500 to-red-500', query: 'country music' },
            ].map((category) => (
              <button
                key={category.name}
                className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white font-bold text-left hover:scale-105 transition-transform`}
                onClick={() => window.location.href = `/search?q=${encodeURIComponent(category.query)}`}
              >
                <h3 className="text-lg">{category.name}</h3>
              </button>
            ))}
          </div>
        </section>

        {/* Trending Searches */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Trending Searches</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Taylor Swift', 'Drake', 'Bad Bunny', 'The Weeknd', 'Billie Eilish',
              'Ed Sheeran', 'Ariana Grande', 'Post Malone', 'Dua Lipa', 'Harry Styles'
            ].map((trend) => (
              <Button
                key={trend}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:border-purple-400 hover:text-white"
                onClick={() => window.location.href = `/search?q=${encodeURIComponent(trend)}`}
              >
                {trend}
              </Button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (searchResults.tracks.length === 0) {
    return (
      <div className="text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-white">No results found</h2>
        <p className="text-gray-400">
          We couldn't find anything for "{query}". Try adjusting your search.
        </p>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/search'}
            className="border-gray-600 text-gray-300 hover:border-purple-400 hover:text-white"
          >
            Browse Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Search results for "{query}"
        </h1>
        <p className="text-gray-400">
          Found {searchResults.tracks.length} tracks
        </p>
      </div>

      {/* Search Results */}
      <Tabs defaultValue="tracks" className="w-full">
        <TabsList className="bg-white/10 border-none">
          <TabsTrigger 
            value="tracks" 
            className="data-[state=active]:bg-white/20 text-white"
          >
            Songs ({searchResults.tracks.length})
          </TabsTrigger>
          <TabsTrigger 
            value="artists"
            className="data-[state=active]:bg-white/20 text-white"
            disabled
          >
            Artists (0)
          </TabsTrigger>
          <TabsTrigger 
            value="albums"
            className="data-[state=active]:bg-white/20 text-white"
            disabled
          >
            Albums (0)
          </TabsTrigger>
          <TabsTrigger 
            value="playlists"
            className="data-[state=active]:bg-white/20 text-white"
            disabled
          >
            Playlists (0)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracks" className="space-y-4">
          {/* Top Result */}
          {searchResults.tracks.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">Top Result</h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={searchResults.tracks[0].thumbnail}
                    alt={searchResults.tracks[0].title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {searchResults.tracks[0].title}
                    </h3>
                    <p className="text-gray-400 mb-2">
                      Song • {searchResults.tracks[0].artist}
                    </p>
                    <Button
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                      size="sm"
                    >
                      Play
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* All Results */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Songs</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <div className="space-y-1">
                {searchResults.tracks.map((track, index) => (
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
        </TabsContent>

        {/* Other tabs would go here when implemented */}
        <TabsContent value="artists">
          <div className="text-center py-8">
            <p className="text-gray-400">Artist search coming soon!</p>
          </div>
        </TabsContent>

        <TabsContent value="albums">
          <div className="text-center py-8">
            <p className="text-gray-400">Album search coming soon!</p>
          </div>
        </TabsContent>

        <TabsContent value="playlists">
          <div className="text-center py-8">
            <p className="text-gray-400">Playlist search coming soon!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}