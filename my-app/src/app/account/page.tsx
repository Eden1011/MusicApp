"use client"
import Navbar from '../components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import { useState, useEffect } from "react";
import { Typography, Box, Stack, Divider, Button, TextField } from '@mui/material';
import Intermission from '../components/Intermission';
import BoxYoutubeError from '../components/BoxYoutubeError';
import DeleteButton from '../components/DeleteButton';
import { red } from '@mui/material/colors';

function AccountInfo() {
  const [accountId, setAccountId] = useState(0)
  const [api_key, setApiKey] = useState("")
  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const account_id = sessionStorage.getItem('account_id');
        if (!account_id) {
          setError("No account ID found");
          setLoading(false);
          return;
        }
        setAccountId(parseInt(account_id))

        const response = await fetch(`/api/account?id=${account_id}`);
        if (!response.ok) throw new Error('Failed to fetch account data');

        const data = await response.json();
        setAccountData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);


  async function handleAPIChange() {
    if (!api_key) return;

    try {
      const response = await fetch(`/api/account/key?id=${accountId}&key=${api_key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to update API key');

      const { updatedAccount } = await response.json();
      sessionStorage.setItem('account_api', updatedAccount.api_key)
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  }


  if (loading) return (
    <Intermission />
  );
  if (error) return <BoxYoutubeError data={{ error: { message: error } }} />;
  if (!accountData) return <BoxYoutubeError data={{ error: { message: 'No account found!' } }} />;

  return (
    <>
      <Box key="AccountInfo"
        sx={{
          background: 'rgba(20, 20, 20, 0.5)',
          borderWidth: '2px',
          borderColor: 'rgba(30, 30, 30, 0.5)',
          borderRadius: '10px',
          marginTop: '1rem',
          padding: '2rem',
          backdropFilter: 'blur(50px)',
          alignSelf: 'flex-start',
          width: '100%',
          maxWidth: '80%',
          mx: 'auto'
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant="h4">{accountData.account.name}</Typography>
              <Typography variant="body1">
                {accountData.account.description || 'No description'}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>

          <Box>
            <Typography variant="body2">API Key:</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
              <TextField
                fullWidth
                placeholder={accountData.account.api_key}
                type="password"
                onChange={(e) => setApiKey(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    ...(api_key === '' && {
                      '&.Mui-focused fieldset': {
                        borderColor: 'red',
                        borderWidth: '2px',
                        boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)'
                      }
                    })
                  }
                }}

              />
              <Button variant='contained'
                onClick={handleAPIChange}
                sx={{
                  height: '50px',
                  transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
                  ...(api_key === '' && {
                    backgroundColor: 'red',
                    '&:hover': {
                      backgroundColor: red[600],
                    },
                    '&:active': {
                      backgroundColor: red[700],
                      boxShadow: '0 0 20px 10px rgba(255, 0, 0, 0.5)',
                    }
                  })
                }}

              >
                Change
              </Button>
            </Box>
          </Box>


          <Box >
            <Typography variant="body2">
              Created: {accountData.account.created_at}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box>
              <Typography variant="h6">
                Liked songs: {accountData.likedSongs.length}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">
                Playlists: {accountData.playlists.length}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: 2,
        px: 3,
        maxWidth: '80%',
        width: '100%',
        mx: 'auto',
      }}>
        <DeleteButton accountId={accountId} />
      </Box >

    </>)
}

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <Box sx={{ p: 3 }}>
          <AccountInfo />
        </Box>
      </main>
    </ThemeProvider>
  );
}
