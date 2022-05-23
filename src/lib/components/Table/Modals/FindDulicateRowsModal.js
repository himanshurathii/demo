import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
export default function FindDuplicateRowsModal({
  open,
  setOpen,
  onFindDulicateRowsCallback = () => {},
  row,
}) {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="find-duplicate-rows-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle id="find-duplicate-rows-dialog-title">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Find Duplicate Rows</Typography>
          <IconButton
            color="primary"
            aria-label="close"
            onClick={() => {
              handleClose();
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          {`Find duplicate rows for row id "${
            parseInt(row?.id) + 1
          }"?`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          No
        </Button>
        <Button
          onClick={() => {
            handleClose();
            onFindDulicateRowsCallback();
          }}
          color="primary"
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
