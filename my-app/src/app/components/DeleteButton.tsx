import { Button } from '@mui/material';
import { red } from '@mui/material/colors';
import { useRouter } from 'next/navigation';

const DeleteButton = ({ accountId }: { accountId: number }) => {
  const router = useRouter();

  async function btnDeleteAccount() {
    try {
      const response = await fetch(`/api/account?id=${accountId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete account');
      sessionStorage.clear();
      router.push('/');
      console.log(
        'Deleted acc'
      );

    } catch (error) {
      console.error('Error deleting account:', error);
    }
  }

  return (
    <Button
      variant="contained"
      color="error"
      onClick={btnDeleteAccount}
      sx={{
        transition: 'all 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
        backgroundColor: 'red',
        '&:hover': {
          backgroundColor: red[600],
        },
        '&:active': {
          backgroundColor: red[700],
          boxShadow: '0 0 20px 10px rgba(255, 0, 0, 0.5)',
        }
      }}
    >
      Delete Account
    </Button>
  );
};

export default DeleteButton
