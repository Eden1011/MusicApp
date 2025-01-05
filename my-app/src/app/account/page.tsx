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
import { urlencode } from '../../../lib/urlfunctions';
import BoxBackground from '../components/BoxBackground';

interface Account {
  name: string;
  description?: string;
  api_key: string;
  created_at: string;
}

interface AccountData {
  account: Account;
  likedSongs: any[];
  playlists: any[];
}

interface TextFieldStyleProps {
  value: string;
  targetLength?: number;
}

function getTextFieldStyles({ value, targetLength = 39 }: TextFieldStyleProps) {
  return {
    '& .MuiOutlinedInput-root': {
      ...(value === '' && {
        '&.Mui-focused fieldset': {
          borderColor: 'red',
          borderWidth: '2px',
          boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)'
        }
      }),
      ...(value.length === targetLength && {
        '&.Mui-focused fieldset': {
          borderColor: 'green',
          borderWidth: '2px',
          boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
        }
      })
    }
  };
}

function getChangeButtonStyles(value: string) {
  return {
    height: '50px',
    transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
    ...(value === '' && {
      backgroundColor: 'red',
      '&:hover': {
        backgroundColor: red[600],
      },
      '&:active': {
        backgroundColor: red[700],
        boxShadow: '0 0 20px 10px rgba(255, 0, 0, 0.5)',
      }
    }),
    ...(value.length === 39 && {
      backgroundColor: 'green',
      '&:hover': {
        backgroundColor: 'green',
      },
      '&:active': {
        backgroundColor: 'green',
        boxShadow: '0 0 20px 2px rgba(0, 255, 0, 0.5)',
      }
    })
  };
}

async function fetchAccountData(accountId: string): Promise<AccountData> {
  const response = await fetch(`/api/account?id=${accountId}`);
  if (!response.ok) throw new Error('Failed to fetch account data');
  return response.json();
}

async function updateApiKey(accountId: number, apiKey: string): Promise<void> {
  const response = await fetch(`/api/account/key?id=${accountId}&key=${apiKey}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) throw new Error('Failed to update API key');
  const { updatedAccount } = await response.json();
  sessionStorage.setItem('account_api', updatedAccount.api_key);
}

async function updateDescription(accountId: number, description: string): Promise<string> {
  const response = await fetch(`/api/account/description?id=${accountId}&description=${urlencode(description)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) throw new Error('Failed to update description');
  const { updatedAccount } = await response.json();
  return updatedAccount.description;
}

function AccountHeader({ account }: { account: Account }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Typography variant="h4">{account.name}</Typography>
        <Typography variant="body1">
          {account.description || 'No description'}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

function ApiKeySection({
  account,
  apiKey,
  setApiKey,
  handleApiChange
}: {
  account: Account,
  apiKey: string,
  setApiKey: (value: string) => void,
  handleApiChange: () => void
}) {
  return (
    <Box>
      <Typography variant="body2">API Key:</Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
        <TextField
          fullWidth
          placeholder={account.api_key}
          type="password"
          onChange={(e) => setApiKey(e.target.value)}
          sx={getTextFieldStyles({ value: apiKey })}
        />
        <Button
          variant='contained'
          onClick={handleApiChange}
          sx={getChangeButtonStyles(apiKey)}
        >
          Change
        </Button>
      </Box>
    </Box>
  );
}

function DescriptionSection({
  account,
  setDescription,
  handleDescChange
}: {
  account: Account,
  description: string,
  setDescription: (value: string) => void,
  handleDescChange: () => void
}) {
  return (
    <Box>
      <Typography variant="body2">Description:</Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
        <TextField
          fullWidth
          placeholder={`Description: "${account.description}"` || 'No description'}
          type="text"
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          variant='contained'
          onClick={handleDescChange}
          sx={{ height: '50px' }}
        >
          Change
        </Button>
      </Box>
    </Box>
  );
}

function StatsSection({ accountData }: { accountData: AccountData }) {
  return (
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
  );
}

function AccountInfo() {
  const [accountId, setAccountId] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    async function initAccountData() {
      try {
        const account_id = sessionStorage.getItem('account_id');
        if (!account_id) {
          setError("No account ID found");
          return;
        }

        setAccountId(parseInt(account_id));
        const data = await fetchAccountData(account_id);
        setAccountData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    initAccountData();
  }, []);

  async function handleApiChange() {
    if (!apiKey) return;
    try {
      await updateApiKey(accountId, apiKey);
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  }

  async function handleDescChange() {
    if (!description) return;
    try {
      const updatedDesc = await updateDescription(accountId, description);
      setDescription(updatedDesc);
    } catch (error) {
      console.error('Error updating description:', error);
    }
  }

  if (loading) return <Intermission />;
  if (error) return <BoxYoutubeError data={{ error: { message: error } }} />;
  if (!accountData) return <BoxYoutubeError data={{ error: { message: 'No account found!' } }} />;

  return (
    <>
      <BoxBackground>
        <Stack spacing={3}>
          <AccountHeader account={accountData.account} />
          <ApiKeySection
            account={accountData.account}
            apiKey={apiKey}
            setApiKey={setApiKey}
            handleApiChange={handleApiChange}
          />
          <DescriptionSection
            account={accountData.account}
            description={description}
            setDescription={setDescription}
            handleDescChange={handleDescChange}
          />
          <Box>
            <Typography variant="body2">
              Created: {accountData.account.created_at}
            </Typography>
          </Box>
          <StatsSection accountData={accountData} />
        </Stack>
      </BoxBackground>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: 2,
        px: 3,
        width: '100%',
        mx: 'auto'
      }}>
        <DeleteButton accountId={accountId} />
      </Box>
    </>
  );
}
export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <AccountInfo />
      </main>
    </ThemeProvider>
  );
}
