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
  MenuItem,
  FormHelperText,
  Select,
  InputLabel,
  TextField,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function HighlightIllegalValuesModal({
  open,
  setOpen,
  applyHighlightIllegalValues,
  highlightIllegalValuesFormData,
  setHighlightIllegalValuesFormData,
}) {
  const formValidationSchema = Yup.object({
    lowerLimit: Yup.string().required("Required"),
    upperLimit: Yup.string().required("Required"),
  });
  const formikForm = useFormik({
    initialValues: {
      lowerLimit: "",
      upperLimit: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      applyHighlightIllegalValues(true);
      setHighlightIllegalValuesFormData(values);
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="illegal-values-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="illegal-values-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Highlight Illegal Values
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
            <FormControl
              fullWidth
              error={formikForm?.errors?.lowerLimit}
            >
              <TextField
                fullWidth={true}
                label="Enter lower limit"
                name="lowerLimit"
                type="string"
                error={Boolean(
                  formikForm?.errors?.lowerLimit
                )}
                helperText={formikForm?.errors?.lowerLimit}
                {...formikForm.getFieldProps("lowerLimit")}
              />
            </FormControl>
            <FormControl
              fullWidth
              error={formikForm?.errors?.upperLimit}
            >
              <TextField
                fullWidth={true}
                label="Enter upper limit"
                name="upperLimit"
                type="string"
                error={Boolean(
                  formikForm?.errors?.upperLimit
                )}
                helperText={formikForm?.errors?.upperLimit}
                {...formikForm.getFieldProps("upperLimit")}
              />
            </FormControl>
          </Grid>
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
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
