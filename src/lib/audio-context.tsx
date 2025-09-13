"use client";

import React, { useRef, useEffect } from 'react';
import { create } from 'zustand';
import { Track, AudioState, PlayerControls } from '@/types/music';

// Zustand store for audio state
interface AudioStore extends AudioState, PlayerControls {
  audioElement: HTMLAudioElement | null;
  setAudioElement: (element: HTMLAudioElement) => void;
  loadTrack: (track: Track) => void;
  updateTime: (currentTime: number, duration: number) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  // Initial state
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isMuted: false,
  queue: [],
  currentIndex: 0,
  isShuffled: false,
  repeatMode: 'off',
  audioElement: null,

  // Actions
  setAudioElement: (element: HTMLAudioElement) => {
    set({ audioElement: element });
  },

  loadTrack: (track: Track) => {
    const { audioElement } = get();
    if (audioElement && track.url) {
      audioElement.src = track.url;
      set({ currentTrack: track });
    }
  },

  play: () => {
    const { audioElement, currentTrack } = get();
    if (audioElement && currentTrack) {
      audioElement.play()
        .then(() => set({ isPlaying: true }))
        .catch(console.error);
    }
  },

  pause: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      set({ isPlaying: false });
    }
  },

  next: () => {
    const { queue, currentIndex, repeatMode } = get();
    if (queue.length === 0) return;

    let nextIndex;
    if (repeatMode === 'one') {
      nextIndex = currentIndex;
    } else if (currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (repeatMode === 'all') {
      nextIndex = 0;
    } else {
      return; // End of queue
    }

    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      get().loadTrack(nextTrack);
      set({ currentIndex: nextIndex });
      get().play();
    }
  },

  previous: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    const prevTrack = queue[prevIndex];
    
    if (prevTrack) {
      get().loadTrack(prevTrack);
      set({ currentIndex: prevIndex });
      get().play();
    }
  },

  seek: (time: number) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.currentTime = time;
      set({ currentTime: time });
    }
  },

  setVolume: (volume: number) => {
    const { audioElement } = get();
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioElement) {
      audioElement.volume = clampedVolume;
    }
    set({ volume: clampedVolume, isMuted: false });
  },

  toggleMute: () => {
    const { audioElement, isMuted, volume } = get();
    if (audioElement) {
      if (isMuted) {
        audioElement.volume = volume;
        set({ isMuted: false });
      } else {
        audioElement.volume = 0;
        set({ isMuted: true });
      }
    }
  },

  addToQueue: (track: Track) => {
    set(state => ({
      queue: [...state.queue, track]
    }));
  },

  removeFromQueue: (index: number) => {
    set(state => ({
      queue: state.queue.filter((_, i) => i !== index),
      currentIndex: index < state.currentIndex ? state.currentIndex - 1 : state.currentIndex
    }));
  },

  shuffle: () => {
    const { queue, currentTrack } = get();
    if (queue.length <= 1) return;

    const shuffled = [...queue];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newIndex = currentTrack ? shuffled.findIndex(t => t.id === currentTrack.id) : 0;
    
    set({ 
      queue: shuffled, 
      currentIndex: Math.max(0, newIndex),
      isShuffled: !get().isShuffled 
    });
  },

  setRepeatMode: (mode: 'off' | 'one' | 'all') => {
    set({ repeatMode: mode });
  },

  updateTime: (currentTime: number, duration: number) => {
    set({ currentTime, duration });
  }
}));

// Audio Context Provider
interface AudioContextProviderProps {
  children: React.ReactNode;
}

export const AudioContextProvider: React.FC<AudioContextProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { setAudioElement, updateTime, next } = useAudioStore();

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      setAudioElement(audio);

      const handleTimeUpdate = () => {
        updateTime(audio.currentTime, audio.duration || 0);
      };

      const handleEnded = () => {
        next();
      };

      const handleLoadedMetadata = () => {
        updateTime(audio.currentTime, audio.duration || 0);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [setAudioElement, updateTime, next]);

  return (
    <>
      <audio ref={audioRef} preload="metadata" />
      {children}
    </>
  );
};