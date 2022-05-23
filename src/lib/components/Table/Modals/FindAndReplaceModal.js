import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
  DialogActions,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function FindAndReplaceModal({
  open,
  setOpen,
  onFindAndReplaceCallback = () => {},
}) {
  const formValidationSchema = Yup.object({
    oldText: Yup.string().required("Required"),
    newText: Yup.string().required("Required"),
  });
  const formikForm = useFormik({
    initialValues: {
      oldText: "",
      newText: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      onFindAndReplaceCallback(values);
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="find-and-replace-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="find-and-replace-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Find & Replace
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
        <Box my={2}>
          <Grid container>
            <TextField
              fullWidth={true}
              label="Enter Present Text"
              name="oldText"
              type="string"
              error={Boolean(
                formikForm?.errors?.oldText &&
                  formikForm?.touched?.oldText
              )}
              helperText={
                formikForm?.errors?.oldText &&
                formikForm?.touched?.oldText
                  ? formikForm?.errors?.oldText
                  : null
              }
              {...formikForm.getFieldProps("oldText")}
            />
          </Grid>
          <Box mt={1}>
            <Grid container>
              <TextField
                fullWidth={true}
                label="Enter Replacing Text"
                name="newText"
                type="string"
                error={Boolean(
                  formikForm?.errors?.newText &&
                    formikForm?.touched?.newText
                )}
                helperText={
                  formikForm?.errors?.newText &&
                  formikForm?.touched?.newText
                    ? formikForm?.errors?.newText
                    : null
                }
                {...formikForm.getFieldProps("newText")}
              />
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            formikForm.handleSubmit();
          }}
          color="primary"
          autoFocus
        >
          Find & Replace
        </Button>
      </DialogActions>
    </Dialog>
  );
}
