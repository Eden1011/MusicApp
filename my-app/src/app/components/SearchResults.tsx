import { Box, Button } from "@mui/material"
import OutlinedButton from "./OutlinedButton";


export interface SearchResultProps {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}


export default function SearchResult({ result }: { result: SearchResultProps }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: `
          "image content"
          "buttons buttons"
        `,
        gridTemplateColumns: 'auto 1fr',
        gap: 2,
        p: 2,
        background: 'rgba(20, 20, 20, 0.5)',
        borderWidth: '4px',
        borderStyle: 'solid',
        borderColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: '10px',
        marginTop: '1rem',
        width: '100%',
        mx: 'auto'
      }}
    >
      <Box sx={{ gridArea: 'image', alignSelf: 'start' }}>
        <img
          src={result.thumbnailUrl}
          alt={result.title}
          style={{
            width: '120px',
            height: 'auto',
            borderRadius: '4px'
          }}
        />
      </Box>

      <Box
        sx={{
          gridArea: 'content',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <h3 style={{ margin: 0 }}>Title: {result.title}</h3>
        <div>Channel: {result.channelTitle}</div>
      </Box>

      <Box
        sx={{
          gridArea: 'buttons',
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 2
        }}
      >
        <Button variant="contained" color="primary">Watch</Button>
        <OutlinedButton value="Add to playlist" onClick={() => 1} />
        <OutlinedButton value="Add to library" onClick={() => 1} />
      </Box>
    </Box>
  )
}
