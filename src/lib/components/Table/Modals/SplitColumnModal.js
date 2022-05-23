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

export default function SplitColumnModal({
  open,
  setOpen,
  onSplitColumnCallback = () => {},
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
      onSplitColumnCallback(values);
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="split-column-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="split-column-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Split Column</Typography>
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
              error={formikForm?.errors?.operationName}
            >
              <InputLabel id="operationName">
                Select Delimiter
              </InputLabel>
              <Select
                labelId="delimiter"
                id="delimiter"
                fullWidth={true}
                name="delimiter"
                {...formikForm.getFieldProps("delimiter")}
              >
                <MenuItem value={" "}>Space</MenuItem>
                <MenuItem value={","}>Comma</MenuItem>
                <MenuItem value={";"}>Semicolon</MenuItem>
                <MenuItem value={"@"}>At</MenuItem>
              </Select>
              <FormHelperText>
                {formikForm?.errors?.delimiter
                  ? formikForm?.errors?.delimiter
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
          Split Column
        </Button>
      </DialogActions>
    </Dialog>
  );
}
