import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function CallsLeft() {
  const [callsLeft, setCallsLeft] = useState('')
  useEffect(() => {
    const session = sessionStorage.getItem('calls_left')

    if (session) setCallsLeft(session)
  }, [callsLeft])

  if (callsLeft) return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 1,
        background: "rgba(20, 70, 20, 0.5)",
        borderWidth: "2px",
        borderColor: "rgba(30, 100, 30, 0.9)",
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
        You have {callsLeft} API calls left for today.
      </Typography>
    </Box>
  );
  return
}
