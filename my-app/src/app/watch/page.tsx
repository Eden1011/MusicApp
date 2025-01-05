"use client"
import { Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import Navbar from '@/app/components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import { useEffect, useState } from 'react';
import { urlencode } from '../../../lib/urlfunctions';
import { useRouter } from 'next/navigation';
import BoxBackground from '../components/BoxBackground';

interface Song {
  id: number;
  title: string;
  artist: string;
  music_url: string;
  thumbnail_url: string;
  genre?: string[];
}


function StackGenres() {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const router = useRouter()

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/genre/all');
      const data = await response.json();
      setGenres(data.genres || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        onClick={() => router.push('/watch/all')}
        color={selectedGenre === null ? "primary" : "inherit"}
      >
        All Songs
      </Button>
      {genres.map((genre, index) => {
        const rainbowColors = [
          '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'
        ];
        const colorIndex = index % rainbowColors.length;
        const buttonColor = rainbowColors[colorIndex];
        return (
          <Button
            key={genre}
            variant="contained"
            onClick={() => router.push(`watch/genre/${urlencode(genre)}`)}
            sx={{
              backgroundColor: buttonColor,
              '&:hover': {
                backgroundColor: buttonColor,
                filter: 'brightness(0.8)'
              }
            }}
          >
            {genre}
          </Button>
        );
      })}
    </Stack>
  )
}


export default function WatchPage() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <BoxBackground key={'StackGenresBoxBg'}>
          <StackGenres />
        </BoxBackground>
      </main>
    </ThemeProvider>
  );
}
