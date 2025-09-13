"use client";

import { useState } from 'react';
import { Track } from '@/types/music';
import { useAudioStore } from '@/lib/audio-context';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/youtube-api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TrackCardProps {
  track: Track;
  showIndex?: boolean;
  index?: number;
  variant?: 'list' | 'grid';
}

export function TrackCard({ 
  track, 
  showIndex = false, 
  index, 
  variant = 'list' 
}: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { currentTrack, isPlaying, loadTrack, play, pause, addToQueue } = useAudioStore();
  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlay = () => {
    if (isCurrentTrack) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      loadTrack(track);
      setTimeout(() => play(), 100); // Small delay to ensure track is loaded
    }
  };

  const handleAddToQueue = () => {
    addToQueue(track);
  };

  if (variant === 'grid') {
    return (
      <div 
        className="group bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePlay}
      >
        <div className="relative">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full aspect-square object-cover rounded-lg mb-4"
            loading="lazy"
          />
          
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg transition-opacity duration-200 ${
            isHovered || isCurrentlyPlaying ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              {isCurrentlyPlaying ? '⏸️' : '▶️'}
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-white text-sm truncate">
            {track.title}
          </h3>
          <p className="text-gray-400 text-xs truncate">
            {track.artist}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 ${
        isCurrentTrack ? 'bg-white/10' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Index or Play Button */}
      <div className="w-8 flex items-center justify-center">
        {showIndex && !isHovered && !isCurrentTrack ? (
          <span className="text-gray-400 text-sm font-medium">
            {(index || 0) + 1}
          </span>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 hover:bg-white/20"
            onClick={handlePlay}
          >
            {isCurrentlyPlaying ? (
              <span className="text-purple-400 text-lg">⏸️</span>
            ) : (
              <span className="text-white text-lg">▶️</span>
            )}
          </Button>
        )}
      </div>

      {/* Album Art */}
      <div className="flex-shrink-0">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-12 h-12 object-cover rounded"
          loading="lazy"
        />
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-sm truncate ${
          isCurrentTrack ? 'text-purple-400' : 'text-white'
        }`}>
          {track.title}
        </h3>
        <p className="text-gray-400 text-xs truncate">
          {track.artist}
        </p>
      </div>

      {/* Duration */}
      <div className="text-gray-400 text-xs font-medium">
        {formatTime(track.duration)}
      </div>

      {/* Options Menu */}
      <div className={`transition-opacity duration-200 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 hover:bg-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-gray-400">⋯</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-md border-gray-700">
            <DropdownMenuItem 
              className="text-gray-200 hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToQueue();
              }}
            >
              Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-200 hover:bg-gray-800">
              Add to playlist
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-200 hover:bg-gray-800">
              Save to library
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-200 hover:bg-gray-800">
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}