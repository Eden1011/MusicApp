"use client"
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';

export default function Input() {
  const [query, setQuery] = useState('');
  const [number, setNumber] = useState('');

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setNumber(value);
  };

  const handleSubmit = () => {
    console.log('Query:', query);
    console.log('Number:', number);
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
    }}>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter query"
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
      >
        Submit
      </Button>
    </Box >
  );
}
