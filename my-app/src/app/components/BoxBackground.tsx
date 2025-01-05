import { Box } from "@mui/material";
import { ReactNode } from "react";

export default function BoxBackground({ children }: { children: ReactNode }) {
  return (<Box
    key='BoxBackground'
    sx={{
      background: 'rgba(20, 20, 20, 0.5)',
      borderWidth: '2px',
      borderColor: 'rgba(30, 30, 30, 0.5)',
      borderRadius: '10px',
      marginTop: '1rem',
      padding: '2rem',
      backdropFilter: 'blur(50px)',
      alignSelf: 'flex-start',
      width: '100%',
      mx: 'auto'
    }}
  >
    {children}
  </Box>
  )
}


