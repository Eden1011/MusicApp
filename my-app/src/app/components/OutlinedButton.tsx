import Button from "@mui/material/Button";

interface OutlinedButtonProps {
  value: string;
  onClick: any;
}

export default function OutlinedButton({ value, onClick }: OutlinedButtonProps) {
  return (
    <Button variant="outlined" onClick={onClick}
      sx={{
        transition: 'all 0.5s ease-in',
        '&:hover': {
          backgroundColor: 'transparent',
          color: 'white',

        },
        '&:active': {
          color: 'white',
          boxShadow: 'none',
          backgroundColor: 'transparent',
          borderColor: 'transparent'
        }
      }}
    >
      {value}
    </Button>
  );
}

