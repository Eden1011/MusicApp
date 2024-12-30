"use client"
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import { useEffect, useState } from 'react';

export default function App() {
  const [account_id, setAccount_id] = useState<string | undefined>();
  useEffect(() => {
    setAccount_id(sessionStorage.getItem('account_id') || undefined)
  }, [])
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        {!account_id ? <p>Please log in to search</p> : <Input />}
      </main>
    </ThemeProvider>
  );
}
