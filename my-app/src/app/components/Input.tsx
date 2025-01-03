"use client"
import useAccountApi from '@/hooks/account_api';
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { red } from '@mui/material/colors';

export default function Input() {
  useAccountApi()
  const [query, setQuery] = useState('');
  const [number, setNumber] = useState('');
  const router = useRouter()

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setNumber(value);
  };


  const urlencode = (data: string): string => {
    return encodeURIComponent(data.replace(/ /g, '+'))
  }

  const handleSubmit = () => {
    setQuery(query)
    setNumber(number)
    if (query) router.push(`/search/${urlencode(query)}?maxResults=${number || 5}`)
  };

  return (
    <Box sx={{
      display: 'flex', gap: 2, p: 1,
      background: 'rgba(20, 20, 20, 0.5)',
      borderWidth: '2px',
      borderColor: 'rgba(30, 30, 30, 0.5)',
      borderRadius: '25px',
      marginTop: '1rem',
      backdropFilter: 'blur(50px)',
      alignSelf: 'flex-start',
      width: 'fit-content',
      mx: 'auto'
    }}>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter query"
        sx={{
          '& .MuiOutlinedInput-root': {
            ...(query === '' && {
              '&.Mui-focused fieldset': {
                borderColor: 'red',
                borderWidth: '2px',
                boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)'
              }
            })
          }
        }}
      />
      <TextField
        value={number}
        onChange={handleNumberChange}
        placeholder="Amount"
        sx={{ width: '5.5rem' }}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
          ...(query === '' && {
            backgroundColor: 'red',
            '&:hover': {
              backgroundColor: red[600],
            },
            '&:active': {
              backgroundColor: red[700],
              boxShadow: '0 0 20px 10px rgba(255, 0, 0, 0.5)',
            }
          })
        }}
      >
        Submit
      </Button>
    </Box >
  );
}
