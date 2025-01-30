'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from "@/styles/theme";
import Navbar from '@/app/components/Navbar';
import StackSearchResults from '@/app/components/StackSearchResults';
import { useEffect, useState } from 'react';
import { SearchResultProps } from '@/app/components/SearchResults';
import BoxYoutubeError from '@/app/components/BoxYoutubeError';
import { Box } from '@mui/material';
import mqtt from 'mqtt';

function AllSongsResults({ loading, amount, data }: {
  loading: boolean,
  amount: number,
  data: SearchResultProps[]
}) {
  if (loading) return (<StackSearchResults amount={amount} data={data} isLoading={loading} page='watch' />)
  if (data.length === 0) return (<BoxYoutubeError data={{ error: { message: "No songs found!" } }} />)
  return (<StackSearchResults amount={amount} data={data} isLoading={loading} page='watch' />)
}

export default function DiscoverPage() {
  const [songs, setSongs] = useState<SearchResultProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    client.on('connect', () => {
      client.subscribe('music-app/new-songs');
    });

    client.on('message', (topic, message) => {
      if (topic === 'music-app/new-songs') {
        const song = JSON.parse(message.toString());
        const formattedSong = {
          title: song.title,
          musicUrl: song.music_url,
          channelTitle: song.artist,
          thumbnailUrl: song.thumbnail_url
        };
        setSongs(prev => [formattedSong, ...prev]);
      }
    });

    const fetchInitialSongs = async () => {
      try {
        const response = await fetch('/api/songs/all');
        const data = await response.json();
        const formattedSongs = data.songs.map((song: any) => ({
          title: song.title,
          musicUrl: song.music_url,
          channelTitle: song.artist,
          thumbnailUrl: song.thumbnail_url
        }));
        setSongs(formattedSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSongs();

    return () => {
      client.end();
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Navbar />
        <Box sx={{ marginTop: '1rem' }}>
          <AllSongsResults loading={loading} amount={5} data={songs} />
        </Box>
      </main>
    </ThemeProvider>
  );
}
