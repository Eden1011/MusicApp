import { Box, TextField } from '@mui/material';
import { useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { SearchResultProps } from './SearchResults';
import { useFormik } from 'formik';

interface InputWatchSearchProps {
  text: string;
  songs: string[] | SearchResultProps[];
  setFilteredSongs: (items: any[]) => void;
}

export default function InputWatchSearch({ text, songs, setFilteredSongs }: InputWatchSearchProps) {
  const fuse = useMemo(() => {
    const options = Array.isArray(songs) && songs.length > 0 && typeof songs[0] === 'string'
      ? { keys: ['item'] }
      : { keys: ['title', 'channelTitle'] };

    const items = Array.isArray(songs) && songs.length > 0 && typeof songs[0] === 'string'
      ? songs.map(item => ({ item }))
      : songs;

    return new Fuse(items, {
      ...options,
      threshold: 0.5,
      distance: 200,
    });
  }, [songs]);

  const formik = useFormik({
    initialValues: {
      query: ''
    },
    onSubmit: () => { },
  });

  useEffect(() => {
    const searchQuery = formik.values.query;

    if (!searchQuery.trim()) {
      setFilteredSongs(songs);
      return;
    }

    const results = fuse.search(searchQuery);
    const filteredItems = results.map(result =>
      typeof songs[0] === 'string' ? result.item.item : result.item
    );
    setFilteredSongs(filteredItems);
  }, [formik.values.query, songs, fuse, setFilteredSongs]);

  return (
    <Box sx={{
      display: 'flex',
      gap: 2,
      p: 1,
      background: 'rgba(20, 20, 20, 0.5)',
      borderWidth: '2px',
      borderColor: 'rgba(30, 30, 30, 0.5)',
      borderRadius: '25px',
      marginBottom: '2rem',
      backdropFilter: 'blur(50px)',
      width: 'fit-content',
      mx: 'auto'
    }}>
      <TextField
        name="query"
        value={formik.values.query}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={text}
        sx={{
          '& .MuiOutlinedInput-root': {
            ...(formik.values.query === '' && {
              '&.Mui-focused fieldset': {
                borderColor: 'red',
                borderWidth: '2px',
                boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)'
              }
            })
          }
        }}
      />
    </Box>
  );
}
