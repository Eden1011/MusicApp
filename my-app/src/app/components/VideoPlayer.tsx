"use client"
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import YouTube from 'react-youtube';
import { Box, Slider, IconButton, Button, Collapse, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff, Share } from '@mui/icons-material';
import OutlinedButton from './OutlinedButton';
import Popup from './Popup';

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  channelTitle?: string;
  thumbnailUrl?: string;
  onVideoData?: (title: string, artist: string) => void;
  onEnded?: () => void;
}

export default function VideoPlayer({ videoId, title, channelTitle, thumbnailUrl, onVideoData, onEnded }: VideoPlayerProps) {
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
  const [genre, setGenre] = useState('');
  const [popupSeverity, setPopupSeverity] = useState<'success' | 'error' | 'info'>('info');

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
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      cc_loadpolicy: 1,
      host: 'https://www.youtube.com',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    },
  };

  const handleAddSong = async () => {
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
        if (genre) {
          const array = [...new Set(genre.trim().split(/\s+/).map(g => g.toLowerCase()))];
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
        setGenre('');
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
    <>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
      />
      <Box sx={{ p: 2 }}>
        <Slider
          value={currentTime}
          min={0}
          max={duration}
          onChange={(_, value) => handleTimeChange(value as number)}
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
            onChange={(_, value) => handleVolumeChange(value as number)}
            sx={{ width: 100 }}
            min={0}
            max={100}
          />
          <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
            <IconButton onClick={handleShare}>
              <Share />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={{ marginRight: 'auto', display: 'flex', gap: 2, paddingLeft: '1rem' }}>
        {accountId && (
          <>
            <OutlinedButton
              value={showPlaylists ? "Hide playlists" : "Add to playlist"}
              onClick={() => setShowPlaylists(!showPlaylists)}
              width={170}
            />
            <OutlinedButton
              value={isLiked ? "Dislike" : "Like"}
              onClick={isLiked ? handleUnlike : handleLike}
              width={90}
            />
          </>
        )}
        <Box sx={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', gap: 2, paddingRight: '1rem', marginBottom: '1rem' }}>
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
              width: '180px',
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

      {accountId && (
        <Collapse in={showPlaylists} sx={{ width: '100%' }}>
          <List sx={{ bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 0, marginLeft: '1rem', marginRight: '1rem', marginBottom: '1rem' }}>
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
    </>
  );
}
