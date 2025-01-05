import { Box, Typography, Stack, Button, StackProps, BoxProps } from '@mui/material';
import { useRouter } from 'next/navigation';
import OutlinedButton from './OutlinedButton';
import BoxBackground from './BoxBackground';
import { ReactNode } from 'react';


function LandingStack() {
  return (
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
  )

}

function BottomLandingNavigationButtons() {
  const router = useRouter()
  return (<Box sx={{
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    maxWidth: '800px',
    marginTop: '1rem',
    mx: 'auto'
  }}>
    <OutlinedButton value="Search" onClick={() => router.push('/search')} />
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

