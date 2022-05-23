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

const integrityOption = [
  { key: "Incorrect Values", value: "incorrect" },
  {
    key: "Referential Integrity Violation",
    value: "referential",
  },
];

export default function IntegrityRulesModal({
  open,
  setOpen,
  onIntegrityRulesCallback = () => {},
  datasetList,
  activeDataset,
  column,
  fetchColumnMetaData,
  projectId,
}) {
  const [datasetColumnDetails, setDatasetColumnDetails] =
    React.useState([]);
  const formValidationSchema = Yup.object({
    integrityType: Yup.string().required("Required"),
    incorrectValues: Yup.string().when("integrityType", {
      is: "incorrect",
      then: Yup.string().required("Required"),
    }),
    column2: Yup.string().when("integrityType", {
      is: "referential",
      then: Yup.string().required("Required"),
    }),
    dataSet2: Yup.string().when("integrityType", {
      is: "referential",
      then: Yup.string().required("Required"),
    }),
  });
  const formikForm = useFormik({
    initialValues: {
      integrityType: "",
      incorrectValues: "",
      column1: column.id ? column.id : "",
      column2: "",
      dataset1: activeDataset ? activeDataset : "",
      dataset2: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      if (formikForm.values.integrityType === "incorrect") {
        const incorrectPayload = {
          integrityType: formikForm.values.integrityType,
          incorrect_values:
            formikForm.values.incorrectValues.split(","),
          formParameters: formikForm.values,
        };
        onIntegrityRulesCallback(incorrectPayload);
      } else {
        const referentialPayload = {
          integrityType: formikForm.values.integrityType,
          parent_table: formikForm.values.dataSet1,
          primary_key: formikForm.values.column1,
          base_table: formikForm.values.dataSet2,
          foreign_key: formikForm.values.column2,
          table_name: formikForm.values.dataSet1,
          formParameters: formikForm.values,
        };
        onIntegrityRulesCallback(referentialPayload);
      }
    },
  });
  React.useEffect(() => {
    if (formikForm.values.dataSet2) {
      const payload = {
        table_name: formikForm.values.dataSet2,
        project_id: projectId,
      };
      fetchColumnMetaData(
        payload,
        (res) => {
          setDatasetColumnDetails(res.data);
        },
        null
      );
    }
  }, [formikForm.values.dataSet2]);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="integrity-rules-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="integrity-rules-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Integrity Rules
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
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={formikForm?.errors?.integrityType}
              >
                <InputLabel id="integrityType">
                  Integrity Type
                </InputLabel>
                <Select
                  labelId="integrityType"
                  id="integrityType"
                  fullWidth={true}
                  name="integrityType"
                  {...formikForm.getFieldProps(
                    "integrityType"
                  )}
                >
                  {integrityOption.map((option, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={option.value}
                      >
                        {option.key}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>
                  {formikForm?.errors?.integrityType
                    ? formikForm?.errors?.integrityType
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* ---------------------------- Dropdowns/Fields for integrity type --> incorrect ----------------------- */}
            {formikForm?.values?.integrityType ===
              "incorrect" && (
              <>
                <TextField
                  fullWidth={true}
                  label="Enter Values"
                  placeholder="Enter Incorrect Values (',' seperated) "
                  name="incorrectValues"
                  type="string"
                  error={Boolean(
                    formikForm?.errors?.incorrectValues
                  )}
                  helperText={
                    formikForm?.errors?.incorrectValues
                  }
                  {...formikForm.getFieldProps(
                    "incorrectValues"
                  )}
                />
              </>
            )}
            {/* ---------------------------- Dropdowns for integrity type --> referential ----------------------- */}
            {formikForm?.values?.integrityType ===
              "referential" && (
              <Grid
                container
                item
                xs={12}
                direction="row"
                spacing={2}
              >
                <Grid container item xs={6}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth={true}
                      label="Selected Dataset 1"
                      value={activeDataset}
                      defaultValue={activeDataset}
                      name="dataSet1"
                      type="string"
                      disabled={true}
                      {...formikForm.getFieldProps(
                        "dataSet1"
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth={true}
                      label="Selected Column 1"
                      defaultValue={column.heading}
                      value={column.heading}
                      disabled={true}
                      name="column1"
                      type="string"
                      {...formikForm.getFieldProps(
                        "column1"
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={6}>
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      error={formikForm.errors.dataSet2}
                    >
                      <InputLabel id="dataSet2">
                        {" Select Dataset 2"}
                      </InputLabel>
                      <Select
                        labelId={"dataSet2"}
                        id={"dataSet2"}
                        fullWidth={true}
                        name={"dataSet2"}
                        {...formikForm.getFieldProps(
                          "dataSet2"
                        )}
                      >
                        {datasetList &&
                          datasetList.map((ele, i) => {
                            return (
                              <MenuItem
                                value={ele.Name}
                                key={i}
                              >
                                {ele.Name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <FormHelperText>
                        {formikForm?.errors?.dataSet2
                          ? formikForm?.errors?.dataSet2
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      error={formikForm.errors.column2}
                    >
                      <InputLabel id="column2">
                        {"Select Column 2"}
                      </InputLabel>
                      <Select
                        labelId={"column2"}
                        id={"column2"}
                        fullWidth={true}
                        name={"column2"}
                        {...formikForm.getFieldProps(
                          "column2"
                        )}
                      >
                        {datasetColumnDetails?.length ? (
                          datasetColumnDetails
                            ?.filter((el) => {
                              return (
                                el.column_name !== "pk"
                              );
                            })
                            ?.map((option, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={option.column_name}
                                >
                                  {option.column_name})
                                </MenuItem>
                              );
                            })
                        ) : (
                          <MenuItem disabled value={""}>
                            No columns to select
                          </MenuItem>
                        )}
                      </Select>
                      <FormHelperText>
                        {formikForm?.errors?.column2
                          ? formikForm?.errors?.column2
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
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
