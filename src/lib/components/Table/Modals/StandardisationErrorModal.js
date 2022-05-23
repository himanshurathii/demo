import React from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useFormik} from 'formik';
import * as Yup from 'yup';

const formatOptions = [
  {key: 'Date', value: 'date'},
  {key: 'Email', value: 'email'},
  {key: 'Currency', value: 'currency'},
];
const subFormatOptions = [
  {key: 'MM', value: 1},
  {key: 'YYYY', value: 2},
  {key: 'DD-MM', value: 3},
  {key: 'DD-MM-YYYY', value: 5},
  {key: 'MM-YYYY', value: 4},
  {key: 'YYYY-MM-DD', value: 6},
  {key: 'hh:mm:ss', value: 7},
  {key: 'DD-MM-YYYY hh:mm:ss', value: 8},
  {key: 'YYYY-MM-DD hh:mm:ss', value: 9},
  {key: 'YYYY-MM-DD hh:mm:ss:ms', value: 10},
  {key: 'YYYY Q', value: 11},
];

const unitOptions = [
  {key: 'Volume', value: 'volume'},
  {key: 'Distance', value: 'distance'},
  {key: 'Time', value: 'time'},
];

const volumeOption = [
  {key: 'ml', value: 'ml'},
  {key: 'liter', value: 'l'},
  {key: 'meter cube', value: 'm3'},
  {key: 'gallon', value: 'gallon'},
  {key: 'teaspoon', value: 'teaspoon'},
  {key: 'table spoon', value: 'tablespoon'},
];

const distanceOption = [
  {key: 'mm', value: 'mm'},
  {key: 'cm', value: 'cm'},
  {key: 'm', value: 'm'},
  {key: 'km', value: 'km'},
  {key: 'mile', value: 'mile'},
  {key: 'inch', value: 'inch'},
  {key: 'foot', value: 'foot'},
  {key: 'yards', value: 'yards'},
];

const timeOption = [
  {key: 'sec', value: 'sec'},
  {key: 'min', value: 'min'},
  {key: 'hr', value: 'hr'},
];

export default function StandardisationErrorModal({
  open,
  setOpen,
  onStandardisationErrorCallback = () => {},
}) {
  const [currentUnitOptions, setCurrentUnitOptions] = React.useState(
    [],
  );

  const formValidationSchema = Yup.object({
    valueError: Yup.string().required('Required'),
    formatType: Yup.string().when('valueError', {
      is: 'formats',
      then: Yup.string().required('Required'),
    }),
    unitType: Yup.string().when('valueError', {
      is: 'units',
      then: Yup.string().required('Required'),
    }),
    dateType: Yup.string().when('formatType', {
      is: 'date',
      then: Yup.string().required('Required'),
    }),
    conversionRate: Yup.string().when('formatType', {
      is: 'currency',
      then: Yup.string().required('Required'),
    }),
    convertingFrom: Yup.string().when('valueError', {
      is: 'units',
      then: Yup.string().required('Required'),
    }),
    convertingTo: Yup.string().when('valueError', {
      is: 'units',
      then: Yup.string().required('Required'),
    }),
    newColumnNameFormats: Yup.string().when('formatType', {
      is: 'currency',
      then: Yup.string()
        .max(59, 'New column name must be under 59 characters')
        .matches(
          /^[a-zA-Z_][a-zA-Z0-9_]*$/,
          'must not contain spaces,special characters except (_) and should not start with a number',
        )
        .required('Required'),
    }),
    newColumnNameUnits: Yup.string().when('valueError', {
      is: 'units',
      then: Yup.string()
        .max(59, 'New column name must be under 59 characters')
        .matches(
          /^[a-zA-Z_][a-zA-Z0-9_]*$/,
          'must not contain spaces,special characters except (_) and should not start with a number',
        )
        .required('Required'),
    }),
  });
  const formikForm = useFormik({
    initialValues: {
      valueError: '',
      formatType: '',
      unitType: '',
      conversionRate: '',
      convertingFrom: '',
      convertingTo: '',
      newColumnName: '',
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      handleClose();
      // for standardisation formats
      if (formikForm.values.valueError === 'formats') {
        if (formikForm.values.formatType === 'currency') {
          const currencyPayload = {
            valueError: formikForm.values.valueError,
            formatType: formikForm.values.formatType,
            conversion_rate: Number(formikForm.values.conversionRate),
            new_column_name: formikForm.values.newColumnNameFormats,
          };
          onStandardisationErrorCallback(currencyPayload);
        } else if (formikForm.values.formatType === 'date') {
          const datePayload = {
            valueError: formikForm.values.valueError,
            formatType: formikForm.values.formatType,
            format: formikForm.values.dateType,
          };
          onStandardisationErrorCallback(datePayload);
        } else {
          const commonPayload = {
            valueError: formikForm.values.valueError,
            formatType: formikForm.values.formatType,
          };
          onStandardisationErrorCallback(commonPayload);
        }
      } // for standardisation units
      else {
        const unitsPayload = {
          valueError: formikForm.values.valueError,
          unit_type: formikForm.values.unitType,
          converting_from: formikForm.values.convertingFrom,
          converting_to: formikForm.values.convertingTo,
          new_column_name: formikForm.values.newColumnNameUnits,
          primary_key: 'pk',
        };

        onStandardisationErrorCallback(unitsPayload);
      }
    },
  });
  const handleClose = () => {
    setOpen(false);
  };

  const renderUnits = (unit) => {
    switch (unit) {
      case 'volume':
        setCurrentUnitOptions(volumeOption);
        break;
      case 'distance':
        setCurrentUnitOptions(distanceOption);
        break;
      case 'time':
        setCurrentUnitOptions(timeOption);
        break;
      default:
        setCurrentUnitOptions([]);
        break;
    }
  };

  React.useEffect(() => {
    renderUnits(formikForm?.values?.unitType);
    if (formikForm.values.valueError === 'formats') {
      formikForm.setFieldValue('unitType', '');
    }
    if (formikForm.values.valueError === 'units') {
      formikForm.setFieldValue('formatType', '');
    }
  }, [formikForm.values]);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="standardisation-error-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle
        id="standardisation-error-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Standardisation Error</Typography>
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
            {/* -------------------- Error Type dropdown---------------------- */}
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={formikForm?.errors?.valueError}
              >
                <InputLabel id="valueError">Error Type</InputLabel>
                <Select
                  labelId="valueError"
                  id="valueError"
                  fullWidth={true}
                  name="valueError"
                  {...formikForm.getFieldProps('valueError')}
                >
                  <MenuItem value={'formats'}>
                    Standardisation Formats
                  </MenuItem>
                  <MenuItem value={'units'}>
                    Standardisation Units
                  </MenuItem>
                </Select>
                <FormHelperText>
                  {formikForm?.errors?.valueError
                    ? formikForm?.errors?.valueError
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* -------------------- Format/Units dropdown---------------------- */}
            {formikForm.values.valueError !== '' && (
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={
                    formikForm.values.valueError === 'formats'
                      ? formikForm?.errors?.formatType
                      : formikForm?.errors?.unitType
                  }
                >
                  <InputLabel id="operationName">
                    {formikForm.values.valueError === 'formats'
                      ? 'Format'
                      : 'Unit'}
                  </InputLabel>
                  <Select
                    labelId={
                      formikForm.values.valueError === 'formats'
                        ? 'formatType'
                        : 'unitType'
                    }
                    id={
                      formikForm.values.valueError === 'formats'
                        ? 'formatType'
                        : 'unitType'
                    }
                    fullWidth={true}
                    name={
                      formikForm.values.valueError === 'formats'
                        ? 'formatType'
                        : 'unitType'
                    }
                    {...formikForm.getFieldProps(
                      formikForm.values.valueError === 'formats'
                        ? 'formatType'
                        : 'unitType',
                    )}
                  >
                    {(formikForm.values.valueError === 'formats'
                      ? formatOptions
                      : unitOptions
                    ).map((ele, i) => {
                      return (
                        <MenuItem value={ele.value} key={i}>
                          {ele.key}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>
                    {formikForm.values.valueError === 'formats'
                      ? formikForm?.errors?.formatType
                      : formikForm?.errors?.unitType}
                  </FormHelperText>
                </FormControl>
              </Grid>
            )}
            {/* -------------------- Sub Format dropdown/textfield---------------------- */}
            {formikForm.values.valueError === 'formats' &&
            formikForm.values.formatType === 'date' ? (
              <>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={formikForm.errors.dateType}
                  >
                    <InputLabel id="dateType">
                      {'Date Type'}
                    </InputLabel>
                    <Select
                      labelId={'dateType'}
                      id={'dateType'}
                      fullWidth={true}
                      name={'dateType'}
                      {...formikForm.getFieldProps('dateType')}
                    >
                      {subFormatOptions.map((ele, i) => {
                        return (
                          <MenuItem value={ele.value} key={i}>
                            {ele.key}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>
                      {formikForm?.errors?.dateType
                        ? formikForm?.errors?.dateType
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </>
            ) : null}

            {formikForm.values.valueError === 'formats' &&
            formikForm.values.formatType === 'currency' ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth={true}
                    label="Conversion Rate"
                    name="conversionRate"
                    type="number"
                    error={Boolean(
                      formikForm?.errors?.conversionRate,
                    )}
                    onKeyDown={(ele) =>
                      ['e', 'E', '+', '-'].includes(ele.key) &&
                      ele.preventDefault()
                    }
                    helperText={formikForm?.errors?.conversionRate}
                    {...formikForm.getFieldProps('conversionRate')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth={true}
                    label="New Column Name"
                    name="newColumnNameFormats"
                    type="string"
                    error={Boolean(
                      formikForm?.errors?.newColumnNameFormats,
                    )}
                    helperText={
                      formikForm?.errors?.newColumnNameFormats
                    }
                    {...formikForm.getFieldProps(
                      'newColumnNameFormats',
                    )}
                  />
                </Grid>
              </>
            ) : null}
            {/* -------------------- SubUnits dropdown---------------------- */}

            {formikForm.values.valueError === 'units' &&
            currentUnitOptions.length !== 0 ? (
              <>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={formikForm.errors.convertingFrom}
                  >
                    <InputLabel id="convertingFrom">
                      {'Converting From'}
                    </InputLabel>
                    <Select
                      labelId={'convertingFrom'}
                      id={'convertingFrom'}
                      fullWidth={true}
                      name={'convertingFrom'}
                      {...formikForm.getFieldProps('convertingFrom')}
                    >
                      {currentUnitOptions.map((ele, i) => {
                        return (
                          <MenuItem value={ele.value} key={i}>
                            {ele.key}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>
                      {formikForm?.errors?.convertingFrom
                        ? formikForm?.errors?.convertingFrom
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={formikForm.errors.convertingTo}
                  >
                    <InputLabel id="convertingTo">
                      {'Converting To'}
                    </InputLabel>
                    <Select
                      labelId={'convertingTo'}
                      id={'convertingTo'}
                      fullWidth={true}
                      name={'convertingTo'}
                      {...formikForm.getFieldProps('convertingTo')}
                    >
                      {currentUnitOptions
                        .filter(
                          (item) =>
                            item.value !==
                            formikForm.values.convertingFrom,
                        )
                        .map((ele, i) => {
                          return (
                            <MenuItem value={ele.value} key={i}>
                              {ele.key}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    <FormHelperText>
                      {formikForm?.errors?.convertingTo
                        ? formikForm?.errors?.convertingTo
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth={true}
                    label="New Column Name"
                    name="newColumnNameUnits"
                    type="string"
                    error={Boolean(
                      formikForm?.errors?.newColumnNameUnits,
                    )}
                    helperText={
                      formikForm?.errors?.newColumnNameUnits
                    }
                    {...formikForm.getFieldProps(
                      'newColumnNameUnits',
                    )}
                  />
                </Grid>
              </>
            ) : null}
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
