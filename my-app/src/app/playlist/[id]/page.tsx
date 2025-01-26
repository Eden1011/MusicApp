'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, ThemeProvider, CssBaseline, Paper, Container, Switch, FormControlLabel } from '@mui/material';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import BoxBackground from '@/app/components/BoxBackground';
import Navbar from '@/app/components/Navbar';
import darkTheme from '@/styles/theme';
import SongCard from '@/app/components/SongCard';
import Intermission from '@/app/components/Intermission';
import VideoPlayer from '@/app/components/VideoPlayer';
import Popup from '@/app/components/Popup';

type Song = {
  id: number;
  title: string;
  artist: string;
  music_url: string;
  thumbnail_url: string;
};

type Playlist = {
  id: number;
  name: string;
  account_id: number;
  created_at: string;
};

interface PlaylistPageParams {
  params: {
    id: string
  }
}

export default function PlaylistPage({ params }: PlaylistPageParams) {
  const { id } = use(params);
  const router = useRouter();
  const [playlistData, setPlaylistData] = useState<{ playlist: Playlist, songs: Song[] } | null>(null);
  const [error, setError] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const handleCopyPlaylistLink = () => {
    const url = `${window.location.origin}/playlist/${id}`;
    navigator.clipboard.writeText(url);
    setIsPopupOpen(true);
  };

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const response = await fetch(`/api/playlist?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setPlaylistData(data);
        } else {
          setError(true);
          setTimeout(() => router.push('/'), 3000);
        }
      } catch (error) {
        setError(true);
        setTimeout(() => router.push('/'), 3000);
      }
    };
    if (id) {
      fetchPlaylistData();
    }
  }, [id, router]);

  useEffect(() => {
    const checkPlaylistOwnership = async () => {
      const accountId = sessionStorage.getItem('account_id');
      if (!accountId) return;

      try {
        const response = await fetch(`/api/playlist/user?playlist_id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setIsOwner(data.account_id === parseInt(accountId));
        }
      } catch (error) {
        console.error('Error checking playlist ownership:', error);
      }
    };

    checkPlaylistOwnership();
  }, [id]);

  const handleRemoveFromPlaylist = async (songId: number) => {
    const song = playlistData?.songs.find(s => s.id === songId);
    if (!song) return;
    try {
      const response = await fetch(`/api/playlist/song?playlist_id=${id}&music_url=${song.music_url}`, {
        method: 'DELETE'
      });
      if (response.ok && playlistData) {
        setPlaylistData({
          ...playlistData,
          songs: playlistData.songs.filter(s => s.id !== songId)
        });
      }
    } catch (error) {
      console.error('Error removing song from playlist:', error);
    }
  };

  const handleVideoSelect = (index: number) => {
    setCurrentSongIndex(index);
  };

  const getNextSongIndex = () => {
    if (!playlistData) return 0;
    if (isRandomMode) {
      const randomIndex = Math.floor(Math.random() * playlistData.songs.length);
      return randomIndex === currentSongIndex ?
        (randomIndex + 1) % playlistData.songs.length : randomIndex;
    }
    return (currentSongIndex + 1) % playlistData.songs.length;
  };

  const handleVideoEnd = () => {
    if (playlistData) {
      setCurrentSongIndex(getNextSongIndex());
    }
  };

  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <main>
          <Navbar />
          <Intermission text="Could not find playlist, redirecting to / in 3 seconds" />
        </main>
      </ThemeProvider>
    );
  }

  if (!playlistData) {
    return null;
  }

  const currentSong = playlistData.songs[currentSongIndex];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 2 }}>
          {currentSong && (
            <Paper elevation={3} sx={{ mb: 4 }}>
              <VideoPlayer
                videoId={currentSong.music_url}
                onEnded={handleVideoEnd}
              />
            </Paper>
          )}

          <BoxBackground>
            <Box sx={{ px: 1, pt: 1, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    cursor: 'pointer',
                    fontStyle: 'italic',
                    textDecoration: 'underline',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  onClick={handleCopyPlaylistLink}
                >
                  {playlistData.playlist.name}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isRandomMode}
                      onChange={(e) => setIsRandomMode(e.target.checked)}
                    />
                  }
                  label="Randomize"
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: 2,
                  my: 2,
                  pb: 3,
                }}
              >
                {playlistData.songs.map((song, index) => (
                  <Box
                    sx={{
                      flexShrink: 0,
                      border: index === currentSongIndex ? '2px solid white' : '2px solid transparent',
                      borderRadius: '8px',
                      transition: 'border-color 0.3s ease',
                      '&:hover': {
                        borderColor: 'transparent'
                      }
                    }} key={song.music_url}
                    onClick={() => handleVideoSelect(index)}
                  >
                    <SongCard
                      song={song}
                      action={isOwner ? handleRemoveFromPlaylist : null}
                      state={false}
                      push={null}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </BoxBackground>
        </Container>

        <Popup
          message="Playlist link copied to clipboard"
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          severity="info"
        />
      </main>
    </ThemeProvider>
  );
}
