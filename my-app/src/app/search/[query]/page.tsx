"use client"
import Navbar from '@/app/components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import { use, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import BoxYoutubeError from '@/app/components/BoxYoutubeError';
import CallsLeft from '@/app/components/CallsLeft';


const parseYoutubeData = (data: any) => {
  if (!data?.data?.items) return [];

  return data.data.items
    .filter(item => item.id?.kind === "youtube#video")
    .map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.default.url
    }));
};

function CallSuccess(data: any) {
  const parsed = parseYoutubeData(data)
  return (
    <>
      <CallsLeft />
      <div>
        {JSON.stringify(parsed)}
      </div>
    </>
  )
}

export default function SearchQueryPage({ params, searchParams }: { params: any, searchParams: any }) {
  let { maxResults: number } = use(searchParams)
  const { query } = use(params)
  const [youtubeData, setYoutubeData] = useState(null);

  useEffect(() => {
    const call_youtube = async () => {
      try {
        const account_id = sessionStorage.getItem('account_id');
        const api_key = sessionStorage.getItem('account_api');

        if (!account_id || !api_key) {
          throw new Error('Missing authentication data');
        }
        if (!number) number = 5
        const response = await fetch(`/api/youtube/search?account_id=${account_id}&api_key=${api_key}&query=${query}&max_results=${number}`);


        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        const data = await response.json();
        setYoutubeData(data);


        const callsLeft = parseInt(sessionStorage.getItem('calls_left') || '0');
        sessionStorage.setItem('calls_left', (callsLeft - number).toString());

      } catch (err) {
        console.error('Error fetching YouTube data:', err);
      }
    };

    if (query) {
      call_youtube();
    }
  }, [number, query]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <Box sx={{ p: 3 }}>
          {
            youtubeData?.error ? BoxYoutubeError(youtubeData) : CallSuccess(youtubeData)
          }
        </Box>
      </main>
    </ThemeProvider>
  );
}
