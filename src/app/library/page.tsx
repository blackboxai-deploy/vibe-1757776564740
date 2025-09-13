'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { TrackCard } from '@/components/TrackCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAudioStore } from '@/lib/audio-context';
import { Track, Playlist } from '@/types/music';

export default function LibraryPage() {
  const { loadTrack, play } = useAudioStore();
  
  // Mock data for favorites and playlists for now
  const favorites: Track[] = [];
  const playlists: Playlist[] = [];
  
  const createPlaylist = (name: string) => {
    console.log('Creating playlist:', name);
    // This would be implemented with proper state management
  };
  
  const removeFromFavorites = (trackId: string) => {
    console.log('Removing from favorites:', trackId);
  };
  
  const deletePlaylist = (playlistId: string) => {
    console.log('Deleting playlist:', playlistId);
  };

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('favorites');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handlePlayFavorites = (track: Track) => {
    loadTrack(track);
    play();
  };

  const handlePlayPlaylist = (track: Track, playlist: Playlist) => {
    loadTrack(track);
    play();
  };

  const handleRemoveFavorite = (trackId: string) => {
    removeFromFavorites(trackId);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    deletePlaylist(playlistId);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-white">Your Library</h1>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                    <span className="mr-2">➕</span>
                    Create Playlist
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Playlist</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter playlist name..."
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreatePlaylist();
                        }
                      }}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="border-gray-600 text-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreatePlaylist}
                        className="bg-purple-500 text-white hover:bg-purple-600"
                        disabled={!newPlaylistName.trim()}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-white/10 border-white/20">
              <TabsTrigger 
                value="favorites" 
                className="data-[state=active]:bg-purple-500"
              >
                <span className="mr-2">❤️</span>
                Liked Songs ({favorites.length})
              </TabsTrigger>
              <TabsTrigger 
                value="playlists" 
                className="data-[state=active]:bg-purple-500"
              >
                <span className="mr-2">📋</span>
                Playlists ({playlists.length})
              </TabsTrigger>
              <TabsTrigger 
                value="recent" 
                className="data-[state=active]:bg-purple-500"
              >
                <span className="mr-2">🕒</span>
                Recently Played
              </TabsTrigger>
            </TabsList>

            {/* Liked Songs Tab */}
            <TabsContent value="favorites" className="space-y-6">
              {favorites.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Liked Songs</h2>
                      <p className="text-gray-400">{favorites.length} songs</p>
                    </div>
                    <Button
                      onClick={() => favorites.length > 0 && handlePlayFavorites(favorites[0])}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      <span className="mr-2">▶️</span>
                      Play All
                    </Button>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                    <div className="space-y-1">
                      {favorites.map((track, index) => (
                        <motion.div
                          key={track.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group"
                        >
                          <TrackCard
                            track={track}
                            variant="list"
                            showIndex
                            index={index}
                            onPlay={() => handlePlayFavorites(track)}
                            onRemove={() => handleRemoveFavorite(track.id)}
                            showRemove
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <span className="text-8xl mb-4 block">💔</span>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    No liked songs yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Start liking songs to see them here
                  </p>
                  <Button
                    onClick={() => window.location.href = '/search'}
                    className="bg-purple-500 text-white hover:bg-purple-600"
                  >
                    Browse Music
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Playlists Tab */}
            <TabsContent value="playlists" className="space-y-6">
              {playlists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {playlists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 relative"
                    >
                      <div className="aspect-square mb-4 relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                        {playlist.thumbnail ? (
                          <img
                            src={playlist.thumbnail}
                            alt={playlist.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl text-white">🎵</span>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <Button
                            size="icon"
                            className="bg-green-500 text-white hover:bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={() => {
                              if (playlist.tracks.length > 0) {
                                handlePlayPlaylist(playlist.tracks[0], playlist);
                              }
                            }}
                          >
                            <span className="text-xl">▶️</span>
                          </Button>
                        </div>
                      </div>

                      <h3 className="font-bold text-white text-lg mb-2 truncate">
                        {playlist.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {playlist.tracks.length} songs
                      </p>

                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          onClick={() => window.location.href = `/playlist/${playlist.id}`}
                        >
                          View Playlist
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeletePlaylist(playlist.id)}
                        >
                          🗑️
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <span className="text-8xl mb-4 block">📁</span>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    No playlists yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Create your first playlist to organize your music
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-purple-500 text-white hover:bg-purple-600"
                  >
                    <span className="mr-2">➕</span>
                    Create Playlist
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Recently Played Tab */}
            <TabsContent value="recent" className="space-y-6">
              <div className="text-center py-16">
                <span className="text-8xl mb-4 block">🕒</span>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Recently Played
                </h3>
                <p className="text-gray-400 mb-6">
                  Your listening history will appear here
                </p>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-purple-500 text-white hover:bg-purple-600"
                >
                  Start Listening
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}