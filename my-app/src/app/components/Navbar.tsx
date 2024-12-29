"use client"
import { AppBar, Toolbar, Button, Box, ButtonGroup } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter()
  return (
    <AppBar position="static"
    >
      <Toolbar>
        <Box sx={{
          marginLeft: 'auto',
        }}>
          <ButtonGroup variant='text'
          >
            <Button color="inherit" onClick={() => router.push('/search')}>Search</Button>
            <Button color="inherit" onClick={() => router.push('/library')}>Library</Button>
            <Button color="inherit" onClick={() => router.push('/discover')}>Discover</Button>
            <Button color="inherit" onClick={() => router.push('/chat')}>Chat</Button>
          </ButtonGroup>
        </Box>
      </Toolbar>
    </AppBar >
  );
}
