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

export default function HighlightWithRegexModal({
  open,
  setOpen,
  applyHighlightWithRegex,
  highlightWithRegexFormData,
  setHighlightWithRegexFormData,
}) {
  const formValidationSchema = Yup.object({
    regex: Yup.string().required("Required"),
  });
  const formikForm = useFormik({
    initialValues: {
      regex: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      applyHighlightWithRegex(true);
      setHighlightWithRegexFormData(values);
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="highlight-regex-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="highlight-regex-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Highlight with Regex
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
              error={formikForm?.errors?.regex}
            >
              <TextField
                fullWidth={true}
                label="Enter regex"
                name="regex"
                type="string"
                error={Boolean(formikForm?.errors?.regex)}
                helperText={formikForm?.errors?.regex}
                {...formikForm.getFieldProps("regex")}
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
