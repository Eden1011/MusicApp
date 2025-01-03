import { Box, Typography } from "@mui/material";

export default function Intermission() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 1,
        background: "rgba(20, 20, 20, 0.5)",
        borderWidth: "2px",
        borderColor: "rgba(20, 20, 20, 0.5)",
        borderRadius: "25px",
        marginTop: "1rem",
        backdropFilter: "blur(50px)",
        alignSelf: "flex-start",
        width: "fit-content",
        mx: "auto",
        marginBottom: '1rem'
      }}
    >
      <Typography color="white">
        Please wait...
      </Typography>
    </Box>
  );
}
