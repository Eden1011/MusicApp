'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  ThemeProvider,
  CssBaseline,
  Button
} from '@mui/material';
import BoxBackground from '../components/BoxBackground';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import Navbar from '../components/Navbar';
import darkTheme from '@/styles/theme';
import OutlinedButton from '../components/OutlinedButton';
import SongCard from '../components/SongCard';
import { useRouter } from 'next/navigation';
import Popup from '../components/Popup';
import BoxYoutubeError from '../components/BoxYoutubeError';
import PlaylistDialog from '../components/PlaylistDialog';

type Song = {
  id: number;
  title: string
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

export default function LibraryPage() {
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<'liked' | 'playlists'>('liked');
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [openNewPlaylistDialog, setOpenNewPlaylistDialog] = useState(false);
  const [account_id, setAccountId] = useState<string | undefined>('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    setAccountId(sessionStorage.getItem('account_id') || undefined)
  }, [account_id]);

  useEffect(() => {
    const likedSongsStr = sessionStorage.getItem('account_likedSongs');
    const playlistsStr = sessionStorage.getItem('account_playlists');

    if (likedSongsStr) setLikedSongs(JSON.parse(likedSongsStr));
    if (playlistsStr) setPlaylists(JSON.parse(playlistsStr));
  }, []);

  useEffect(() => {
    if (selectedPlaylist) {
      fetchPlaylistSongs(selectedPlaylist.id);
    }
  }, [selectedPlaylist]);

  if (!account_id) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <main>
          <Navbar />
          <BoxYoutubeError data={{ error: { message: "Please log in to view library" } }} />
        </main>
      </ThemeProvider>
    );
  }

  const fetchPlaylistSongs = async (playlistId: number) => {
    try {
      const response = await fetch(`/api/playlist?id=${playlistId}`);
      const data = await response.json();

      if (response.ok) {
        setPlaylistSongs(data.songs || []);
      }
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
    }
  };

  const handleCreatePlaylist = async (name: string) => {
    const accountId = sessionStorage.getItem('account_id');
    if (!accountId || !name.trim()) return;

    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          account_id: parseInt(accountId),
        }),
      });

      if (response.ok) {
        const data = await response.json()
        const newPlaylist: Playlist = {
          id: parseInt(data.lastId),
          name: name,
          account_id: parseInt(accountId),
          created_at: new Date().toISOString()
        };

        const updatedPlaylists = [...playlists, newPlaylist];
        setPlaylists(updatedPlaylists);
        sessionStorage.setItem('account_playlists', JSON.stringify(updatedPlaylists));
        setOpenNewPlaylistDialog(false);
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleSharePlaylist = () => {
    if (selectedPlaylist) {
      const url = `${window.location.origin}/playlist/${selectedPlaylist.id}`;
      navigator.clipboard.writeText(url);
      setIsPopupOpen(true);
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    const accountId = sessionStorage.getItem('account_id');
    if (!accountId) return;

    try {
      const response = await fetch(`/api/playlist?id=${playlistId}&account_id=${accountId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
        setPlaylists(updatedPlaylists);
        sessionStorage.setItem('account_playlists', JSON.stringify(updatedPlaylists));
        setSelectedPlaylist(null);
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handleUnlikeSong = async (songId: number) => {
    const accountId = sessionStorage.getItem('account_id');
    if (!accountId) return;
    try {
      const song = likedSongs.find(s => s.id === songId);
      if (!song) return;

      const response = await fetch(`/api/likes?account_id=${accountId}&music_url=${song.music_url}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedLikedSongs = likedSongs.filter(s => s.music_url !== song.music_url);
        setLikedSongs(updatedLikedSongs);
        sessionStorage.setItem('account_likedSongs', JSON.stringify(updatedLikedSongs));
      }
    } catch (error) {
      console.error('Error unliking song:', error);
    }
  };

  const handleRemoveFromPlaylist = async (songId: number) => {
    if (!selectedPlaylist) return;
    const song = playlistSongs.find(s => s.id === songId);
    if (!song) return;

    try {
      const response = await fetch(`/api/playlist/song?playlist_id=${selectedPlaylist.id}&music_url=${song.music_url}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedSongs = playlistSongs.filter(s => s.id !== songId);
        setPlaylistSongs(updatedSongs);
      }
    } catch (error) {
      console.error('Error removing song from playlist:', error);
    }
  };

  const renderContent = () => {
    if (selectedView === 'liked') {
      return (
        <Box>
          <Typography variant="h5" gutterBottom>
            Liked Songs
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {likedSongs.map(song => (
              <SongCard key={`liked-song-${song.music_url}`} song={song} action={handleUnlikeSong} state={true} />
            ))}
          </Box>
        </Box>
      );
    }

    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography
            variant="h5"
            onClick={() => selectedPlaylist && router.push(`/playlist/${selectedPlaylist.id}`)}
            sx={{
              cursor: selectedPlaylist ? 'pointer' : 'default',
              fontStyle: selectedPlaylist ? 'italic' : 'normal',
              textDecoration: selectedPlaylist ? 'underline' : 'none',
              '&:hover': {
                opacity: selectedPlaylist ? 0.8 : 1
              }
            }}
          >
            {selectedPlaylist ?
              (selectedPlaylist.name.length > 20 ?
                selectedPlaylist.name.substring(0, 20) + '...' :
                selectedPlaylist.name) :
              'My Playlists'}
          </Typography>
          {selectedPlaylist ? (
            <IconButton onClick={handleSharePlaylist}>
              <ShareIcon />
            </IconButton>
          ) : (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setOpenNewPlaylistDialog(true)}
            >
              New Playlist
            </Button>
          )}
        </Box>

        {selectedPlaylist ? (
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {playlistSongs.map(song => (
                <SongCard
                  key={`playlist-song-${song.music_url}`}
                  song={song}
                  action={handleRemoveFromPlaylist}
                  state={false}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {playlists.map((playlist) => (
              <Box key={`playlist-${playlist.id}`} sx={{ width: 'auto' }}>
                <Card sx={{
                  width: '125px',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  backgroundColor: 'rgba(30, 30, 30, 0.6)',
                  borderRadius: '8px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
                  }
                }}>
                  <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '8px'
                  }}>
                    <Typography variant="h6" sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{`${playlist.name.length > 5 ? playlist.name.substring(0, 5) + '...' : playlist.name}`}</Typography>
                    <Box mt={1} sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <OutlinedButton
                        key={`view-btn-${playlist.id}`}
                        value='View'
                        onClick={() => setSelectedPlaylist(playlist)}
                        height={30}
                        width={100}
                      />
                      <IconButton
                        key={`delete-btn-${playlist.id}`}
                        onClick={() => handleDeletePlaylist(playlist.id)}
                        color="error"
                        sx={{
                          marginLeft: '5px',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <BoxBackground>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, marginBottom: '1rem' }}>
            <OutlinedButton
              value="Liked Songs"
              onClick={() => {
                setSelectedView('liked');
                setSelectedPlaylist(null);
              }}
              width="50%"
            />
            <OutlinedButton
              value="My Playlists"
              onClick={() => {
                setSelectedView('playlists');
                setSelectedPlaylist(null);
              }}
              width="50%"
            />
          </Box>

          <Box sx={{ width: '15%', minWidth: '200px', flexShrink: 0 }}>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            {renderContent()}
          </Box>
        </BoxBackground>

        <PlaylistDialog
          open={openNewPlaylistDialog}
          onClose={() => setOpenNewPlaylistDialog(false)}
          onCreatePlaylist={handleCreatePlaylist}
        />
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
