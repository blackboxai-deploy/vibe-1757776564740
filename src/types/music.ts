export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  thumbnail: string;
  url: string;
  videoId: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Artist {
  id: string;
  name: string;
  thumbnail?: string;
  subscribers?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
  thumbnail: string;
  tracks: Track[];
}

export interface SearchResult {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

export interface AudioState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Track[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'one' | 'all';
}

export interface PlayerControls {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  shuffle: () => void;
  setRepeatMode: (mode: 'off' | 'one' | 'all') => void;
}

export interface YouTubeSearchOptions {
  query: string;
  type?: 'video' | 'playlist' | 'channel';
  limit?: number;
}

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  author: string;
  length_seconds: number;
  thumbnail: string;
  description: string;
}