import React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import moment from "moment";

// MuiDatePikker Document Source  : https://next.material-ui-pickers.dev/getting-started/usage
// MuiDatePikker Component link : https://mui.com/components/date-picker/#main-content
// Momentjs : https://momentjs.com/
/**
 * This is the MuiDatePikker component you can use it to implement different type of date formats you can pass it.
 * @function
 * @param {Object} props - component props
 * @param {(date: any) => void} props.onChange - date change handler.
 */
export default function MuiDatePicker({
   ...props
}) {
    return (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <DatePicker
          {...props}
          inputFormat={props?.format}
          minDate={props?.minDate ? moment(props?.minDate) : null}
          maxDate={props?.maxDate ? moment(props?.maxDate) : null}
          renderInput={(params) => (
            <TextField
              {...params}
              size={props?.size}
              name={props?.name}
              error={props?.error}
              onBlur={props?.onBlur}
              helperText={props?.helperText}
              fullWidth
            />
          )}
        />
      </LocalizationProvider>
    );
}
