import { Divider, Stack, Box, Skeleton } from "@mui/material";
import SearchResult from "./SearchResults";
import { SearchResultProps } from "./SearchResults";

export default function StackSearchResults({ amount, data, isLoading }: { amount: number, data: SearchResultProps[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <Box
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
        <Stack
          direction="column"
          spacing={2}
        >
          {Array.from(Array(amount).keys()).map(i => (
            <Box
              key={`skeleton-${i}`}
              sx={{
                display: 'grid',
                gridTemplateAreas: `
                  "image content"
                  "buttons buttons"
                `,
                gridTemplateColumns: 'auto 1fr',
                background: 'rgba(20, 20, 20, 0.5)',
                borderWidth: '4px',
                borderStyle: 'solid',
                borderColor: 'rgba(30, 30, 30, 0.8)',
                borderRadius: '10px',
                gap: 2,
                p: 2,
                width: '100%',
              }}
            >
              <Skeleton variant="rectangular" width={120} height={90} sx={{ gridArea: 'image' }} />
              <Box sx={{ gridArea: 'content', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" />
              </Box>
              <Box sx={{ gridArea: 'buttons', display: 'flex', gap: 2, justifyContent: 'flex-end', paddingTop: 2 }}>
                <Skeleton variant="rectangular" width={70} height={36} />
                <Skeleton variant="rectangular" width={140} height={36} />
                <Skeleton variant="rectangular" width={100} height={36} />
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      key="StackSearchResult"
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
      <Stack
        key="Stack"
        direction="column"
        spacing={2}
      >
        {data.map((x) => <SearchResult key={x.videoId} result={x} />)}
      </Stack>
    </Box>
  );
}
