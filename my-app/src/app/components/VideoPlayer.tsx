"use client"
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import YouTube from 'react-youtube';
import { Box, Slider, IconButton, Button, Collapse, List, ListItem, ListItemButton, ListItemText, TextField, useMediaQuery, useTheme } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff, Share } from '@mui/icons-material';
import OutlinedButton from './OutlinedButton';
import Popup from './Popup';
import { useFormik } from 'formik';

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  channelTitle?: string;
  thumbnailUrl?: string;
  onVideoData?: (title: string, artist: string) => void;
  onEnded?: () => void;
}

export default function VideoPlayer({ videoId, title, channelTitle, thumbnailUrl, onVideoData, onEnded }: VideoPlayerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [popupSeverity, setPopupSeverity] = useState<'success' | 'error' | 'info'>('info');

  const formik = useFormik({
    initialValues: {
      genre: ''
    },
    onSubmit: async (values) => {
      const songData = {
        title: title || playerRef.current?.getVideoData().title,
        artist: channelTitle || playerRef.current?.getVideoData().author,
        music_url: videoId,
        thumbnail_url: thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
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
          if (values.genre) {
            const array = [...new Set(values.genre.trim().split(/\s+/).map(g => g.toLowerCase()))];
            await fetch('/api/songs', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: songResponse.song.id,
                genres: array
              }),
            });
          }
          formik.resetForm();
          setPopupMessage('Song added to database');
          setPopupSeverity('info')
          setIsPopupOpen(true);
        }
      } catch (error) {
        console.error(error);
        setPopupMessage("Could not add song to database")
        setPopupSeverity('error')
        setIsPopupOpen(true)
      }
    }
  });

  useLayoutEffect(() => {
    if (playerRef.current) {
      setDuration(playerRef.current.getDuration());
    }
  }, [playerRef.current]);

  useEffect(() => {
    setAccountId(sessionStorage.getItem('account_id'));
    setPlaylists(JSON.parse(sessionStorage.getItem('account_playlists') || '[]'));
    const likedSongs = JSON.parse(sessionStorage.getItem('account_likedSongs') || '[]');
    setIsLiked(likedSongs.some((song: any) => song.music_url === videoId));
  }, [videoId]);

  useEffect(() => {
    setCurrentTime(0);
  }, [videoId]);

  const opts = {
    height: isMobile ? '240' : isTablet ? '360' : '500',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      cc_loadpolicy: 1,
      host: 'https://www.youtube.com',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    },
  };

  const handleLike = async () => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: accountId,
          music_url: videoId
        })
      });

      if (response.ok) {
        const likedSongs = JSON.parse(sessionStorage.getItem('account_likedSongs') || '[]');
        const newSong = {
          title: title || playerRef.current?.getVideoData().title,
          artist: channelTitle || playerRef.current?.getVideoData().author,
          music_url: videoId,
          thumbnail_url: thumbnailUrl
        };
        sessionStorage.setItem('account_likedSongs', JSON.stringify([...likedSongs, newSong]));
        setIsLiked(true);
        setPopupMessage('Liked song');
        setPopupSeverity('info')
        setIsPopupOpen(true);
      }
      else {
        setPopupMessage('Add the song to the database first')
        setPopupSeverity('error')
        setIsPopupOpen(true)
      }
    } catch (error) {
      console.error('Error liking song:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetch(`/api/likes?account_id=${accountId}&music_url=${videoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const likedSongs = JSON.parse(sessionStorage.getItem('account_likedSongs') || '[]');
        const updatedLikedSongs = likedSongs.filter((song: any) => song.music_url !== videoId);
        sessionStorage.setItem('account_likedSongs', JSON.stringify(updatedLikedSongs));
        setIsLiked(false);
        setPopupMessage('Unliked a song');
        setIsPopupOpen(true);
      }
      else {
        setPopupMessage('Add the song to the database first')
        setPopupSeverity('error')
        setIsPopupOpen(true)
      }
    } catch (error) {
      console.error('Error unliking song:', error);
    }
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      const response = await fetch('/api/playlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: playlistId,
          music_url: videoId
        })
      });

      if (response.ok) {
        setPopupMessage('Added song to playlist');
        setIsPopupOpen(true);
        setShowPlaylists(false);
      }
      else {
        setPopupMessage('Add the song to the database first')
        setPopupSeverity('error')
        setIsPopupOpen(true)
      }
    } catch (error) {
      console.error('Error adding to playlist:', error);
    }
  };

  const handleReady = (event: any) => {
    playerRef.current = event.target;
    if (onVideoData) {
      setTimeout(() => {
        const videoData = event.target.getVideoData();
        onVideoData(videoData.title, videoData.author || 'Unknown Artist');
      }, 1000);
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

  const handleVolumeChange = (newValue: number) => {
    setVolume(newValue);
    playerRef.current?.setVolume(newValue);
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

  const handleTimeChange = (newValue: number) => {
    playerRef.current?.seekTo(newValue);
    setCurrentTime(newValue);
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
    if (playerState === 0 && onEnded) {
      onEnded();
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/watch/video/${videoId}`;
    navigator.clipboard.writeText(url);
    setShowSharePopup(true);
    setTimeout(() => setShowSharePopup(false), 2000);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
      />
      <Box sx={{ p: isMobile ? 1 : 2 }}>
        <Slider
          value={currentTime}
          min={0}
          max={duration}
          onChange={(_, value) => handleTimeChange(value as number)}
          sx={{ mb: isMobile ? 1 : 2 }}
        />
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: '100%',
        }}>
          <IconButton onClick={handlePlayPause} size={isMobile ? "small" : "medium"}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: '200px'
          }}>
            <IconButton onClick={handleMuteToggle} size={isMobile ? "small" : "medium"}>
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            <Slider
              value={Number(isMuted ? 0 : volume)}
              onChange={(_, value) => handleVolumeChange(Number(value))}
              min={0}
              max={100}
            />
          </Box>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={handleShare} size={isMobile ? "small" : "medium"}>
            <Share />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: isMobile ? 1 : 2,
        width: '100%'
      }}>
        {accountId && (
          <>
            <OutlinedButton
              value={showPlaylists ? "Hide playlists" : "Add to playlist"}
              onClick={() => setShowPlaylists(!showPlaylists)}
              width="100%"
            />
            <OutlinedButton
              value={isLiked ? "Dislike" : "Like"}
              onClick={isLiked ? handleUnlike : handleLike}
              width="100%"
            />
          </>
        )}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%'
        }}>
          <TextField
            size="small"
            placeholder="Enter genres (use spaces)"
            name="genre"
            value={formik.values.genre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                ...(formik.values.genre && {
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
            onClick={() => formik.handleSubmit()}
            fullWidth
            sx={{
              height: '40px',
              ...(formik.values.genre && {
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
            {formik.values.genre === '' ? 'Add to Database' : 'With genres'}
          </Button>
        </Box>
      </Box>

      {accountId && (
        <Collapse in={showPlaylists} sx={{ width: '100%' }}>
          <List sx={{
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 0,
            mx: isMobile ? 1 : 2,
            mb: isMobile ? 1 : 2
          }}>
            {playlists.length > 0 ? (
              playlists.map((playlist: any) => (
                <ListItem key={playlist.id} disablePadding>
                  <ListItemButton onClick={() => handleAddToPlaylist(playlist.id)}>
                    <ListItemText primary={playlist.name} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No playlists found" />
              </ListItem>
            )}
          </List>
        </Collapse>
      )}
      <Popup
        message={popupMessage}
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        severity={popupSeverity}
        duration={3000}
      />
      <Popup
        message="Music URL copied to clipboard"
        open={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        severity="info"
        duration={2000}
      />
    </Box>
  );
}
