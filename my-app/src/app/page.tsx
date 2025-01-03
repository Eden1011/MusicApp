"use client"
import Navbar from "./components/Navbar";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import CallsLeft from "./components/CallsLeft";
import { useState, useEffect } from "react";
import BoxYoutubeError from "./components/BoxYoutubeError";
import Intermission from "./components/Intermission";
import Landing from "./components/Landing";

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
        ) : !account_id ? (
          <BoxYoutubeError data={{ error: { message: 'Please log in to be able to use this platform.' } }} />
        ) : (
          <CallsLeft />
        )}
        {<Landing />}
      </main>
    </ThemeProvider>
  );
}
