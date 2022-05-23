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

export default function SortColumnModal({
  open,
  setOpen,
  onSortColumnCallback = () => {},
}) {
  const formValidationSchema = Yup.object({
    order: Yup.string().required("Required"),
  });
  const formikForm = useFormik({
    initialValues: {
      order: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      onSortColumnCallback(values);
    },
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="sort-column-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="sort-column-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Sort Column</Typography>
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
                Select Order
              </InputLabel>
              <Select
                labelId="order"
                id="order"
                fullWidth={true}
                name="order"
                {...formikForm.getFieldProps("order")}
              >
                <MenuItem value={"asc"}>Ascending</MenuItem>
                <MenuItem value={"desc"}>Descending</MenuItem>
              </Select>
              <FormHelperText>
                {formikForm?.errors?.order
                  ? formikForm?.errors?.order
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
          Sort Column
        </Button>
      </DialogActions>
    </Dialog>
  );
}
