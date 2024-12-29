"use client"
import { AppBar, Toolbar, Button, Box, ButtonGroup } from '@mui/material';

export default function Navbar() {
  return (
    <AppBar position="static"
    >
      <Toolbar>
        <Box sx={{
          marginLeft: 'auto',
        }}>
          <ButtonGroup variant='text'
          >
            <Button color="inherit">Search</Button>
            <Button color="inherit">Library</Button>
            <Button color="inherit">Discover</Button>
            <Button color="inherit">Chat</Button>
          </ButtonGroup>
        </Box>
      </Toolbar>
    </AppBar >
  );
}
