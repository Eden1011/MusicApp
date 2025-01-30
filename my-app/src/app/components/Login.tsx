"use client"
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { red } from '@mui/material/colors';
import BoxYoutubeError from './BoxYoutubeError';
import { useFormik } from 'formik';

export default function Login() {
  const [err, setErr] = useState('');
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      api_key: ''
    },
    onSubmit: async (values) => {
      if (values.email && values.password && values.name && values.api_key) {
        const response = await fetch('/api/account', {
          method: 'POST',
          headers: { 'Content-Type': 'application-json' },
          body: JSON.stringify(values)
        });
        const data = await response.json();
        if (data.newAccount) {
          sessionStorage.setItem('account_id', data.newAccount.id);
          sessionStorage.setItem('account_email', values.email);
          router.push('/search');
        } else {
          setErr("Could not sign up - account exists.");
        }
      } else {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password
          }),
        });
        const data = await response.json();
        if (data.success) {
          sessionStorage.setItem('account_id', data.account_id);
          sessionStorage.setItem('account_email', values.email);
          router.push('/search');
        } else {
          setErr("Could not find account");
        }
      }
    }
  });

  return (
    <>
      {err && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <BoxYoutubeError data={{ error: { message: err } }} />
        </div>
      )}
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
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{
            '& .MuiOutlinedInput-root': {
              ...(formik.values.email === '' && {
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
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{
            '& .MuiOutlinedInput-root': {
              ...(formik.values.password === '' && {
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
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <TextField
          placeholder="API Key (?)"
          type="password"
          name="api_key"
          value={formik.values.api_key}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <Button
          variant='contained'
          onClick={() => formik.handleSubmit()}
          sx={{
            transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
            ...((formik.values.email === '' || formik.values.password === '') && {
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
      </div>
    </>
  );
}
