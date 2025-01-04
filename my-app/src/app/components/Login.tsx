"use client"
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { red } from '@mui/material/colors';
import BoxYoutubeError from './BoxYoutubeError';

export default function Login() {
  const [err, setErr] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('')
  const [api_key, setApi_key] = useState('');
  const router = useRouter()

  const signup = async () => {
    const response = await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application-json' },
      body: JSON.stringify({
        name,
        email,
        password,
        api_key
      })
    })
    const data = await response.json()
    if (data.newAccount) {
      console.log('Account created');
      sessionStorage.setItem('account_id', data.newAccount.id);
      sessionStorage.setItem('account_email', email);
      router.push('/search')
    } else setErr("Could not sign up - account exists.")
  }


  const login = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
      console.log('Logged in successfully');
      sessionStorage.setItem('account_id', data.account_id);
      sessionStorage.setItem('account_email', email);
      router.push('/search')
    }
    else setErr("Could not find account")
  }

  const handleAction = async () => {
    if (email && password && name && api_key) {
      await signup()
    } else {
      await login()
    }
  };

  return (
    <>
      {err ? (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <BoxYoutubeError data={{ error: { message: err } }} />
        </div>
      ) : ''}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '20px'
      }}>

        <p className='italic text-gray-500 font-bold'>Log in:</p>
        <TextField
          placeholder="Email (*)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              ...(email === '' && {
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
          placeholder="Password (*)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              ...(password === '' && {
                '&.Mui-focused fieldset': {
                  borderColor: 'red',
                  borderWidth: '2px',
                  boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)'
                }
              })
            }
          }}
        />


        <p className='mt-1 italic text-gray-500 font-bold'>Sign up:</p>
        <TextField
          placeholder="Name (?)"
          type="username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          placeholder="API Key (?)"
          type="password"
          value={api_key}
          onChange={(e) => setApi_key(e.target.value)}
        />
        <Button variant='contained' onClick={handleAction}
          sx={{
            transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
            ...((email === '' || password === '') && {
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
          Proceed
        </Button>
      </div >

    </>
  );
}
