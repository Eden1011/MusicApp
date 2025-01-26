import Button from "@mui/material/Button";

interface OutlinedButtonProps {
  value: string;
  onClick: any;
  height?: number;
  width?: number
}

export default function OutlinedButton({ value, onClick, height = 40, width = 200 }: OutlinedButtonProps) {
  return (
    <Button
      key={`btn-${value[0]}`}
      variant="outlined" onClick={onClick}
      sx={{
        height: height,
        width: width,
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

