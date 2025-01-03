"use client"
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import { useEffect, useState } from 'react';
import BoxYoutubeError from '../components/BoxYoutubeError';
import Intermission from '../components/Intermission';

export default function App() {
  const [account_id, setAccount_id] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAccount_id(sessionStorage.getItem('account_id') || undefined);
    setIsLoading(false);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        {isLoading ? (
          <Intermission />
        ) : account_id ? (
          <Input />
        ) : (
          <BoxYoutubeError data={{ error: { message: 'Please log in to be able to search.' } }} />
        )}
      </main>
    </ThemeProvider>
  );
}
