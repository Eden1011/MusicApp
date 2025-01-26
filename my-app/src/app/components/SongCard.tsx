"use client"
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Box
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';

interface SongCardProps {
  song: {
    id: number;
    title: string;
    artist: string;
    music_url: string;
    thumbnail_url: string;
  };
  push: string | null;
  action: ((id: number) => void) | null;
  state: boolean
}

export default function SongCard({ song, action, state, push = `/watch/video/${song.music_url}` }: SongCardProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem('account_id'));
  }, []);

  return (
    <Card sx={{
      width: '150px',
      backgroundColor: 'rgba(30, 30, 30, 0.6)',
      borderRadius: '8px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
      }
    }}>
      <CardMedia
        component="img"
        sx={{
          height: "100px",
          objectFit: "cover",
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
        image={song.thumbnail_url}
        alt={song.title}
        onClick={() => { push ? router.push(push) : null }}
      />
      <CardContent sx={{
        padding: '12px',
        '&:last-child': {
          paddingBottom: '12px'
        }
      }}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: '0.9rem',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 0.5,
              maxWidth: '130px'
            }}>
            {song.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '130px'
            }}
          >
            {song.artist}
          </Typography>
        </Box>
        {isLoggedIn && action && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              onClick={() => action(song.id)}
              color='error'
              size="small"
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.1)'
                }
              }}
            >
              {state ? <FavoriteIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card >
  );
}
