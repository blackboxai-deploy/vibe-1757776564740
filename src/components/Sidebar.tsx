"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Search', href: '/search', icon: '🔍' },
  { name: 'Your Library', href: '/library', icon: '📚' },
];

const playlists = [
  { name: 'Liked Songs', href: '/playlist/liked', icon: '❤️' },
  { name: 'Recently Played', href: '/playlist/recent', icon: '🕐' },
  { name: 'Top Hits 2024', href: '/playlist/top-hits', icon: '🔥' },
  { name: 'Chill Vibes', href: '/playlist/chill', icon: '🌊' },
  { name: 'Workout Mix', href: '/playlist/workout', icon: '💪' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-black/40 backdrop-blur-md border-r border-white/10 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          {!isCollapsed && (
            <h1 className="text-white font-bold text-xl">Freefy</h1>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 px-3">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-gray-300 hover:text-white hover:bg-white/10",
                    pathname === item.href && "bg-white/20 text-white",
                    isCollapsed && "px-2"
                  )}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {!isCollapsed && item.name}
                </Button>
              </Link>
            ))}
          </div>

          <Separator className="my-4 bg-white/10" />

          {/* Create Playlist */}
          {!isCollapsed && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
              >
                <span className="text-lg mr-3">➕</span>
                Create Playlist
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
              >
                <span className="text-lg mr-3">📥</span>
                Local Files
              </Button>
            </div>
          )}

          <Separator className="my-4 bg-white/10" />

          {/* Playlists */}
          {!isCollapsed && (
            <div className="space-y-1">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Made for you
              </h3>
              {playlists.map((playlist) => (
                <Link key={playlist.name} href={playlist.href}>
                  <Button
                    variant={pathname === playlist.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 text-sm",
                      pathname === playlist.href && "bg-white/20 text-white"
                    )}
                  >
                    <span className="text-sm mr-3">{playlist.icon}</span>
                    {playlist.name}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full text-gray-400 hover:text-white hover:bg-white/10"
        >
          {isCollapsed ? '→' : '←'}
        </Button>
      </div>
    </div>
  );
}