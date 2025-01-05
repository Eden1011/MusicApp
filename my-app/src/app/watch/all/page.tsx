"use client"
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import Navbar from '@/app/components/Navbar';
import StackSearchResults from '@/app/components/StackSearchResults';
import { useEffect, useState } from 'react';
import { SearchResultProps } from '@/app/components/SearchResults';

export default function WatchAllPage() {
  const [songs, setSongs] = useState<SearchResultProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('/api/songs/all');
        const data = await response.json();

        const formattedSongs = data.songs.map((song: any) => ({
          title: song.title,
          musicUrl: song.music_url,
          channelTitle: song.artist,
          thumbnailUrl: song.thumbnail_url
        }));
        setSongs(formattedSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <StackSearchResults
          amount={5}
          data={songs}
          isLoading={loading}
        />
      </main>
    </ThemeProvider>
  );
}
