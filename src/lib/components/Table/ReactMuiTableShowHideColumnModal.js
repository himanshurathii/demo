import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
const useStyles = makeStyles((theme) => ({
  dialogBox: {
    height: theme.spacing(50),
    margin: "auto",
    paddingBottom: theme.spacing(2),
  },
  inputRoot: {
    paddingTop: "0px !important",
    color: "inherit",
  },
  searchBox: {
    padding: theme.spacing(1, 7, 1, 1),
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },

  searchBoxContainer: {
    zIndex: "1",
    padding: theme.spacing(1),
    background: "white !important",
  },
}));

export default function ReactMuiTableShowHideColumnModal({
  applyShowHideColumn,
  allColumns,
  optionsConfig,

  getToggleHideAllColumnsProps,
}) {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Dialog
      onClose={() => {
        applyShowHideColumn(false);
      }}
      open={optionsConfig.showHideColumn}
      maxWidth="xs"
      aria-labelledby="customized-dialog-title"
      classes={{ paper: classes.dialogBox }}
    >
      <DialogTitle
        disableTypography
        id="customized-dialog-title"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            {"Show/Hide Columns"}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => {
              applyShowHideColumn(false);
              setSearchTerm("");
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        className="showHideColumnModalBody"
        classes={{
          dividers: classes.dividers,
          root: classes.inputRoot,
        }}
      >
        <Box>
          <Box
            position="sticky"
            top="0"
            className={classes.searchBoxContainer}
          >
            <OutlinedInput
              classes={{
                root: classes.inputRoot,
                input: classes.searchBox,
              }}
              type="text"
              placeholder="Search..."
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              endAdornment={<SearchIcon color="primary" />}
            />
          </Box>

          {searchTerm === "" ? (
            <div>
              <Checkbox
                color="default"
                {...getToggleHideAllColumnsProps()}
              />
              Select All
            </div>
          ) : null}
          {allColumns
            ?.filter((ele) => {
              if (!ele?.id?.includes("pk"))
                if (searchTerm === "") {
                  return ele;
                } else if (
                  ele.id
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return ele;
                }
            })
            ?.map((column) => (
              <div key={column.id}>
                <label
                  style={{ textTransform: "capitalize" }}
                >
                  <Checkbox
                    {...column.getToggleHiddenProps()}
                    onClick={() => {
                      allColumns.forEach((col) => {
                        if (col.id === "pk") {
                          return col.toggleHidden(false);
                        }
                      });
                    }}
                  />
                  {typeof column?.Header === "string"
                    ? column?.Header
                    : column?.heading}
                </label>
              </div>
            ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
