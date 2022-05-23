import React from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
export default function DuplicateColumnModal({
  open,
  setOpen,
  onDuplicateCallback = () => {},
}) {
  const formValidationSchema = Yup.object({
    newColumnName: Yup.string()
      .required("Required")
      .matches(
        /^[a-zA-Z_][a-zA-Z0-9_]*$/,
        "Column name should not contain spaces"
      ),
  });
  const formikForm = useFormik({
    initialValues: {
      newColumnName: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      onDuplicateCallback(values);
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="column-duplicate-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="column-duplicate-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Duplicate Column
          </Typography>
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
            name="newColumnName"
            type="string"
            placeholder="Enter a New Column without spaces"
            error={Boolean(
              formikForm?.errors?.newColumnName
            )}
            helperText={formikForm?.errors?.newColumnName}
            {...formikForm.getFieldProps("newColumnName")}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            formikForm.handleSubmit();
          }}
          color="primary"
        >
          Duplicate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
