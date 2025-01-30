"use client"
import { AppBar, Toolbar, Button, Box, ButtonGroup, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobileNavbar /> : <DesktopNavbar />}
    </Suspense>
  );
}

function MobileNavbar() {
  const router = useRouter();
  const [account_id, setAccount_id] = useState<string | undefined>();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setAccount_id(sessionStorage.getItem('account_id') || undefined);
  }, []);

  const navItems = [
    { text: 'Search', path: '/search' },
    { text: 'Watch', path: '/watch' },
    { text: 'Library', path: '/library' },
    { text: 'Discover', path: '/discover' },
    { text: 'Chat', path: '/chat' },
    !account_id ? { text: 'Login', path: '/login' } : { text: 'Account', path: '/account' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component="div"
          onClick={() => handleNavigation('/')}
          sx={{
            cursor: 'pointer',
            fontStyle: 'italic',
            '&:hover': { opacity: 0.8 }
          }}
        >
          Projekt
        </Typography>

        <IconButton
          color="inherit"
          onClick={() => setMobileOpen(true)}
          edge="end"
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              width: '30%',
              background: 'rgba(20, 20, 20, 0.5)',
              borderBottomWidth: '2px',
              borderBottomColor: 'rgba(30, 30, 30, 0.5)',
              backdropFilter: 'blur(50px)',
            }
          }}
        >
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    py: 2,
                    justifyContent: 'flex-end'
                  }}
                >
                  <ListItemText
                    primary={item.text}
                    sx={{
                      textAlign: 'center',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

function DesktopNavbar() {
  const router = useRouter();
  const [account_id, setAccount_id] = useState<string | undefined>();

  useEffect(() => {
    setAccount_id(sessionStorage.getItem('account_id') || undefined);
  }, []);

  const navItems = [
    { text: 'Search', path: '/search' },
    { text: 'Watch', path: '/watch' },
    { text: 'Library', path: '/library' },
    { text: 'Discover', path: '/discover' },
    { text: 'Chat', path: '/chat' },
  ];

  const accountButton = !account_id ? (
    <Button
      color="inherit"
      onClick={() => router.push('/login')}
      sx={{
        width: '5rem',
        borderWidth: '1px',
        borderColor: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          width: '8rem',
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0 0 20px rgba(255, 255, 255, 1)'
        }
      }}
    >
      Login
    </Button>
  ) : (
    <Button
      color="inherit"
      onClick={() => router.push('/account')}
      sx={{
        width: '5rem',
        borderWidth: '1px',
        borderColor: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          width: '8rem',
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0 0 20px rgba(255, 255, 255, 1)'
        }
      }}
    >
      Account
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component="div"
          onClick={() => router.push('/')}
          sx={{
            cursor: 'pointer',
            fontStyle: 'italic',
            '&:hover': { opacity: 0.8 }
          }}
        >
          Projekt
        </Typography>

        <Box>
          <ButtonGroup variant="text">
            {navItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() => router.push(item.path)}
              >
                {item.text}
              </Button>
            ))}
            {accountButton}
          </ButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
