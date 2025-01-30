"use client"
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem('account_id'));
  }, []);

  return (
    <Card sx={{
      width: { xs: '130px', sm: '150px' },
      backgroundColor: 'rgba(30, 30, 30, 0.6)',
      borderRadius: '8px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: isMobile ? 'none' : 'translateY(-4px)',
        boxShadow: isMobile ? 'none' : '0 6px 12px rgba(0, 0, 0, 0.2)'
      },
      '&:active': isMobile ? {
        transform: 'scale(0.98)',
        backgroundColor: 'rgba(40, 40, 40, 0.6)'
      } : {}
    }}>
      <CardMedia
        component="img"
        sx={{
          height: { xs: "80px", sm: "100px" },
          objectFit: "cover",
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: isMobile ? 'none' : 'scale(1.05)'
          },
          '&:active': isMobile ? {
            transform: 'scale(0.98)'
          } : {}
        }}
        image={song.thumbnail_url}
        alt={song.title}
        onClick={() => { push ? router.push(push) : null }}
      />
      <CardContent sx={{
        padding: { xs: '8px', sm: '12px' },
        '&:last-child': {
          paddingBottom: { xs: '8px', sm: '12px' }
        }
      }}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 0.5,
              maxWidth: { xs: '110px', sm: '130px' }
            }}>
            {song.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: { xs: '110px', sm: '130px' }
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
                p: { xs: 0.3, sm: 0.5 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.1)'
                },
                '&:active': isMobile ? {
                  transform: 'scale(0.9)',
                  backgroundColor: 'rgba(255, 0, 0, 0.2)'
                } : {}
              }}
            >
              {state ? <FavoriteIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
