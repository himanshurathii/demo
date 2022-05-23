import React from "react";
import { makeStyles } from '@mui/styles';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";

import {
  Select,
  OutlinedInput,
  FormHelperText,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import * as _ from "lodash";

const useStyles = makeStyles((theme) => ({
  formControl: {},
  chipInModal: {
    margin: theme.spacing(0.5),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 1,
    height: theme.spacing(4),
  },
  select: {
    padding: theme.spacing(0.2),
    flexGrow: 1,
    overflow: "hidden",
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export default function MultiSelect({
  label,
  opts,
  value,
  onChange,
  error,
  onBlur,
  name,
  disabled,
  enableExapandedView = true,
  noLaunchIcon,
  showLimited,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const onModalChipClick = (option) => {
    if (!_.includes(value, option.value)) {
      var event = {
        target: {
          value: value?.length ? [...value, option.value] : [option.value],
          name: name,
        },
      };
      onChange(event);
    }
  };
  const onModalChipDelete = (option) => {
    var event = {
      target: {
        name: name,
        value: _.reject([...value], (item) => item === option.value),
      },
    };
    onChange(event);
  };

  return (
    <>
      <FormControl
        variant="outlined"
        className={classes.formControl}
        size="small"
        name={name}
        error={Boolean(error)}
        onBlur={onBlur}
        fullWidth
      >
        <InputLabel id="mutiple-chip-label">{label}</InputLabel>
        <Box alignItems="center" flexDirection="row" display="flex">
          <Select
            labelId="mutiple-chip-label"
            id="mutiple-chip-outlined"
            label={label}
            multiple
            name={name}
            disabled={disabled}
            value={value ? value : []}
            onChange={(e) => {
              onChange(e);
            }}
            variant="outlined"
            className={classes.select}
            input={<OutlinedInput id="select-multiple-chip" label={label} />}
            renderValue={(selected) =>
              showLimited ? (
                `${selected.length} Selected`
              ) : (
                <div className={classes.chips}>
                  {false ? (
                    <Typography variant="caption">To many values</Typography>
                  ) : (
                    selected.map((value) => (
                      <Chip
                        size="small"
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))
                  )}
                </div>
              )
            }
            MenuProps={MenuProps}
          >
            {opts.map((opt) => (
              <MenuItem key={opt.label} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {enableExapandedView && !noLaunchIcon ? (
            <Box>
              <IconButton
                title="Expanded View"
                disabled={disabled}
                onClick={() => setOpen(true)}
              >
                <LaunchIcon size="small" />
              </IconButton>
            </Box>
          ) : null}
        </Box>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
      <Dialog
        onClose={handleClose}
        aria-labelledby="multi-select-dialog-title"
        open={open}
      >
        <DialogTitle
          id="multi-select-dialog-title"
          onClose={handleClose}
          disableTypography
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography color="primary" variant="subtitle1">
              Select {label}
            </Typography>
            {handleClose ? (
              <IconButton aria-label="close" onClick={handleClose} size="small">
                <CloseIcon size="small" />
              </IconButton>
            ) : null}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            {opts.map((opt, index) => (
              <Chip
                key={"model_chip_" + index}
                size="small"
                label={opt.label}
                color={_.includes(value, opt.value) ? "primary" : "default"}
                deleteIcon={
                  _.includes(value, opt.value) ? <CancelIcon /> : <></>
                }
                onClick={() => {
                  onModalChipClick(opt);
                }}
                className={classes.chipInModal}
                onDelete={() => {
                  onModalChipDelete(opt);
                }}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
