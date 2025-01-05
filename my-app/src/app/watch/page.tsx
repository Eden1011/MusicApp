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
          '#FF3333', '#FF6633', '#FF9933', '#FFCC33', '#FFFF33', '#CCFF33', '#99FF33',
          '#66FF33', '#33FF33', '#33FF66', '#33FF99', '#33FFCC', '#33FFFF', '#33CCFF',
          '#3399FF', '#3366FF', '#3333FF', '#6633FF', '#9933FF', '#CC33FF', '#FF33FF'
        ];
        const colorIndex = index % rainbowColors.length;
        const buttonColor = rainbowColors[colorIndex];
        return (
          <Button
            key={genre}
            variant='outlined'
            onClick={() => router.push(`watch/genre/${urlencode(genre)}`)}
            sx={{
              borderColor: buttonColor,
              color: buttonColor,
              transition: 'all 0.3s ease-in-out',
              '& .MuiTypography-root': {
                transition: 'color 0.3s ease-in-out',
              },
              '&:hover': {
                backgroundColor: buttonColor,
                '& .MuiTypography-root': {
                  color: 'black',
                }
              },
              '&:active, &.Mui-focused': {
                backgroundColor: buttonColor,
                boxShadow: `0 0 15px ${buttonColor}`,
                '& .MuiTypography-root': {
                  color: 'black',
                }
              }
            }}
          >
            <Typography>{genre}</Typography>
          </Button>
        );
      })}
    </Stack >
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
