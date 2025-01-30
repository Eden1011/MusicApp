import { Stack, Box, Skeleton, useTheme, useMediaQuery } from "@mui/material";
import { SearchResultRegular, SearchResultWatch } from "./SearchResults";
import { SearchResultProps } from "./SearchResults";
import BoxBackground from "./BoxBackground";

export function SearchStackSkeleton({ amount }: { amount: number }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      key="stacky"
      direction="column"
      spacing={{ xs: 1, sm: 2 }}
    >
      {Array.from(Array(amount).keys()).map(i => (
        <Box
          key={`result-skeleton-${i}`}
          sx={{
            display: 'grid',
            gridTemplateAreas: {
              xs: `
               "image"
               "content"
               "buttons"
             `,
              sm: `
               "image content"
               "buttons buttons"
             `
            },
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'auto 1fr'
            },
            background: 'rgba(20, 20, 20, 0.5)',
            borderWidth: { xs: '2px', sm: '4px' },
            borderStyle: 'solid',
            borderColor: 'rgba(30, 30, 30, 0.8)',
            borderRadius: { xs: '8px', sm: '10px' },
            gap: { xs: 1, sm: 2 },
            p: { xs: 1, sm: 2 },
            width: '100%',
          }}
        >
          <Skeleton
            variant="rectangular"
            width={isMobile ? '100%' : 120}
            height={isMobile ? 200 : 80}
            sx={{
              gridArea: 'image',
              maxWidth: isMobile ? '300px' : 'none',
              margin: isMobile ? '0 auto' : 'initial'
            }}
          />
          <Box
            sx={{
              gridArea: 'content',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <Skeleton variant="text" width={isMobile ? '100%' : '80%'} height={30} />
            <Skeleton variant="text" width={isMobile ? '100%' : '60%'} />
          </Box>
          <Box
            sx={{
              gridArea: 'buttons',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 },
              justifyContent: { xs: 'stretch', sm: 'flex-end' },
              paddingTop: 2
            }}
          >
            <Skeleton variant="rectangular" width={isMobile ? '100%' : 70} height={36} />
            <Skeleton variant="rectangular" width={isMobile ? '100%' : 140} height={36} />
            <Skeleton variant="rectangular" width={isMobile ? '100%' : 100} height={36} />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

function StackQueryResults({ data, page }: { data: SearchResultProps[], page: string }) {
  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2 }}
    >
      {data.map((x, idx) =>
        page === 'search' ?
          <SearchResultRegular key={`search-res-${idx}`} result={x} /> :
          <SearchResultWatch key={`search-res-${idx}`} result={x} />
      )}
    </Stack>
  );
}

export default function StackSearchResults({ amount, data, isLoading, page }: {
  amount: number,
  data: SearchResultProps[],
  isLoading: boolean,
  page: string
}) {
  return (
    <BoxBackground>
      {isLoading ?
        <SearchStackSkeleton amount={amount} /> :
        <StackQueryResults data={data} page={page} />}
    </BoxBackground>
  );
}
