import { Divider, Stack, Box, Skeleton } from "@mui/material";
import SearchResult from "./SearchResults";
import { SearchResultProps } from "./SearchResults";

function SearchResultSkeleton() {
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
      }}
    >
      <Skeleton variant="rectangular" width={120} height={90} sx={{ gridArea: 'image' }} />

      <Box sx={{ gridArea: 'content', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Skeleton variant="text" width="80%" height={30} />
        <Skeleton variant="text" width="60%" />
      </Box>

      <Box sx={{ gridArea: 'buttons', display: 'flex', gap: 2, justifyContent: 'flex-end', paddingTop: 2 }}>
        <Skeleton variant="rectangular" width={140} height={36} />
        <Skeleton variant="rectangular" width={100} height={36} />
      </Box>
    </Box>
  )
}

export default function StackSearchResults({ amount, data, isLoading }: { amount: number, data: SearchResultProps[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <Stack spacing={2}>
        {Array.from(Array(amount).keys()).map(i => <SearchResultSkeleton key={i} />)}
      </Stack>
    );
  }

  return (
    <Box key="StackSearchResult"
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
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
      >
        {data.map((x): x is SearchResultProps => <SearchResult key={x.videoId} result={x} />)}
      </Stack>
    </Box>
  )

}

