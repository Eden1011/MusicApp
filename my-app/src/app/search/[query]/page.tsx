"use client"
import Navbar from '@/app/components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import { use, useEffect, useState } from 'react';
import BoxYoutubeError from '@/app/components/BoxYoutubeError';
import CallsLeft from '@/app/components/CallsLeft';
import StackSearchResults from '@/app/components/StackSearchResults';
import Intermission from '@/app/components/Intermission';

interface YouTubeVideoId {
  kind: string;
  videoId: string;
}

interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

interface YouTubeSnippet {
  title: string;
  channelTitle: string;
  thumbnails: {
    default: YouTubeThumbnail;
  };
}

interface YouTubeItem {
  id: YouTubeVideoId;
  snippet: YouTubeSnippet;
}

interface YouTubeApiResponse {
  data?: {
    items: YouTubeItem[];
  };
  error?: string;
}

interface ParsedVideoData {
  musicUrl: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

interface SearchQueryPageProps {
  params: {
    query: string;
  };
  searchParams: {
    maxResults?: string;
  };
}

const parseYoutubeData = (data: YouTubeApiResponse): ParsedVideoData[] => {
  if (!data?.data?.items) return [];

  return data.data.items
    .filter((item): item is YouTubeItem => item.id?.kind === "youtube#video")
    .map(item => ({
      musicUrl: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.default.url
    }));
};


export default function SearchQueryPage({ params, searchParams }: SearchQueryPageProps) {
  const { maxResults } = use(searchParams);
  const { query } = use(params);
  const [youtubeData, setYoutubeData] = useState<YouTubeApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const number = maxResults ? parseInt(maxResults) : 5;

  useEffect(() => {
    const call_youtube = async () => {
      setIsLoading(true)
      try {
        const account_id = sessionStorage.getItem('account_id');
        const api_key = sessionStorage.getItem('account_api');

        if (!account_id || !api_key) {
          throw new Error('Missing authentication data');
        }

        const response = await fetch(`/api/youtube/search?account_id=${account_id}&api_key=${api_key}&query=${query}&max_results=${number}`);


        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        const data: YouTubeApiResponse = await response.json();
        setYoutubeData(data);
        console.log(data);


        const callsLeft = parseInt(sessionStorage.getItem('calls_left') || '0');
        sessionStorage.setItem('calls_left', (callsLeft - number).toString());

      } catch (err) {
        console.error('Error fetching YouTube data:', err);
      } finally {
        setIsLoading(false)
      }
    };

    if (query) {
      call_youtube();
    }
  }, [number, query]);


  function CallSuccess(data: YouTubeApiResponse, isLoading: boolean) {
    const parsed: ParsedVideoData[] = parseYoutubeData(data)
    if (parsed.length === 0 && isLoading === false) {
      return (
        <>
          <BoxYoutubeError data={
            {
              error:
              {
                message: "Could not find any results. Maybe the key or query is faulty?"
              }
            }}
          />
        </>
      )
    }
    else if (parsed.length === 0) {
      return (
        <>
          <Intermission />
          <StackSearchResults amount={number} data={parsed} isLoading={isLoading} page='search' />
        </>

      )
    }
    return (
      <>
        <CallsLeft />
        <StackSearchResults amount={number} data={parsed} isLoading={isLoading} page='search' />
      </>
    )
  }


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        {
          youtubeData?.error ? BoxYoutubeError(youtubeData) : CallSuccess(youtubeData, isLoading)
        }
      </main>
    </ThemeProvider>
  );
}
