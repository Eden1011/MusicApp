import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[500],
      light: blue[300],
      dark: blue[700],
    },
    secondary: {
      main: '#90caf9',
      light: '#bbdefb',
      dark: '#64b5f6',
    },
    background: {
      paper: 'rgb(0,0,0)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(circle, black 0%, rgba(1,20,60,1) 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: blue[300],
          },
          '&:active': {
            boxShadow: `0 0 15px ${blue[700]}, 0 0 8px ${blue[700]}`,
            backgroundColor: blue[700],
          },
          '&.Mui-focused': {
            boxShadow: `0 0 12px ${blue[500]}`,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(20, 20, 20, 0.5)',
          borderBottomWidth: '2px',
          borderBottomColor: 'rgba(30, 30, 30, 0.5)',
          backdropFilter: 'blur(50px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '&:active': {
            boxShadow: `0 0 31px black, 0 0 8px black`,
          },

          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            '&.Mui-focused': {
              '& fieldset': {
                borderWidth: '3px',
                borderColor: blue[500],
              }
            }
          }
        }
      }
    },
  },
});

export default darkTheme;
