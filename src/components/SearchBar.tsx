"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { YouTubeAPI } from '@/lib/youtube-api';
import { Track } from '@/types/music';

interface SearchBarProps {
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchBar({ onFocus, onBlur }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await YouTubeAPI.searchVideos({
        query: searchQuery,
        limit: 5
      });
      setSearchResults(results.tracks);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleFocus = () => {
    onFocus?.();
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = () => {
    onBlur?.();
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search songs, artists, albums..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-400 pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isSearching ? (
            <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full" />
          ) : (
            <span className="text-gray-400">🔍</span>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">Quick Results</div>
            <div className="space-y-1">
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  className="p-2 rounded hover:bg-white/10 cursor-pointer transition-colors"
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setShowResults(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {track.title}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {query && (
              <div className="border-t border-gray-700 mt-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start text-gray-300 hover:text-white"
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setShowResults(false);
                  }}
                >
                  See all results for "{query}"
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}