import { Stack, Box, Skeleton, StackProps } from "@mui/material";
import SearchResult from "./SearchResults";
import { SearchResultProps } from "./SearchResults";
import BoxBackground from "./BoxBackground";

export function SearchStackSkeleton({ amount }: { amount: number }) {
  return (<Stack
    key="stacky"
    direction="column"
    spacing={2}
  >
    {Array.from(Array(amount).keys()).map(i => (
      <Box
        key={`result-skeleton-${i}`}
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
        <Skeleton
          key={`thumbnail-skeleton-${i}`}
          variant="rectangular"
          width={120}
          height={70}
          sx={{ gridArea: 'image' }}
        />
        <Box
          key={`content-box-${i}`}
          sx={{ gridArea: 'content', display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Skeleton key={`title-skeleton-${i}`} variant="text" width="80%" height={30} />
          <Skeleton key={`subtitle-skeleton-${i}`} variant="text" width="60%" />
        </Box>
        <Box
          key={`buttons-box-${i}`}
          sx={{ gridArea: 'buttons', display: 'flex', gap: 2, justifyContent: 'flex-end', paddingTop: 2 }}
        >
          <Skeleton key={`button1-skeleton-${i}`} variant="rectangular" width={70} height={36} />
          <Skeleton key={`button2-skeleton-${i}`} variant="rectangular" width={140} height={36} />
          <Skeleton key={`button3-skeleton-${i}`} variant="rectangular" width={100} height={36} />
        </Box>
      </Box>
    ))}
  </Stack>
  )
}

function StackQueryResults({ data }: { data: SearchResultProps[] }) {
  return (<Stack key="stackdifferent"
    direction="column"
    spacing={2}
  >
    {data.map((x, idx) => <SearchResult key={`search-res-${idx}`} result={x} />)}
  </Stack>
  )
}

export default function StackSearchResults({ amount, data, isLoading }: { amount: number, data: SearchResultProps[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <BoxBackground key={'SkeletonBoxBg'}>
        <SearchStackSkeleton amount={amount} />
      </BoxBackground>
    )
  }

  return (
    <BoxBackground key={'ProperStackQueryBoxBg'}>
      <StackQueryResults data={data} />
    </BoxBackground>
  );
}
