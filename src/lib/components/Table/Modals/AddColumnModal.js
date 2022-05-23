import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useFormik} from 'formik';
import * as Yup from 'yup';
export default function AddColumnModal({
  open,
  setOpen,
  onAddColumnCallback,
}) {
  const formValidationSchema = Yup.object({
    columnName: Yup.string()
      .required('Required')
      .matches(
        /^[a-zA-Z_][a-zA-Z0-9_]*$/,
        'Column name should not contain spaces',
      ),
    dataType: Yup.string().required('Required'),
  });
  const formikForm = useFormik({
    initialValues: {
      columnName: '',
      dataType: '',
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      onAddColumnCallback(values);
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="add-column-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle id="add-column-dialog-title" onClose={handleClose}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Add Column</Typography>
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
        <Grid container>
          <TextField
            fullWidth={true}
            label="Enter new column name"
            name="columnName"
            type="string"
            placeholder="enter a name without spaces"
            error={Boolean(
              formikForm?.errors?.columnName &&
                formikForm?.touched?.columnName,
            )}
            helperText={
              formikForm?.errors?.columnName &&
              formikForm?.touched?.columnName
                ? formikForm?.errors?.columnName
                : null
            }
            {...formikForm.getFieldProps('columnName')}
          />
        </Grid>
        <Box mt={2}>
          <Grid container>
            <FormControl
              fullWidth
              error={
                formikForm?.errors?.dataType &&
                formikForm?.touched?.dataType
              }
            >
              <InputLabel id="dataType">Select Datatype</InputLabel>
              <Select
                labelId="dataType"
                id="dataType"
                fullWidth={true}
                name="dataType"
                {...formikForm.getFieldProps('dataType')}
              >
                <MenuItem value={'NUMBER'}>NUMBER</MenuItem>
                <MenuItem value={'TEXT'}>TEXT</MenuItem>
              </Select>
              <FormHelperText>
                {formikForm?.errors?.dataType &&
                formikForm?.touched?.dataType
                  ? formikForm?.errors?.dataType
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            formikForm.handleSubmit();
          }}
          color="primary"
        >
          Add Column
        </Button>
      </DialogActions>
    </Dialog>
  );
}
