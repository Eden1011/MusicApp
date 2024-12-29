"use client"
import { AppBar, Toolbar, Button, Box } from '@mui/material';

export default function Navbar() {
  return (
    <AppBar position="static"
    >
      <Toolbar>
        <Box sx={{
          marginLeft: 'auto',
          display: 'flex',
          gap: 4
        }}>
          <Button color="inherit">Search</Button>
          <Button color="inherit">Library</Button>
          <Button color="inherit">Discover</Button>
          <Button color="inherit">Chat</Button>
        </Box>
      </Toolbar>
    </AppBar >
  );
}
