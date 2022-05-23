import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function AddRowsModal({
  columns,
  columnMetaData,
  open,
  setOpen,
  onAddRowCallback,
}) {
  const dynamicColumns = Object.keys(columns[0])
    .filter((data) => {
      return data !== "pk";
    })
    .reduce((obj, key) => {
      obj[key] = "";
      return obj;
    }, {});
  const [errorStatus, setErrorStatus] = React.useState([]);
  const [addRowForms, setAddRowForms] = React.useState([
    dynamicColumns,
  ]);

  const handleSubmit = () => {
    const errorArray = [];

    for (let i = 0; i < addRowForms.length; i++) {
      if (
        Object.values(addRowForms[i]).every(
          (data) => data === ""
        )
      ) {
        errorArray.push({ isError: true, errorIndex: i });
        setErrorStatus(errorArray);
      } else {
        setErrorStatus([]);
      }
    }
    if (errorArray.length === 0) {
      handleClose();
      onAddRowCallback(addRowForms);
      setAddRowForms([dynamicColumns]);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrorStatus([
      ...errorStatus,
      {
        isError: false,
        errorIndex: 0,
      },
    ]);
    setAddRowForms([dynamicColumns]);
  };

  const handleChange = (i, e) => {
    addRowForms.map((ele, i) => {
      if (
        Object.values(addRowForms[i]).some(
          (data) => data !== ""
        )
      ) {
        const errorArray = errorStatus.filter((ele) => {
          return ele.errorIndex !== i;
        });
        setErrorStatus(errorArray);
      }
    });

    let newFormValues = [...addRowForms];
    newFormValues[i][e.target.name] = e.target.value;
    setAddRowForms(newFormValues);
  };

  const addAdditionalRow = () => {
    setAddRowForms([...addRowForms, dynamicColumns]);
  };
  const deleteAdditionalRow = (i) => {
    let newFormValues = [...addRowForms];
    newFormValues.splice(i, 1);
    setAddRowForms(newFormValues);
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="add-row-dialog-title"
      open={open}
      maxWidth="lg"
      fullWidth={true}
    >
      <DialogTitle
        id="add-row-dialog-title"
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Add Rows</Typography>
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
        {addRowForms?.map((form, index) => {
          return (
            <Box mt={2} key={index}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
                mt={1}
              >
                <Box>
                  <Typography variant={"subtitle1"}>
                    Row No. {index + 1}
                  </Typography>
                </Box>
                {index ? (
                  <Box>
                    <IconButton
                      size="small"
                      aria-label="remove-row"
                      title={"Remove row"}
                      onClick={() =>
                        deleteAdditionalRow(index)
                      }
                    >
                      <DeleteForeverIcon color="primary" />
                    </IconButton>
                  </Box>
                ) : null}
              </Box>
              <Divider />
              {errorStatus.length !== 0 &&
                errorStatus?.map((error, i) => {
                  return (
                    <>
                      {error.isError &&
                      error.errorIndex === index ? (
                        <Box m={2} color="red" key={i}>
                          <Typography variant="body2">
                            No entry added, please provide
                            value for atleast one column to
                            proceed
                          </Typography>
                        </Box>
                      ) : null}
                    </>
                  );
                })}
              <Grid container spacing={2}>
                {columnMetaData
                  ?.filter((data) => {
                    return data.column_name !== "pk";
                  })
                  .map((col, i) => {
                    return (
                      <Grid
                        item
                        md={4}
                        sm={6}
                        xs={12}
                        key={i}
                      >
                        <TextField
                          fullWidth={true}
                          label={
                            col.column_name +
                            " : " +
                            col.data_type
                          }
                          name={col.column_name}
                          type="string"
                          placeholder="enter a value"
                          value={form.column_name}
                          onChange={(e) => {
                            handleChange(index, e);
                          }}
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>
          );
        })}
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
          mt={1}
        >
          <IconButton
            aria-label="add-row"
            title={"Add row"}
            onClick={addAdditionalRow}
          >
            <AddIcon color="primary" />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            handleSubmit();
          }}
          color="primary"
        >
          Add Rows
        </Button>
      </DialogActions>
    </Dialog>
  );
}
