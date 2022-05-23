import React from "react";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CSVLink } from "react-csv";
import ReactMuiTableHighlightRangeModal from "./ReactMuiTableHighlightRangeModal";
import ReactMuiTableShowHideColumnModal from "./ReactMuiTableShowHideColumnModal";
import { Assets } from "../../assets";
import CloseIcon from "@mui/icons-material/Close";
import ReactMuiTableGroupColumnModal from "./ReactMuiTableGroupColumnModal";
import HighlightWithRegexModal from "./Modals/HighlightWithRegexModal";
import HighlightIllegalValuesModal from "./Modals/HighlightIllegalValuesModal";
import HighlightMisfieldModal from "./Modals/HighlightMisfieldModal";
const toolbarOptions = [
  {
    label: "Show/Hide Columns",
    icon: (
      <img
        src={Assets.ShowHideColumnOperationIcon}
        alt="ShowHideColumnOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
  {
    label: "Heat Grid",
    icon: (
      <img
        src={Assets.HeatGridOperationIcon}
        alt="HeatGridOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
  {
    label: "Highlight Missing",
    icon: (
      <img
        src={Assets.HighLightMissingOperationIcon}
        alt="HighLightMissingOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
  {
    label: "Highlight Range",
    icon: (
      <img
        src={Assets.HighLightRangeOperationIcon}
        alt="HighLightRangeOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
  {
    label: "Highlight Datatype",
    icon: (
      <img
        src={Assets.HighLightDatatypeOperationIcon}
        alt="HighLightDatatypeOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
  {
    label: "Highlight Illegal Values",
    icon: (
      <img
        src={Assets.HighLightIlegalOperationIcon}
        alt="HighLightIlegalOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
  {
    label: "Highlight Misspell",
    icon: (
      <img
        src={Assets.HighLightMisspellOperationIcon}
        alt="HighLightMisspellOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
  {
    label: "Highlight Misfield",
    icon: (
      <img
        src={Assets.HighLightMisfieldOperationIcon}
        alt="HighLightMisfieldOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
  {
    label: "Highlight with Regex",
    icon: (
      <img
        src={Assets.HighLightWithRegexOperationIcon}
        alt="HighLightWithRegexOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
  {
    label: "Group Column",
    icon: (
      <img
        src={Assets.GroupColumnOperationIcon}
        alt="GroupColumnOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
  {
    label: "Export to CSV",
    icon: (
      <img
        src={Assets.ExportToCsvOperationIcon}
        alt="ExportToCsvOperationIcon"
        height={25}
        width={23}
      />
    ),
  },
];

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(1),
  },
  boxStyle: {
    "&:hover": {
      background: theme.palette.grey[100],
      cursor: "pointer",
    },
  },
  boxStyleSelected: {
    background: theme.palette?.other?.blue1,
    color: theme.palette?.secondary?.main,
    cursor: "pointer",
  },
}));

const ReactMuiTableToolbarOptions = ({
  isOpen = false,
  anchorEl,
  id,
  handleOptionClose,
  applyHeatGrid,
  data,
  applyHighlightMissing,
  applyHighlightRange,
  applyHighlightDataTypes,
  applyGroupColumns,
  columns,
  highlightRangeFormData,
  setHighlightRangeFormData,
  applyShowHideColumn,
  allColumns,
  getToggleHideAllColumnsProps,
  optionsConfig,
  setAnchorEl,
  setOptionConfig,
  initialOptionConfig,
  onDownloadCSV,
  dataSetName,

  applyHighlightIllegalValues,
  applyHighlightMisspell,
  applyHighlightMisfield,
  applyHighlightWithRegex,

  highlightIllegalValuesFormData,
  setHighlightIllegalValuesFormData,
  highlightWithRegexFormData,
  setHighlightWithRegexFormData,
  highlightMisfieldFormData,
  setHighlightMisfieldFormData,
  setCurrentOperation,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState("");
  const [openRangeModal, setOpenRangeModal] = React.useState(false);
  const [openGroupColModal, setOpenGroupColModal] = React.useState(false);
  const [openHighlightIllegalValuesModal, setOpenHighlightIllegalValuesModal] =
    React.useState(false);
  const [openHighlightWithRegexModal, setOpenHighlightWithRegexModal] =
    React.useState(false);
  const [openHighlightMisfieldModal, setOpenHighlightMisfieldModal] =
    React.useState(false);

  const onOptionClick = (label) => {
    setAnchorEl(null);
    switch (label) {
      case "Show/Hide Columns":
        applyShowHideColumn(true);
        setAnchorEl(null);
        break;
      case "Heat Grid":
        applyHeatGrid(true);
        break;
      case "Highlight Missing":
        applyHighlightMissing(true);
        break;
      case "Highlight Range":
        setOpenRangeModal(true);
        break;
      case "Highlight Datatype":
        applyHighlightDataTypes(true);
        break;
      case "Highlight Illegal Values":
        setOpenHighlightIllegalValuesModal(true);
        break;
      case "Highlight Misspell":
        applyHighlightMisspell(true);
        break;
      case "Highlight Misfield":
        setOpenHighlightMisfieldModal(true);
        break;
      case "Highlight with Regex":
        setOpenHighlightWithRegexModal(true);
        break;
      case "Export to CSV":
        break;
      case "Group Column":
        applyGroupColumns(true);
        setOpenGroupColModal(true);
        break;
      case "":
        setAnchorEl(null);
        allColumns.map((col) => {
          if (col.toggleHidden) {
            return col.toggleHidden(false);
          }
        });
        allColumns.map((col) => {
          if (col.isGrouped) {
            return col.toggleGroupBy(false);
          }
        });
        setOptionConfig(initialOptionConfig);
        setHighlightIllegalValuesFormData("");
        setHighlightWithRegexFormData("");
        setHighlightMisfieldFormData("");
        setCurrentOperation("");

        break;
      default:
        applyHeatGrid(false);

        break;
    }
    setSelected(label);
  };

  return (
    <>
      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleOptionClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {toolbarOptions.map((ele, i) => {
          return (
            <React.Fragment key={i + ele.label}>
              <Box
                minWidth={200}
                p={1}
                className={
                  selected === ele.label
                    ? classes.boxStyleSelected
                    : classes.boxStyle
                }
                display="flex"
                flexDirection="row"
              >
                {ele.label === "Export to CSV" ? (
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    onClick={() => {
                      onDownloadCSV((res) => {
                        const link = document.createElement("a");
                        // const blob = new Blob([res?.data], {
                        //   type: "text/csv",
                        // });
                        let fileHyper = res?.data?.presignedUrl;
                        // window.URL.createObjectURL(blob);
                        link.href = fileHyper;
                        link.setAttribute(
                          "download",
                          `Grid-Table-${dataSetName}.csv`
                        );
                        document.body.append(link);
                        link.click();
                      });
                    }}
                  >
                    <Box mr={1}>
                      {ele.icon && ele.label === "Export to CSV"
                        ? ele.icon
                        : ""}
                    </Box>
                    <Box ml={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "primary.main",
                          opacity: 0.5,
                        }}
                      >
                        {ele.label}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    onClick={() => {
                      onOptionClick(ele.label);
                    }}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <Box mr={1}>{ele.icon}</Box>
                    <Box ml={1} mt={0.2}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "primary.main",
                          opacity: 0.5,
                        }}
                      >
                        {ele.label}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {selected === ele.label ? (
                  <Box ml={1}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        onOptionClick("");
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ) : null}
              </Box>
            </React.Fragment>
          );
        })}
      </Popover>
      <ReactMuiTableShowHideColumnModal
        allColumns={allColumns}
        getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
        applyShowHideColumn={applyShowHideColumn}
        optionsConfig={optionsConfig}
      />
      <ReactMuiTableHighlightRangeModal
        columns={columns}
        openRangeModal={openRangeModal}
        setOpenRangeModal={setOpenRangeModal}
        applyHighlightRange={applyHighlightRange}
        highlightRangeFormData={highlightRangeFormData}
        setHighlightRangeFormData={setHighlightRangeFormData}
      />
      <ReactMuiTableGroupColumnModal
        open={openGroupColModal}
        allColumns={allColumns}
        setOpen={setOpenGroupColModal}
      />

      <HighlightIllegalValuesModal
        open={openHighlightIllegalValuesModal}
        setOpen={setOpenHighlightIllegalValuesModal}
        applyHighlightIllegalValues={applyHighlightIllegalValues}
        highlightIllegalValuesFormData={highlightIllegalValuesFormData}
        setHighlightIllegalValuesFormData={setHighlightIllegalValuesFormData}
      />
      <HighlightWithRegexModal
        open={openHighlightWithRegexModal}
        setOpen={setOpenHighlightWithRegexModal}
        applyHighlightWithRegex={applyHighlightWithRegex}
        highlightWithRegexFormData={highlightWithRegexFormData}
        setHighlightWithRegexFormData={setHighlightWithRegexFormData}
      />
      <HighlightMisfieldModal
        open={openHighlightMisfieldModal}
        setOpen={setOpenHighlightMisfieldModal}
        applyHighlightMisfield={applyHighlightMisfield}
        highlightMisfieldFormData={highlightMisfieldFormData}
        setHighlightMisfieldFormData={setHighlightMisfieldFormData}
      />
    </>
  );
};

export default ReactMuiTableToolbarOptions;
