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
            {!sessionStorage.getItem('account_id') ?
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
    </AppBar >
  );
}
