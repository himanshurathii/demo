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
  FormControl,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function EmbeddedValuesModal({
  open,
  setOpen,
  onEmbeddedValuesCallback = () => {},
}) {
  const formValidationSchema = Yup.object({
    delimiter: Yup.string().required("Required"),
  });
  const formikForm = useFormik({
    initialValues: {
      delimiter: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      onEmbeddedValuesCallback(values);
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="embedded-values-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="embedded-values-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Embedded Values
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
              label="Enter Delimiter"
              name="delimiter"
              type="string"
              placeholder="Example:{} , ' ' ; | / \ "
              inputProps={{
                maxLength: 1,
              }}
              error={Boolean(formikForm?.errors?.delimiter)}
              helperText={formikForm?.errors?.delimiter}
              {...formikForm.getFieldProps("delimiter")}
            />
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
