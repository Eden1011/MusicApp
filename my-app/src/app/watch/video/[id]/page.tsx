"use client"
import Navbar from '@/app/components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import { use, useEffect } from 'react';
import YouTube from 'react-youtube';
import { useState, useRef } from 'react';
import { Box, Slider, IconButton, Paper, TextField, Button } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff } from '@mui/icons-material';
import { urldecode } from '../../../../../lib/urlfunctions';

interface WatchPageSearchParams {
  params: {
    id: string
  }
}

export default function Video({ params }: WatchPageSearchParams) {
  const { id } = use(params);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [genre, setGenre] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [channelTitle, setChannelTitle] = useState('');

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

    setVideoTitle(event.target.getVideoData().title);
    setChannelTitle(event.target.getVideoData().author);
  };

  const handleAddSong = async () => {
    const songData = {
      title: videoTitle,
      artist: channelTitle,
      music_url: urldecode(id),
      thumbnail_url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    };
    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(songData),
      });

      if (response.ok) {
        const songResponse = await response.json();
        if (genre) {
          const array = [...new Set(genre.trim().split(/\s+/).map(g => g.toLowerCase()))];

          const addGenre = await fetch('/api/songs', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: songResponse.song.id,
              genres: array
            }),
          });
          await addGenre.json()
        }
        setGenre('');
      }
    } catch (error) {
      console.log(error);

    }
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

                <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Enter genres (use spaces)"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        ...(genre && {
                          '&.Mui-focused fieldset': {
                            borderColor: 'green',
                            borderWidth: '3px',
                            boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
                          }
                        })
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSong}
                    sx={{
                      transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
                      height: '40px',
                      width: '170px',
                      ...(genre && {
                        backgroundColor: 'green',
                        '&:hover': {
                          backgroundColor: 'green',
                        },
                        '&:active': {
                          backgroundColor: 'green',
                          boxShadow: '0 0 20px 2px rgba(0, 255, 0, 0.5)',
                        }
                      }),
                    }}
                  >
                    {genre === '' ? 'Add to Database' : 'With genres'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </main >
    </ThemeProvider >
  );
}
