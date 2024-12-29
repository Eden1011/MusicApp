"use client"
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import Login from '../components/Login';

export default function LoginPage() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Login />
      </main>
    </ThemeProvider>
  );
}
