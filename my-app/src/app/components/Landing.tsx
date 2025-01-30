import { Box, Typography, Stack, Button, StackProps, BoxProps } from '@mui/material';
import { useRouter } from 'next/navigation';
import OutlinedButton from './OutlinedButton';
import BoxBackground from './BoxBackground';


function LandingStack() {
  return (
    <Stack spacing={{ xs: 2, sm: 3 }}>
      <Typography variant="h4" align="center" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
        Projekt
      </Typography>
      <Stack spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, textAlign: 'center' }}>
          Music Management
        </Typography>
        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, textAlign: 'center', px: { xs: 2, sm: 0 } }}>
          Create libraries, build playlists, like tracks.
        </Typography>
        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, textAlign: 'center' }}>
          Playlist Features
        </Typography>
        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, textAlign: 'center', px: { xs: 2, sm: 0 } }}>
          Unlimited playlists, easy song management, sharing.
        </Typography>
        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, textAlign: 'center' }}>
          Account Features
        </Typography>
        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, textAlign: 'center', px: { xs: 2, sm: 0 } }}>
          API access, profile management.
        </Typography>
      </Stack>
    </Stack>
  )
}

function BottomLandingNavigationButtons() {
  const router = useRouter()
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'center',
      alignItems: 'center',
      gap: { xs: 1, sm: 2 },
      maxWidth: '800px',
      marginTop: '1rem',
      mx: 'auto',
      px: { xs: 2, sm: 0 }
    }}>
      <OutlinedButton value="Search" onClick={() => router.push('/search')} />
      <OutlinedButton value="Watch" onClick={() => router.push('/watch')} />
      <OutlinedButton value="Library" onClick={() => router.push('/library')} />
      <OutlinedButton value="Discover" onClick={() => router.push('/discover')} />
      <OutlinedButton value="Chat" onClick={() => router.push('/chat')} />
    </Box>
  )
}

export default function Landing() {
  return (
    <>
      <BoxBackground key={'LandingPageBg'}>
        <LandingStack />
      </BoxBackground>
      <BottomLandingNavigationButtons />
    </>
  );
}

