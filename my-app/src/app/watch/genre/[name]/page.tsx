"use client"
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import Navbar from '@/app/components/Navbar';
import StackSearchResults from '@/app/components/StackSearchResults';
import { useEffect, useState, use } from 'react';
import { SearchResultProps } from '@/app/components/SearchResults';
import BoxYoutubeError from '@/app/components/BoxYoutubeError';
import InputWatchSearch from '@/app/components/InputWatchSearch';
import { Box } from '@mui/material';

interface GenreNameParams {
  params: {
    name: string
  }
}

function GenreSongs({ loading, amount, data }:
  { loading: boolean, amount: number, data: any }) {
  if (loading) return (<StackSearchResults amount={amount} data={data} isLoading={loading} page='watch' />)
  else {
    if (data.length === 0) return (<BoxYoutubeError data={{ error: { message: "No songs found!" } }} />)
    else return (<StackSearchResults amount={amount} data={data} isLoading={loading} page='watch' />)
  }
}

export default function WatchGenrePage({ params }: GenreNameParams) {
  const { name } = use(params)
  const [songs, setSongs] = useState<SearchResultProps[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<SearchResultProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`/api/genre?genre=${name}`);
        const data = await response.json();
        const formattedSongs = data.songs.map((song: any) => ({
          title: song.title,
          musicUrl: song.music_url,
          channelTitle: song.artist,
          thumbnailUrl: song.thumbnail_url
        }));
        setSongs(formattedSongs);
        setFilteredSongs(formattedSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [name]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <Box sx={{ marginTop: '1rem' }}>
          <InputWatchSearch
            songs={songs}
            setFilteredSongs={setFilteredSongs}
            text={`Search in ${name}`}
          />
        </Box>
        <GenreSongs loading={loading} amount={5} data={filteredSongs} />
      </main>
    </ThemeProvider>
  );
}
