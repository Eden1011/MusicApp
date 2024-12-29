import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[500], // Standard blue
      light: blue[300], // Lighter blue for hover states
      dark: blue[700], // Darker blue for pressed states
    },
    secondary: {
      main: '#90caf9', // Light blue
      light: '#bbdefb',
      dark: '#64b5f6',
    },
    background: {
      default: 'linear-gradient(145deg, #000000 0%, #1a237e 100%)',
      paper: 'rgba(0, 0, 0, 0.8)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(145deg, #000000 0%, #1a237e 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: blue[300],
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

export default darkTheme;
