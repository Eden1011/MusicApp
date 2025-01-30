import { Box } from "@mui/material";
import { ReactNode } from "react";

export default function BoxBackground({ children }: { children: ReactNode }) {
  return (
    <Box
      key='BoxBackground'
      sx={{
        background: 'rgba(20, 20, 20, 0.5)',
        borderWidth: { xs: '1px', sm: '2px' },
        borderColor: 'rgba(30, 30, 30, 0.5)',
        borderRadius: { xs: '8px', sm: '10px' },
        marginTop: { xs: '0.5rem', sm: '1rem' },
        padding: { xs: '1rem', sm: '2rem' },
        backdropFilter: 'blur(50px)',
        alignSelf: 'flex-start',
        width: '100%',
        mx: 'auto',
        overflowX: 'hidden'
      }}
    >
      {children}
    </Box>
  );
}
