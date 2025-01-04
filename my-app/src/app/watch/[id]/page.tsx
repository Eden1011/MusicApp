"use client"
import Navbar from '@/app/components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import { use } from 'react';
import YouTube from 'react-youtube';
import { useState, useRef } from 'react';
import { Box, Slider, IconButton, Paper } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff } from '@mui/icons-material';

interface WatchPageSearchParams {
  params: {
    id: string
  }
}

export default function Watch({ params }: WatchPageSearchParams) {
  const { id } = use(params);

  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef<any>(null);

  const opts = {
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
    },
  };

  const handleReady = (event: any) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
  };


  const handlePlayPause = () => {
    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (_: Event, newValue: number) => {
    const volumeValue = newValue;
    setVolume(volumeValue);
    playerRef.current?.setVolume(volumeValue);
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      playerRef.current?.unMute();
      playerRef.current?.setVolume(volume);
    } else {
      playerRef.current?.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleTimeChange = (_: Event, newValue: number) => {
    const timeValue = newValue;
    playerRef.current?.seekTo(timeValue);
    setCurrentTime(timeValue);
  };


  const handleStateChange = (event: any) => {
    const playerState = event.data;
    setIsPlaying(playerState === 1);
    if (playerState === 1) {
      const interval = setInterval(() => {
        setCurrentTime(playerRef.current?.getCurrentTime() || 0);
      }, 1000);
      return () => clearInterval(interval);
    }
  };

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
            <YouTube
              videoId={id}
              opts={opts}
              onReady={handleReady}
              onStateChange={handleStateChange}
            />

            <Box sx={{ p: 2 }}>
              <Slider
                value={currentTime}
                min={0}
                max={duration}
                onChange={handleTimeChange}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={handlePlayPause}>
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>

                <IconButton onClick={handleMuteToggle}>
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                <Slider
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  sx={{ width: 100 }}
                  min={0}
                  max={100}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </main>
    </ThemeProvider>
  );
}
