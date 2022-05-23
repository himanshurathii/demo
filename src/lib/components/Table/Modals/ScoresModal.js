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
  Slider,
  FormGroup,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 40,
    label: "40",
  },
  {
    value: 60,
    label: "60",
  },
  {
    value: 80,
    label: "80",
  },

  {
    value: 100,
    label: "100",
  },
];

export default function ScoresModal({
  open,
  setOpen,
  onScoresCallback = () => {},
  columns,
  columnMetaData,
}) {
  const [rsspdsSliderValues, setRsspdsSliderValues] =
    React.useState({});

  React.useEffect(() => {
    setRsspdsSliderValues(
      columnMetaData
        ?.filter((data) => {
          return data.column_name !== "pk";
        })
        .reduce((obj, key) => {
          obj[key.column_name] = 0;
          return obj;
        }, {})
    );
  }, [columnMetaData]);

  const formValidationSchema = Yup.object({
    selectedOperation: Yup.string().required("Required"),
  });
  const formikForm = useFormik({
    initialValues: {
      selectedOperation: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      if (
        formikForm.values.selectedOperation === "rsspds"
      ) {
        const rsspdsPayload = {
          selectedOperation: "rsspds",
          scores: rsspdsSliderValues,
        };
        onScoresCallback(rsspdsPayload);
      } else {
        const dfcsPayload = {
          selectedOperation: "dfcs",
        };
        onScoresCallback(dfcsPayload);
      }
    },
  });

  const handleSliderChange = (data) => (e, value) => {
    const name = data;
    setRsspdsSliderValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onDragStop = () => {};

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="scores-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="scores-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Scores</Typography>
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
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={
                  formikForm?.errors?.selectedOperation
                }
              >
                <InputLabel id="selectedOperation">
                  Select Operation
                </InputLabel>
                <Select
                  labelId="selectedOperation"
                  id="selectedOperation"
                  fullWidth={true}
                  name="selectedOperation"
                  {...formikForm.getFieldProps(
                    "selectedOperation"
                  )}
                >
                  <MenuItem value={"rsspds"}>
                    Calculate RSS and PDS
                  </MenuItem>
                  <MenuItem value={"dfcs"}>
                    Calculate DFCS
                  </MenuItem>
                </Select>
                <FormHelperText>
                  {formikForm?.errors?.selectedOperation
                    ? formikForm?.errors?.selectedOperation
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {formikForm.values.selectedOperation ===
              "rsspds" && (
              <Grid item xs={12}>
                <Box mt={1}>
                  {columnMetaData
                    ?.filter((data) => {
                      return data.column_name !== "pk";
                    })
                    .map((ele, index) => {
                      return (
                        <FormGroup key={index}>
                          <FormLabel>
                            {ele["column_name"]} : (
                            {ele["data_type"]})
                          </FormLabel>
                          <Slider
                            defaultValue={0}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks={marks}
                            onChange={handleSliderChange(
                              ele.column_name
                            )}
                            onChangeCommitted={onDragStop(
                              ele
                            )}
                            min={0}
                            max={100}
                          />
                        </FormGroup>
                      );
                    })}
                </Box>
              </Grid>
            )}
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
