import { Box, Button, Collapse, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery } from "@mui/material";
import OutlinedButton from "./OutlinedButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Popup from "./Popup";

export interface SearchResultProps {
  title: string;
  musicUrl: string;
  channelTitle: string;
  thumbnailUrl: string;
}

export function SearchResultWatch({ result }: { result: SearchResultProps }) {
  const router = useRouter();
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const accountId = sessionStorage.getItem('account_id');
  const playlists = JSON.parse(sessionStorage.getItem('account_playlists') || '[]');
  const [isLiked, setIsLiked] = useState(() => {
    const likedSongs = JSON.parse(sessionStorage.getItem('account_likedSongs') || '[]');
    return likedSongs.some((song: any) => song.music_url === result.musicUrl);
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLike = async () => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: accountId,
          music_url: result.musicUrl
        })
      });

      if (response.ok) {
        const likedSongs = JSON.parse(sessionStorage.getItem('account_likedSongs') || '[]');
        const newSong = {
          title: result.title,
          artist: result.channelTitle,
          music_url: result.musicUrl,
          thumbnail_url: result.thumbnailUrl
        };
        sessionStorage.setItem('account_likedSongs', JSON.stringify([...likedSongs, newSong]));
        setIsLiked(true);
        setPopupMessage('Liked song');
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error('Error liking song:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetch(`/api/likes?account_id=${accountId}&music_url=${result.musicUrl}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const likedSongs = JSON.parse(sessionStorage.getItem('account_likedSongs') || '[]');
        const updatedLikedSongs = likedSongs.filter((song: any) => song.music_url !== result.musicUrl);
        sessionStorage.setItem('account_likedSongs', JSON.stringify(updatedLikedSongs));
        setIsLiked(false);
        setPopupMessage('Unliked song');
        setIsPopupOpen(true);
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
          music_url: result.musicUrl
        })
      });

      if (response.ok) {
        setPopupMessage('Added song to playlist');
        setIsPopupOpen(true);
        setShowPlaylists(false);
      }
    } catch (error) {
      console.error('Error adding to playlist:', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateAreas: {
            xs: `
              "image"
              "content"
              "buttons"
              "playlists"
            `,
            sm: `
              "image content"
              "buttons buttons"
              "playlists playlists"
            `
          },
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'auto 1fr'
          },
          gap: { xs: 1, sm: 2 },
          p: { xs: 1, sm: 2 },
          background: 'rgba(20, 20, 20, 0.5)',
          borderWidth: { xs: '2px', sm: '4px' },
          borderColor: 'rgba(30, 30, 30, 0.8)',
          borderRadius: { xs: '8px', sm: '10px' },
          marginTop: { xs: '0.5rem', sm: '1rem' },
          width: '100%',
          mx: 'auto'
        }}
      >
        <Box sx={{
          gridArea: 'image',
          justifySelf: { xs: 'center', sm: 'start' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <img
            src={result.thumbnailUrl}
            alt={result.title}
            style={{
              width: isMobile ? '100%' : '120px',
              maxWidth: isMobile ? '300px' : 'none',
              height: 'auto',
              borderRadius: '4px',
              margin: isMobile ? '0 auto' : '0',
              display: 'block'
            }}
          />
        </Box>

        <Box sx={{
          gridArea: 'content',
          textAlign: { xs: 'center', sm: 'left' },
          padding: { xs: '1rem 0', sm: '0 1rem' }
        }}>
          <h3 style={{
            margin: 0,
            fontSize: isMobile ? '1rem' : '1.2rem',
            wordBreak: 'break-word'
          }}>
            {result.title}
          </h3>
          <div style={{
            marginTop: '0.5rem',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            {result.channelTitle}
          </div>
        </Box>

        <Box sx={{
          gridArea: 'buttons',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 },
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
          alignItems: 'stretch',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 2
        }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth={isMobile}
            onClick={() => router.push(`/watch/video/${result.musicUrl}`)}
            sx={{
              minHeight: { xs: '40px', sm: '36px' }
            }}
          >
            Watch
          </Button>
          {accountId && (
            <>
              <OutlinedButton
                value={showPlaylists ? "Hide playlists" : "Add to playlist"}
                onClick={() => setShowPlaylists(!showPlaylists)}
                width={isMobile ? '100%' : 170}
                height={isMobile ? 40 : 36}
              />
              <OutlinedButton
                value={isLiked ? "Unlike" : "Like"}
                onClick={isLiked ? handleUnlike : handleLike}
                width={isMobile ? '100%' : 90}
                height={isMobile ? 40 : 36}
              />
            </>
          )}
        </Box>

        <Collapse in={showPlaylists} sx={{
          gridArea: 'playlists',
          width: '100%'
        }}>
          <List sx={{
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 1,
            padding: { xs: 1, sm: 2 }
          }}>
            {playlists.length > 0 ? (
              playlists.map((playlist: any) => (
                <ListItem key={playlist.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    sx={{
                      padding: { xs: '0.8rem', sm: '0.5rem' },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={playlist.name}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary="No playlists found"
                  primaryTypographyProps={{
                    sx: {
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }
                  }}
                />
              </ListItem>
            )}
          </List>
        </Collapse>
      </Box>
      <Popup
        message={popupMessage}
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        severity="info"
        duration={3000}
      />
    </>
  );
}

export function SearchResultRegular({ result }: { result: SearchResultProps }) {
  const router = useRouter();
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const accountId = sessionStorage.getItem('account_id');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddToLibrary = async () => {
    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.title,
          artist: result.channelTitle,
          music_url: result.musicUrl,
          thumbnail_url: result.thumbnailUrl
        })
      });

      if (response.ok) {
        setPopupMessage('Added to database');
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error('Error adding to library:', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateAreas: {
            xs: `
              "image"
              "content"
              "buttons"
            `,
            sm: `
              "image content"
              "buttons buttons"
            `
          },
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'auto 1fr'
          },
          gap: { xs: 1, sm: 2 },
          p: { xs: 1, sm: 2 },
          background: 'rgba(20, 20, 20, 0.5)',
          borderWidth: { xs: '2px', sm: '4px' },
          borderColor: 'rgba(30, 30, 30, 0.8)',
          borderRadius: { xs: '8px', sm: '10px' },
          marginTop: { xs: '0.5rem', sm: '1rem' },
          width: '100%',
          mx: 'auto'
        }}
      >
        <Box sx={{
          gridArea: 'image',
          justifySelf: { xs: 'center', sm: 'start' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <img
            src={result.thumbnailUrl}
            alt={result.title}
            style={{
              width: isMobile ? '100%' : '120px',
              maxWidth: isMobile ? '300px' : 'none',
              height: 'auto',
              borderRadius: '4px',
              margin: isMobile ? '0 auto' : '0',
              display: 'block'
            }}
          />
        </Box>

        <Box sx={{
          gridArea: 'content',
          textAlign: { xs: 'center', sm: 'left' },
          padding: { xs: '1rem 0', sm: '0 1rem' }
        }}>
          <h3 style={{
            margin: 0,
            fontSize: isMobile ? '1rem' : '1.2rem',
            wordBreak: 'break-word'
          }}>
            {result.title}
          </h3>
          <div style={{
            marginTop: '0.5rem',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            {result.channelTitle}
          </div>
        </Box>

        <Box sx={{
          gridArea: 'buttons',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 },
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
          alignItems: 'stretch',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 2
        }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth={isMobile}
            onClick={() => router.push(`/watch/video/${result.musicUrl}`)}
            sx={{
              minHeight: { xs: '40px', sm: '36px' }
            }}
          >
            Watch
          </Button>
          {accountId && (
            <OutlinedButton
              value="Add to database"
              onClick={handleAddToLibrary}
              width={isMobile ? '100%' : 175}
              height={isMobile ? 40 : 36}
            />
          )}
        </Box>
      </Box>
      <Popup
        message={popupMessage}
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        severity="info"
        duration={3000}
      />
    </>
  );
}
