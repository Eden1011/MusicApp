"use client"
import Navbar from '../components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import { useState, useEffect } from "react";
import { Typography, Box, Stack, Divider, Button, TextField, useMediaQuery, Container } from '@mui/material';
import Intermission from '../components/Intermission';
import BoxYoutubeError from '../components/BoxYoutubeError';
import DeleteButton from '../components/DeleteButton';
import { red } from '@mui/material/colors';
import { urlencode } from '../../../lib/urlfunctions';
import BoxBackground from '../components/BoxBackground';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';

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
    width: '100%',
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
    minHeight: '50px',
    whiteSpace: 'nowrap',
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

async function updateDescription(accountId: number, description: string): Promise<Account> {
  const response = await fetch(`/api/account/description?id=${accountId}&description=${urlencode(description)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) throw new Error('Failed to update description');
  const { updatedAccount } = await response.json();
  sessionStorage.setItem('account_description', updatedAccount.description || '');
  return updatedAccount;
}

function AccountHeader({ account }: { account: Account }) {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        gap: isMobile ? 2 : 0,
        width: '100%'
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ wordBreak: 'break-word' }}>
          {account.name}
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
          {account.description || 'No description'}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

function ApiKeySection({
  account,
  formik
}: {
  account: Account,
  formik: ReturnType<typeof useFormik>
}) {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      <Typography variant="body2">API Key:</Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        alignItems: isMobile ? 'stretch' : 'center',
        mt: 1
      }}>
        <TextField
          fullWidth
          type="password"
          name="apiKey"
          value={formik.values.apiKey}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={getTextFieldStyles({ value: formik.values.apiKey })}
        />
        <Button
          variant='contained'
          onClick={() => formik.submitForm()}
          sx={getChangeButtonStyles(formik.values.apiKey)}
          disabled={!formik.values.apiKey || !formik.isValid}
          fullWidth={isMobile}
        >
          Change
        </Button>
      </Box>
    </Box>
  );
}

function DescriptionSection({
  account,
  formik
}: {
  account: Account,
  formik: ReturnType<typeof useFormik>
}) {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      <Typography variant="body2">Description:</Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        alignItems: isMobile ? 'stretch' : 'center',
        mt: 1
      }}>
        <TextField
          fullWidth
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          multiline={isMobile}
          rows={isMobile ? 3 : 1}
        />
        <Button
          variant='contained'
          onClick={() => formik.submitForm()}
          sx={{ minHeight: '50px' }}
          disabled={!formik.values.description || !formik.isValid}
          fullWidth={isMobile}
        >
          Change
        </Button>
      </Box>
    </Box>
  );
}

function StatsSection({ accountData }: { accountData: AccountData }) {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      gap: 2,
      width: '100%'
    }}>
      <Box>
        <Typography variant="h6">
          Liked songs: {accountData.likedSongs.length}
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6">
          Playlists: {accountData.playlists.length}
        </Typography>
      </Box>
    </Box>
  );
}

function AccountInfo() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [accountId, setAccountId] = useState(0);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      apiKey: '',
      description: ''
    },
    onSubmit: async (values) => {
      if (values.apiKey) {
        try {
          await updateApiKey(accountId, values.apiKey);
          if (accountData) {
            setAccountData({
              ...accountData,
              account: { ...accountData.account, api_key: values.apiKey }
            });
          }
          formik.setFieldValue('apiKey', '');
        } catch (error) {
          console.error('Error updating API key:', error);
        }
      }

      if (values.description) {
        try {
          const updatedAccount = await updateDescription(accountId, values.description);
          if (accountData) {
            setAccountData({
              ...accountData,
              account: updatedAccount
            });
          }
        } catch (error) {
          console.error('Error updating description:', error);
        }
      }
    },
  });

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
        formik.setFieldValue('description', data.account.description || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    initAccountData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/');
  };

  if (loading) return <Intermission />;
  if (error) return <BoxYoutubeError data={{ error: { message: error } }} />;
  if (!accountData) return <BoxYoutubeError data={{ error: { message: 'No account found!' } }} />;

  return (
    <>
      <Container maxWidth="lg" sx={{ px: isMobile ? 2 : 3 }}>
        <BoxBackground>
          <Stack spacing={3}>
            <AccountHeader account={accountData.account} />
            <ApiKeySection
              account={accountData.account}
              formik={formik}
            />
            <DescriptionSection
              account={accountData.account}
              formik={formik}
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
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          gap: 2,
          mt: 2,
          width: '100%'
        }}>
          <DeleteButton accountId={accountId} />
          <Button
            variant="contained"
            onClick={handleLogout}
            fullWidth={isMobile}
            sx={{
              transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
              backgroundColor: 'red',
              '&:hover': {
                backgroundColor: red[600],
              },
              '&:active': {
                backgroundColor: red[700],
                boxShadow: '0 0 20px 10px rgba(255, 0, 0, 0.5)',
              }
            }}
          >
            Log out
          </Button>
        </Box>
      </Container>
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
