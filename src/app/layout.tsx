import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AudioContextProvider } from '@/lib/audio-context';
import { ThemeProvider } from '@/components/theme-provider';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Freefy - Free Music Streaming',
  description: 'Stream your favorite music for free with Freefy. Discover new songs, create playlists, and enjoy unlimited music.',
  keywords: ['music', 'streaming', 'free', 'songs', 'playlists', 'audio'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AudioContextProvider>
            <div className="flex h-screen overflow-hidden">
              {/* Sidebar */}
              <div className="hidden md:flex md:w-64 md:flex-col">
                <Sidebar />
              </div>
              
              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-black/20 backdrop-blur-sm">
                  <div className="container mx-auto px-4 py-6">
                    {children}
                  </div>
                </main>
                
                {/* Bottom Music Player */}
                <div className="h-24 bg-black/40 backdrop-blur-md border-t border-white/10">
                  <MusicPlayer />
                </div>
              </div>
            </div>
          </AudioContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}