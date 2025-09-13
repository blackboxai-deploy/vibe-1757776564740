'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Using text-based icons instead of lucide-react
const SearchIcon = () => <span className="text-lg">🔍</span>;
const HomeIcon = () => <span className="text-lg">🏠</span>;
const LibraryIcon = () => <span className="text-lg">📚</span>;
import { useAudioStore } from '@/lib/audio-context';

export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { queue } = useAudioStore();
  // Mock data for favorites and playlists for now
  const favorites: any[] = [];
  const playlists: any[] = [];

  const navigationItems = [
    { href: '/', label: 'Home', icon: HomeIcon, isActive: true },
    { href: '/search', label: 'Search', icon: SearchIcon },
    { href: '/library', label: 'Your Library', icon: LibraryIcon },
  ];

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-white font-bold text-xl">Freefy</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.isActive
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <Input
                  placeholder="Search songs, artists, or playlists..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <span className="text-lg">🔍</span>
              </Button>

              {/* Profile/Menu Button */}
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  Sign In
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                  Get Premium
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <span className="text-lg">✕</span>
                ) : (
                  <span className="text-lg">☰</span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-white/10 bg-black/90 p-4"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <Input
                placeholder="Search music..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </nav>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed left-0 top-16 bottom-0 w-80 bg-black/95 backdrop-blur-md z-40 md:hidden overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Main Navigation */}
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      item.isActive
                        ? 'text-white bg-white/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-white font-semibold mb-4 px-4">Your Music</h3>
                <div className="space-y-2">
                  <Link
                    href="/favorites"
                    className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">❤️</span>
                    <span>Liked Songs</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {favorites.length}
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-3 h-auto text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    <span className="text-lg mr-3">➕</span>
                    Create Playlist
                  </Button>
                </div>
              </div>

              {/* Playlists */}
              {playlists.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-gray-400 text-sm font-medium px-4">
                    Your Playlists
                  </h4>
                  {playlists.slice(0, 5).map((playlist) => (
                    <Link
                      key={playlist.id}
                      href={`/playlist/${playlist.id}`}
                      className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex-shrink-0"></div>
                        <div className="truncate">
                          <p className="text-sm font-medium truncate">
                            {playlist.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {playlist.tracks.length} songs
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Account Actions */}
              <div className="border-t border-white/10 pt-6 space-y-3">
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-white"
                >
                  Sign In
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                  Get Premium
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}