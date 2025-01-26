import { Box, Button, Collapse, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
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
  const router = useRouter()
  const [showPlaylists, setShowPlaylists] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const accountId = sessionStorage.getItem('account_id')
  const playlists = JSON.parse(sessionStorage.getItem('account_playlists') || '[]')
  const [isLiked, setIsLiked] = useState(() => {
    const likedSongs = JSON.parse(sessionStorage.getItem('account_likedSongs') || '[]')
    return likedSongs.some((song: any) => song.music_url === result.musicUrl)
  })

  const handleLike = async () => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: accountId,
          music_url: result.musicUrl
        })
      })

      if (response.ok) {
        const likedSongs = JSON.parse(sessionStorage.getItem('account_likedSongs') || '[]')
        const newSong = {
          title: result.title,
          artist: result.channelTitle,
          music_url: result.musicUrl,
          thumbnail_url: result.thumbnailUrl
        }
        sessionStorage.setItem('account_likedSongs', JSON.stringify([...likedSongs, newSong]))
        setIsLiked(true)
        setPopupMessage('Liked song')
        setIsPopupOpen(true)
      }
    } catch (error) {
      console.error('Error liking song:', error)
    }
  }

  const handleUnlike = async () => {
    try {
      const response = await fetch(`/api/likes?account_id=${accountId}&music_url=${result.musicUrl}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const likedSongs = JSON.parse(sessionStorage.getItem('account_likedSongs') || '[]')
        const updatedLikedSongs = likedSongs.filter((song: any) => song.music_url !== result.musicUrl)
        sessionStorage.setItem('account_likedSongs', JSON.stringify(updatedLikedSongs))
        setIsLiked(false)
        setPopupMessage('Unliked a song')
        setIsPopupOpen(true)
      }
    } catch (error) {
      console.error('Error unliking song:', error)
    }
  }

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      const response = await fetch('/api/playlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: playlistId,
          music_url: result.musicUrl
        })
      })

      if (response.ok) {
        setPopupMessage('Added song to playlist')
        setIsPopupOpen(true)
        setShowPlaylists(false)
      }
    } catch (error) {
      console.error('Error adding to playlist:', error)
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateAreas: `
           "image content"
           "buttons buttons"
           "playlists playlists"
         `,
          gridTemplateColumns: 'auto 1fr',
          gap: 2,
          p: 2,
          background: 'rgba(20, 20, 20, 0.5)',
          borderWidth: '4px',
          borderStyle: 'solid',
          borderColor: 'rgba(30, 30, 30, 0.8)',
          borderRadius: '10px',
          marginTop: '1rem',
          width: '100%',
          mx: 'auto'
        }}
      >
        <Box sx={{ gridArea: 'image', alignSelf: 'start' }}>
          <img
            src={result.thumbnailUrl}
            alt={result.title}
            style={{
              width: '120px',
              height: 'auto',
              borderRadius: '4px'
            }}
          />
        </Box>

        <Box sx={{ gridArea: 'content', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <h3 style={{ margin: 0 }}>Title: {result.title}</h3>
          <div>Channel: {result.channelTitle}</div>
        </Box>

        <Box sx={{
          gridArea: 'buttons',
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 2
        }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/watch/video/${result.musicUrl}`)}
          >
            Watch
          </Button>
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
        </Box>

        <Collapse in={showPlaylists} sx={{ gridArea: 'playlists', width: '100%' }}>
          <List sx={{ bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1 }}>
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
      </Box>
      <Popup
        message={popupMessage}
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        severity="info"
        duration={3000}
      />
    </>
  )
}

export function SearchResultRegular({ result }: { result: SearchResultProps }) {
  const router = useRouter()
  const [popupMessage, setPopupMessage] = useState("")
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const accountId = sessionStorage.getItem('account_id')

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
      })

      if (response.ok) {
        setPopupMessage('Added to database.')
        setIsPopupOpen(true)
      }
    } catch (error) {
      console.error('Error adding to library:', error)
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateAreas: `
           "image content"
           "buttons buttons"
           "playlists playlists"
         `,
          gridTemplateColumns: 'auto 1fr',
          gap: 2,
          p: 2,
          background: 'rgba(20, 20, 20, 0.5)',
          borderWidth: '4px',
          borderStyle: 'solid',
          borderColor: 'rgba(30, 30, 30, 0.8)',
          borderRadius: '10px',
          marginTop: '1rem',
          width: '100%',
          mx: 'auto'
        }}
      >
        <Box sx={{ gridArea: 'image', alignSelf: 'start' }}>
          <img
            src={result.thumbnailUrl}
            alt={result.title}
            style={{
              width: '120px',
              height: 'auto',
              borderRadius: '4px'
            }}
          />
        </Box>

        <Box sx={{ gridArea: 'content', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <h3 style={{ margin: 0 }}>Title: {result.title}</h3>
          <div>Channel: {result.channelTitle}</div>
        </Box>

        <Box sx={{
          gridArea: 'buttons',
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 2
        }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/watch/video/${result.musicUrl}`)}
          >
            Watch
          </Button>
          {accountId && (
            <OutlinedButton value="Add to database" onClick={handleAddToLibrary} width={175} />
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
  )
}
