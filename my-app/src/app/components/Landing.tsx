import { Box, Typography, Stack, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import OutlinedButton from './OutlinedButton';

export default function Landing() {
  const router = useRouter();

  return (
    <>
      <Box key="LandingPage"
        sx={{
          background: 'rgba(20, 20, 20, 0.5)',
          borderWidth: '2px',
          borderColor: 'rgba(30, 30, 30, 0.5)',
          borderRadius: '10px',
          marginTop: '1rem',
          padding: '2rem',
          backdropFilter: 'blur(50px)',
          width: '100%',
          maxWidth: '800px',
          mx: 'auto',
          mb: 3
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" align="center">
            Projekt
          </Typography>

          <Stack spacing={2} alignItems="center">
            <Typography variant="h6"> Music Management</Typography>
            <Typography>Create libraries, build playlists, like tracks.</Typography>
            <Typography variant="h6"> Playlist Features</Typography>
            <Typography>Unlimited playlists, easy song management, sharing.</Typography>
            <Typography variant="h6"> Account Features</Typography>
            <Typography>API access, profile management.</Typography>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        maxWidth: '800px',
        mx: 'auto'
      }}>
        <OutlinedButton value="Search" onClick={() => router.push('/search')} />
        <OutlinedButton value="Library" onClick={() => router.push('/library')} />
        <OutlinedButton value="Discover" onClick={() => router.push('/discover')} />
        <OutlinedButton value="Chat" onClick={() => router.push('/chat')} />
      </Box>
    </>
  );
}

