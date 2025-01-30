import useAccountApi from '@/hooks/account_api';
import { Box, TextField, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { red } from '@mui/material/colors';
import { urlencode } from '../../../lib/urlfunctions';
import { useFormik } from 'formik';

export default function Input() {
  useAccountApi();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      query: '',
      number: ''
    },
    onSubmit: (values) => {
      if (values.query) {
        router.push(`/search/${urlencode(values.query)}?maxResults=${values.number || 5}`);
      }
    },
  });

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    formik.setFieldValue('number', value);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 1, sm: 2 },
      p: { xs: 0.5, sm: 1 },
      background: 'rgba(20, 20, 20, 0.5)',
      borderWidth: { xs: '1px', sm: '2px' },
      borderColor: 'rgba(30, 30, 30, 0.5)',
      borderRadius: { xs: '15px', sm: '25px' },
      marginTop: { xs: '0.5rem', sm: '1rem' },
      backdropFilter: 'blur(50px)',
      width: { xs: '95%', sm: 'fit-content' },
      mx: 'auto'
    }}>
      <TextField
        fullWidth
        name="query"
        value={formik.values.query}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Enter query"
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
      <TextField
        name="number"
        value={formik.values.number}
        onChange={handleNumberChange}
        onBlur={formik.handleBlur}
        placeholder="Amount"
        sx={{
          width: { xs: '100%', sm: '5.5rem' },
          minWidth: '6rem'
        }}
      />
      <Button
        fullWidth
        variant="contained"
        onClick={() => formik.handleSubmit()}
        sx={{
          transition: 'all 0.3s ease-in-out',
          height: { xs: '40px', sm: 'auto' },
          ...(formik.values.query === '' && {
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
    </Box>
  );
}
