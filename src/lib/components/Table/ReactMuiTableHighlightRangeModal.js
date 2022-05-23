import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Checkbox,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import _ from "lodash";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function ReactMuiTableHighlightRangeModal({
  columns,
  openRangeModal,
  setOpenRangeModal,
  applyHighlightRange,
  highlightRangeFormData,
  setHighlightRangeFormData,
}) {
  const classes = useStyles();
  const [
    datasetContainsNumericalValues,
    setDatasetContainsNumericalValues,
  ] = useState(false);

  useEffect(() => {
    setDatasetContainsNumericalValues(
      Boolean(
        columns.filter((col) => {
          return (
            col.data_type !== "text" &&
            col.data_type !== "boolean" &&
            col.column_name !== "pk"
          );
        }).length
      )
    );
  }, [columns]);

  const [conditionFlags, setConditionFlags] = useState({
    equalsToSwitch: false,
    greaterThanSwitch: false,
    lessThanSwitch: false,
  });

  const initialValues = {
    columnName: "Apply to All Columns",
    equalsTo: "",
    greaterThan: "",
    lessThan: "",
    operator1: "",
    operator2: "",
  };

  const handleSwitch = (event) => {
    setConditionFlags({
      ...conditionFlags,
      [event.target.name]: event.target.checked,
    });
  };

  const formValidationSchema = React.useMemo(
    () =>
      Yup.object({
        columnName: Yup.string().required("Required"),
        equalsTo: conditionFlags.equalsToSwitch
          ? Yup.number().required("Enter validation number")
          : Yup.number(),
        greaterThan: conditionFlags.greaterThanSwitch
          ? Yup.number().required("Enter validation number")
          : Yup.number(),
        lessThan: conditionFlags.lessThanSwitch
          ? Yup.number().required("Enter validation number")
          : Yup.number(),
        operator1:
          conditionFlags.greaterThanSwitch &&
          conditionFlags.equalsToSwitch
            ? Yup.string().required("Select an operator")
            : Yup.string(),
        operator2:
          conditionFlags.lessThanSwitch &&
          conditionFlags.greaterThanSwitch
            ? Yup.string().required("Select an operator")
            : Yup.string(),
      }),
    [conditionFlags]
  );

  const formikForm = useFormik({
    initialValues: initialValues,
    validationSchema: formValidationSchema,
    enableReinitialize: true,
    onSubmit: () => {
      if (
        formikForm.values.equalsTo !== "" ||
        formikForm.values.greaterThan !== "" ||
        formikForm.values.lessThan !== ""
      ) {
        applyHighlightRange(true);
        setHighlightRangeFormData({
          ...highlightRangeFormData,
          [formikForm.values.columnName]: {
            equalsTo: formikForm.values.equalsTo,
            greaterThan: formikForm.values.greaterThan,
            lessThan: formikForm.values.lessThan,
            operator1: formikForm.values.operator1,
            operator2: formikForm.values.operator2,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (
      formikForm.values.equalsTo !== "" ||
      formikForm.values.greaterThan !== "" ||
      formikForm.values.lessThan !== ""
    ) {
      if (!conditionFlags.equalsToSwitch) {
        formikForm.setFieldValue("equalsTo", "");
        setHighlightRangeFormData({
          ...highlightRangeFormData,
          [formikForm.values.columnName]: {
            equalsTo: "",
            greaterThan: formikForm.values.greaterThan,
            lessThan: formikForm.values.lessThan,
            operator1: "",
            operator2: formikForm.values.operator2,
          },
        });
      }
      if (!conditionFlags.greaterThanSwitch) {
        formikForm.setFieldValue("greaterThan", "");
        setHighlightRangeFormData({
          ...highlightRangeFormData,
          [formikForm.values.columnName]: {
            equalsTo: formikForm.values.equalsTo,
            greaterThan: "",
            lessThan: formikForm.values.lessThan,
            operator1: "",
            operator2: "",
          },
        });
      }
      if (!conditionFlags.lessThanSwitch) {
        formikForm.setFieldValue("lessThan", "");
        setHighlightRangeFormData({
          ...highlightRangeFormData,
          [formikForm.values.columnName]: {
            equalsTo: formikForm.values.equalsTo,
            greaterThan: formikForm.values.greaterThan,
            lessThan: "",
            operator1: conditionFlags.equalsToSwitch
              ? formikForm.values.operator1
              : "",
            operator2: "",
          },
        });
      }
    }
  }, [conditionFlags]);

  const handleChipDelete = (chipToDelete) => () => {
    const filteredTasks = { ...highlightRangeFormData };
    delete filteredTasks[chipToDelete];
    setHighlightRangeFormData(filteredTasks);
  };

  const handleClose = () => {
    setOpenRangeModal(false);
  };

  return (
    <Dialog
      open={openRangeModal}
      onClose={handleClose}
      aria-labelledby="range-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        disableTypography
        id="range-dialog-title"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Highlight Range
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
        {datasetContainsNumericalValues ? (
          <>
            <Box p={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth={true}>
                    <InputLabel id="select-column">
                      Column
                    </InputLabel>
                    <Select
                      autoWidth={true}
                      labelId="select-column"
                      id="simple-column"
                      name="columnName"
                      {...formikForm.getFieldProps(
                        "columnName"
                      )}
                      onChange={(event) => {
                        formikForm.handleChange(event);
                        setConditionFlags({
                          equalsToSwitch: false,
                          greaterThanSwitch: false,
                          lessThanSwitch: false,
                        });

                        formikForm.setFieldValue(
                          "equalsTo",
                          highlightRangeFormData?.[
                            event.target.value
                          ]?.equalsTo
                            ? highlightRangeFormData?.[
                                event.target.value
                              ]?.equalsTo
                            : ""
                        );
                        formikForm.setFieldValue(
                          "greaterThan",
                          highlightRangeFormData?.[
                            event.target.value
                          ]?.greaterThan
                            ? highlightRangeFormData?.[
                                event.target.value
                              ]?.greaterThan
                            : ""
                        );
                        formikForm.setFieldValue(
                          "lessThan",
                          highlightRangeFormData?.[
                            event.target.value
                          ]?.lessThan
                            ? highlightRangeFormData?.[
                                event.target.value
                              ]?.lessThan
                            : ""
                        );
                      }}
                      defaultValue={"Apply to All Columns"}
                      error={formikForm?.errors?.columnName}
                      helperText={
                        formikForm?.errors?.columnName
                      }
                    >
                      <MenuItem value="Apply to All Columns">
                        Apply to All Columns
                      </MenuItem>
                      {columns
                        ?.filter(
                          (ele) =>
                            !ele.data_type.includes(
                              "text"
                            ) &&
                            !ele.data_type.includes(
                              "boolean"
                            ) &&
                            !ele.column_name.includes("pk")
                        )
                        ?.map((col, i) => {
                          return (
                            <MenuItem
                              key={i}
                              value={col.column_name}
                            >
                              {col.column_name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={10}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    width="100%"
                    alignItems="center"
                    mt={1}
                  >
                    <Checkbox
                      checked={
                        conditionFlags.equalsToSwitch
                      }
                      onChange={handleSwitch}
                      name="equalsToSwitch"
                      inputProps={{
                        "aria-label": "secondary checkbox",
                      }}
                    />
                    <TextField
                      fullWidth={true}
                      label="Equals to"
                      name="equalsTo"
                      type="number"
                      {...formikForm.getFieldProps(
                        "equalsTo"
                      )}
                      disabled={
                        !conditionFlags.equalsToSwitch
                      }
                      placeholder="enter a numeric value"
                      error={formikForm?.errors?.equalsTo}
                      helperText={
                        formikForm?.errors?.equalsTo
                      }
                    />
                  </Box>
                </Grid>
                <Box width="100%" ml={7} mb={1}>
                  <Grid item xs={8}>
                    <FormControl fullWidth={true}>
                      <InputLabel id="operator-1">
                        Operator
                      </InputLabel>
                      <Select
                        autoWidth={true}
                        labelId="Operator1"
                        id="Operator1"
                        name="operator1"
                        {...formikForm.getFieldProps(
                          "operator1"
                        )}
                        disabled={
                          !conditionFlags.equalsToSwitch
                            ? true
                            : !conditionFlags.greaterThanSwitch
                            ? true
                            : false
                        }
                        defaultValue={"||"}
                        error={
                          formikForm?.errors?.operator1
                        }
                        helperText={
                          formikForm?.errors?.operator1
                        }
                      >
                        <MenuItem key={"or"} value={"||"}>
                          OR
                        </MenuItem>
                        <MenuItem key={"and"} value={"&&"}>
                          AND
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Box>
                <Grid item xs={10}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    width="100%"
                    alignItems="center"
                  >
                    <Checkbox
                      checked={
                        conditionFlags.greaterThanSwitch
                      }
                      onChange={handleSwitch}
                      name="greaterThanSwitch"
                      inputProps={{
                        "aria-label": "secondary checkbox",
                      }}
                    />

                    <TextField
                      fullWidth={true}
                      label="Greater Than"
                      name="greaterThan"
                      type="number"
                      {...formikForm.getFieldProps(
                        "greaterThan"
                      )}
                      disabled={
                        !conditionFlags.greaterThanSwitch
                      }
                      placeholder="enter a numeric value"
                      error={
                        formikForm?.errors?.greaterThan
                      }
                      helperText={
                        formikForm?.errors?.greaterThan
                      }
                    />
                  </Box>
                </Grid>
                <Box width="100%" ml={7} mb={1}>
                  <Grid item xs={8}>
                    <FormControl fullWidth={true}>
                      <InputLabel id="operator-2">
                        Operator
                      </InputLabel>
                      <Select
                        autoWidth={true}
                        labelId="Operator2"
                        id="Operator2"
                        name="operator2"
                        {...formikForm.getFieldProps(
                          "operator2"
                        )}
                        defaultValue={"||"}
                        disabled={
                          !conditionFlags.lessThanSwitch
                            ? true
                            : !conditionFlags.equalsToSwitch &&
                              !conditionFlags.greaterThanSwitch
                            ? true
                            : false
                        }
                        error={
                          formikForm?.errors?.operator2
                        }
                        helperText={
                          formikForm?.errors?.operator2
                        }
                      >
                        <MenuItem key={"or"} value={"||"}>
                          OR
                        </MenuItem>
                        <MenuItem key={"and"} value={"&&"}>
                          AND
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Box>
                <Grid item xs={10}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    width="100%"
                    alignItems="center"
                  >
                    <Checkbox
                      checked={
                        conditionFlags.lessThanSwitch
                      }
                      onChange={handleSwitch}
                      name="lessThanSwitch"
                      inputProps={{
                        "aria-label": "secondary checkbox",
                      }}
                    />
                    <TextField
                      fullWidth={true}
                      label="Less Than"
                      name="lessThan"
                      {...formikForm.getFieldProps(
                        "lessThan"
                      )}
                      type="number"
                      disabled={
                        !conditionFlags.lessThanSwitch
                      }
                      placeholder="enter a numeric value"
                      error={formikForm?.errors?.lessThan}
                      helperText={
                        formikForm?.errors?.lessThan
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box>
              {Object.keys(highlightRangeFormData)?.map(
                (col, i) => {
                  if (
                    !_.isEmpty(highlightRangeFormData[col])
                  ) {
                    return (
                      <li
                        style={{ listStyle: "none" }}
                        key={i}
                      >
                        <Chip
                          color={"primary"}
                          variant="outlined"
                          size="small"
                          label={
                            <ChipLabel
                              highlightRangeFormData={
                                highlightRangeFormData
                              }
                              col={col}
                              operator={
                                formikForm.values.operator
                              }
                            />
                          }
                          onDelete={handleChipDelete(col)}
                          className={classes.chip}
                        />
                      </li>
                    );
                  } else {
                    return null;
                  }
                }
              )}
            </Box>
          </>
        ) : (
          <Typography color="error">
            Selected dataset doesn't contain any numerical
            values
          </Typography>
        )}
      </DialogContent>
      {datasetContainsNumericalValues ? (
        <DialogActions>
          <Button
            onClick={() => {
              setConditionFlags({
                equalsToSwitch: false,
                greaterThanSwitch: false,
                lessThanSwitch: false,
              });
              setHighlightRangeFormData([]);
              formikForm.resetForm();
            }}
            variant="outlined"
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            onClick={() => {
              formikForm.handleSubmit();
            }}
          >
            Apply
          </Button>
        </DialogActions>
      ) : null}
    </Dialog>
  );
}

const ChipLabel = ({
  highlightRangeFormData,
  col,
  operator,
}) => {
  return (
    <div>
      <strong>{col ? col : "Apply to All Columns"}</strong>:
      {"  "}
      {highlightRangeFormData[col]?.equalsTo &&
        `Equals to : ${highlightRangeFormData[col]?.equalsTo}  `}
      {highlightRangeFormData[col]?.greaterThan &&
        `Greater Than : ${highlightRangeFormData[col]?.greaterThan}  `}
      {highlightRangeFormData[col]?.lessThan &&
        `Less Than : ${highlightRangeFormData[col]?.lessThan}  `}
    </div>
  );
};
