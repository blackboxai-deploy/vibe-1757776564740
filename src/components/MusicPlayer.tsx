"use client";

import { useState } from 'react';
import { useAudioStore } from '@/lib/audio-context';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/youtube-api';

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    shuffle,
    setRepeatMode
  } = useAudioStore();

  const [isDragging, setIsDragging] = useState(false);

  // Handle progress bar dragging
  const handleProgressChange = (value: number[]) => {
    if (isDragging) {
      seek(value[0]);
    }
  };

  const handleProgressStart = () => {
    setIsDragging(true);
  };

  const handleProgressEnd = () => {
    setIsDragging(false);
  };

  if (!currentTrack) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400 text-sm">
          Select a track to start playing
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-between px-4">
      {/* Currently Playing Track Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <img
          src={currentTrack.thumbnail}
          alt={currentTrack.title}
          className="w-14 h-14 object-cover rounded"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-medium text-sm truncate">
            {currentTrack.title}
          </h3>
          <p className="text-gray-400 text-xs truncate">
            {currentTrack.artist}
          </p>
        </div>
        
        {/* Like Button */}
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white w-8 h-8 p-0"
        >
          🤍
        </Button>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className={`w-8 h-8 p-0 ${
              isShuffled ? 'text-purple-400' : 'text-gray-400 hover:text-white'
            }`}
            onClick={shuffle}
          >
            🔀
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:text-gray-300 w-8 h-8 p-0"
            onClick={previous}
          >
            ⏮️
          </Button>
          
          <Button
            size="sm"
            className="bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center"
            onClick={isPlaying ? pause : play}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:text-gray-300 w-8 h-8 p-0"
            onClick={next}
          >
            ⏭️
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className={`w-8 h-8 p-0 ${
              repeatMode !== 'off' ? 'text-purple-400' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => {
              const modes = ['off', 'all', 'one'] as const;
              const currentIndex = modes.indexOf(repeatMode);
              const nextMode = modes[(currentIndex + 1) % modes.length];
              setRepeatMode(nextMode);
            }}
          >
            {repeatMode === 'one' ? '🔂' : '🔁'}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center space-x-2">
          <span className="text-xs text-gray-400 font-medium min-w-[35px] text-right">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1">
            <Slider
              value={[isDragging ? currentTime : currentTime]}
              max={duration || 100}
              step={1}
              className="w-full cursor-pointer"
              onValueChange={handleProgressChange}
              onPointerDown={handleProgressStart}
              onPointerUp={handleProgressEnd}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium min-w-[35px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume and Additional Controls */}
      <div className="flex items-center space-x-2 flex-1 justify-end">
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white w-8 h-8 p-0 hidden md:flex"
        >
          📋
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white w-8 h-8 p-0 hidden lg:flex"
        >
          📺
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white w-8 h-8 p-0"
          onClick={toggleMute}
        >
          {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
        </Button>
        
        <div className="w-24 hidden md:block">
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            className="cursor-pointer"
            onValueChange={(value) => setVolume(value[0] / 100)}
          />
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white w-8 h-8 p-0 hidden lg:flex"
        >
          🖥️
        </Button>
      </div>
    </div>
  );
}