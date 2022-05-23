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
  open,
  setOpen,
  allColumns,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
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
            Group Columns
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
        {allColumns
          .filter((ele) => {
            return !ele?.id?.includes("pk");
          })
          .map((column, index) => {
            return column.id != "expander" &&
              column.canGroupBy ? (
              <Box
                {...column.getGroupByToggleProps()}
                display="flex"
                alignItems="center"
                flexGrow={1}
                style={{ textTransform: "capitalize" }}
                key={index}
              >
                <Checkbox checked={column.isGrouped} />{" "}
                {typeof column?.Header === "string"
                  ? column?.Header
                  : column?.heading}
              </Box>
            ) : null;
          })}
      </DialogContent>
      <DialogActions>
        <Box display="flex" flexGrow={1}>
          <Typography variant="subtitle2" align="left">
            Note: Grouping will happen in same sequence you
            select columns
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
