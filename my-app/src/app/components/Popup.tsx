import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface PopupProps {
  message: string;
  open: boolean;
  onClose: () => void;
  severity?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const Popup: React.FC<PopupProps> = ({
  message,
  open,
  onClose,
  severity = 'info',
  duration = 3000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Popup;
