import { Box, Typography } from "@mui/material";

export default function BoxYoutubeError({ data }: { data: any }) {
  if (data?.error) {
    return (
      <Box
        key={'box-error'}
        sx={{
          display: 'flex', gap: 2, p: 1,
          background: 'rgba(70, 20, 20, 0.5)',
          borderWidth: '3px',
          borderColor: 'rgba(90, 30, 30, 0.8)',
          borderRadius: '25px',
          marginTop: '1rem',
          marginBottom: '1rem',
          backdropFilter: 'blur(50px)',
          alignSelf: 'flex-start',
          width: 'fit-content',
          mx: 'auto',
        }}>
        <Typography sx={{
          color: 'white',
          textAlign: 'center'
        }}>
          {data.error.message}
        </Typography>
      </Box>
    );
  }
}
