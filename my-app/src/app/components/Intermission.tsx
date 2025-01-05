import { Box, Typography } from "@mui/material";

export default function Intermission() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        p: 1,
        background: 'rgba(20, 20, 20, 0.5)',
        borderWidth: '3px',
        borderColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: '25px',
        marginTop: '1rem',
        marginBottom: '1rem',
        backdropFilter: 'blur(50px)',
        alignSelf: 'flex-start',
        width: '20%',
        mx: 'auto',
      }}
    >
      <Typography color="white">
        Please wait...
      </Typography>
    </Box>
  );
}
