"use client";

import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {

  return (
    <header className="h-16 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6">
      {/* Left Section - Logo and Search */}
      <div className="flex items-center space-x-4 flex-1">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <h1 className="hidden md:block text-white font-bold text-xl">
            Freefy
          </h1>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>
      </div>

      {/* Right Section - User Controls */}
      <div className="flex items-center space-x-4">
        {/* Premium Badge */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600"
        >
          Get Premium
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/75214578-0808-434a-bb01-79f7bf2f1dad.png" alt="User" />
                <AvatarFallback className="bg-purple-500 text-white">U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-900/95 backdrop-blur-md border-gray-700" align="end" forceMount>
            <DropdownMenuLabel className="font-normal text-gray-200">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Music Lover</p>
                <p className="text-xs leading-none text-gray-400">
                  user@freefy.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="text-gray-200 hover:bg-gray-800">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-200 hover:bg-gray-800">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-200 hover:bg-gray-800">
              Your Library
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="text-gray-200 hover:bg-gray-800">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}