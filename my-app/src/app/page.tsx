"use client"
import Navbar from "./components/Navbar";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import Input from "./components/Input";


export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <Input />
      </main>
    </ThemeProvider>
  );
}
