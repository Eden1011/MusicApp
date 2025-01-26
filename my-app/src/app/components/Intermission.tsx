import { Box, Typography } from "@mui/material";

export default function Intermission({ text = "Please wait..." }: { text: string }) {
  return (
    <Box
      sx={{
        width: 'fit-content',
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
        mx: 'auto',
      }}
    >      <Typography color="white">
        {text}
      </Typography>
    </Box>
  );
}
