"use client"
import { AppBar, Toolbar, Button, Box, ButtonGroup, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter()
  const [account_id, setAccount_id] = useState<string | undefined>();

  useEffect(() => {
    setAccount_id(sessionStorage.getItem('account_id') || undefined)
  }, [])

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={() => router.push('/')}
          sx={{
            cursor: 'pointer',
            fontStyle: 'italic',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          Projekt
        </Typography>
        <Box sx={{ marginLeft: 'auto' }}>
          <ButtonGroup variant='text'>
            <Button color="inherit" onClick={() => router.push('/search')}>Search</Button>
            <Button color="inherit" onClick={() => router.push('/watch')}>Watch</Button>
            <Button color="inherit" onClick={() => router.push('/library')}>Library</Button>
            <Button color="inherit" onClick={() => router.push('/discover')}>Discover</Button>
            <Button color="inherit" onClick={() => router.push('/chat')}>Chat</Button>
            {!account_id ?
              <Button color="inherit" onClick={() => router.push('/login')}
                sx={{
                  width: '5rem',
                  borderWidth: '1px',
                  borderColor: 'yellow',
                  '&:hover': {
                    width: '8rem',
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 1)'
                  },
                  '&:active': {
                    width: '8rem',
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: '0 0 25px rgba(255, 255, 255, 1)'
                  }
                }}
              > Login </Button>
              :
              <Button color="inherit" onClick={() => router.push('/account')}
                sx={{
                  width: '5rem',
                  borderWidth: '1px',
                  borderColor: 'yellow',
                  '&:hover': {
                    width: '8rem',
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 1)'
                  },
                  '&:active': {
                    width: '8rem',
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: '0 0 25px rgba(255, 255, 255, 1)'
                  }
                }}
              > Account </Button>
            }
          </ButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
