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

export default function ManageSpacesModal({
  open,
  setOpen,
  onManageSpacesCallback = () => {},
}) {
  const formValidationSchema = Yup.object({
    operationName: Yup.string().required("Required"),
  });
  const formikForm = useFormik({
    initialValues: {
      operationName: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      onManageSpacesCallback(values);
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="manage-spaces-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="manage-spaces-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Manage Spaces
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
              error={formikForm?.errors?.operationName}
            >
              <InputLabel id="operationName">
                Select Operation
              </InputLabel>
              <Select
                labelId="operationName"
                id="operationName"
                fullWidth={true}
                name="operationName"
                {...formikForm.getFieldProps(
                  "operationName"
                )}
              >
                <MenuItem value={"begin"}>Begin</MenuItem>
                <MenuItem value={"middle"}>Middle</MenuItem>
                <MenuItem value={"end"}>End</MenuItem>
              </Select>
              <FormHelperText>
                {formikForm?.errors?.operationName
                  ? formikForm?.errors?.operationName
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
          Manage Spaces
        </Button>
      </DialogActions>
    </Dialog>
  );
}
