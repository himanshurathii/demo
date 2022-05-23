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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function HighlightMisfieldModal({
  open,
  setOpen,
  applyHighlightMisfield,
  highlightMisfieldFormData,
  setHighlightMisfieldFormData,
}) {
  const formValidationSchema = Yup.object({
    datatype: Yup.string().required("Required"),
  });
  const formikForm = useFormik({
    initialValues: {
      datatype: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      applyHighlightMisfield(true);
      setHighlightMisfieldFormData(values);
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="highlight-misfield-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="highlight-misfield-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Highlight Misfield
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
              error={formikForm?.errors?.datatype}
            >
              <InputLabel id="operationName">
                Select Datatype
              </InputLabel>
              <Select
                labelId="datatype"
                id="datatype"
                fullWidth={true}
                name="datatype"
                {...formikForm.getFieldProps("datatype")}
              >
                <MenuItem value={"alphanumeric"}>
                  Alpha-Numeric
                </MenuItem>
                <MenuItem value={"alphabetical"}>
                  Alphabetical
                </MenuItem>
                <MenuItem value={"numeric"}>
                  Numeric
                </MenuItem>
              </Select>
              <FormHelperText>
                {formikForm?.errors?.datatype
                  ? formikForm?.errors?.datatype
                  : null}
              </FormHelperText>
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
