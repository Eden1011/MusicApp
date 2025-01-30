import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useFormik } from 'formik';
import OutlinedButton from './OutlinedButton';

const PlaylistDialog = ({
  open,
  onClose,
  onCreatePlaylist
}: {
  open: boolean;
  onClose: () => void;
  onCreatePlaylist: (name: string) => void;
}) => {
  const formik = useFormik({
    initialValues: {
      name: ''
    },
    onSubmit: (values) => {
      onCreatePlaylist(values.name);
      formik.resetForm();
    }
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Playlist</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Playlist Name"
          fullWidth
          variant="standard"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{
            '&:active': {
              boxShadow: 'none',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '0',
              backgroundColor: 'transparent',
              '&.Mui-focused': {
                '& fieldset': {
                  borderWidth: '0',
                  borderColor: 'transparent'
                }
              }
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <OutlinedButton value='Cancel' onClick={onClose} />
        <OutlinedButton
          value='Create'
          onClick={() => formik.handleSubmit()}
        />
      </DialogActions>
    </Dialog>
  );
};

export default PlaylistDialog;
