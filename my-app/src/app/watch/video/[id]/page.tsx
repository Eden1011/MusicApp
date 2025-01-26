"use client"
import { ThemeProvider } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { use } from 'react';
import darkTheme from "@/styles/theme";
import Navbar from '@/app/components/Navbar';
import VideoPlayer from '@/app/components/VideoPlayer';

interface WatchPageSearchParams {
  params: {
    id: string
  }
}

export default function Video({ params }: WatchPageSearchParams) {
  const { id } = use(params);

  if (!id) {
    return <h1>No video ID provided</h1>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: 2 }}>
          <Paper elevation={3}>
            <VideoPlayer videoId={id} />
          </Paper>
        </Box>
      </main>
    </ThemeProvider>
  );
}
