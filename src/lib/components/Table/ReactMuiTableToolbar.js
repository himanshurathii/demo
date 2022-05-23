import React from 'react';
import clsx from 'clsx';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactMuiTableToolbarFilter from './ReactMuiTableToolbarFilter';
import ReactMuiTableToolbarOptions from './ReactMuiTableToolbarOptions';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import {lighten} from '@mui/material/styles';
import {makeStyles} from '@mui/styles';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import FilterDownArrowIcon from '../../assets/icons/FilterDownArrowIcon.svg';
import ColumnOperationsDownIcon from '../../assets/icons/ColumnOperationsDownIcon.svg';
import SortButtonArrowIcon from '../../assets/icons/SortButtonArrowIcon.svg';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(
            theme.palette.secondary.light,
            0.85,
          ),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const ReactMuiTableToolbar = ({
  numSelected,
  addUserHandler,
  deleteUserHandler,
  preGlobalFilteredRows,
  setGlobalFilter,
  globalFilter,
  onRefreshClick,
  showOptions,
  applyHeatGrid,
  applyHighlightMissing,
  applyHighlightRange,
  applyHighlightDataTypes,
  applyShowHideColumn,
  applyGroupColumns,
  allColumns,
  getToggleHideAllColumnsProps,
  optionsConfig,
  data,
  columns,
  highlightRangeFormData,
  setHighlightRangeFormData,
  uniqueId,
  pageState,
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
  dataLength,
  rowSelectionConfig = {
    enable: false,
    mode: 'checkbox',
    showDeleteOnSelected: false,
    type: 'multi-select',
  },
}) => {
  const classes = useToolbarStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const toolbarOptionOpen = Boolean(anchorEl);
  const toolbarOptionId = toolbarOptionOpen
    ? 'simple-popover'
    : undefined;
  const showDeleteButton = React.useMemo(
    () =>
      rowSelectionConfig.enable &&
      rowSelectionConfig.showDeleteOnSelected &&
      numSelected,
    [numSelected, rowSelectionConfig],
  );
  const showSelectedRowsCount = React.useMemo(
    () => rowSelectionConfig.enable && numSelected,
    [rowSelectionConfig, numSelected],
  );
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: showSelectedRowsCount,
      })}
    >
      {onRefreshClick ? (
        <IconButton
          id={`${uniqueId}-refresh-btn`}
          color="primary"
          onClick={() => onRefreshClick(pageState)}
        >
          <RefreshIcon color="primary" />
        </IconButton>
      ) : (
        ''
      )}
      <Box display="flex" alignItems="center">
        <ReactMuiTableToolbarFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          dataLength={dataLength}
        />
      </Box>

      {showSelectedRowsCount ? (
        <Typography className={classes.title} variant="subtitle1">
          {numSelected} row(s) selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
        ></Typography>
      )}

      {showDeleteButton ? (
        <Tooltip title="Delete selected rows">
          <IconButton
            color="primary"
            aria-label="delete"
            onClick={deleteUserHandler}
          >
            <DeleteIcon color="primary" />
          </IconButton>
        </Tooltip>
      ) : null}

      {/*  Options Section on Toolbar */}
      {showOptions && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body2">Filters</Typography>
          <IconButton
            color="primary"
            aria-label="filter"
            title="Options"
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <img
              src={FilterDownArrowIcon}
              alt="FilterDownArrowIcon"
              height={14}
              width={14}
            />
          </IconButton>
          <ReactMuiTableToolbarOptions
            isOpen={toolbarOptionOpen}
            anchorEl={anchorEl}
            id={toolbarOptionId}
            handleOptionClose={() => {
              setAnchorEl(null);
            }}
            setAnchorEl={setAnchorEl}
            applyHeatGrid={applyHeatGrid}
            data={data}
            applyHighlightMissing={applyHighlightMissing}
            applyHighlightRange={applyHighlightRange}
            applyHighlightDataTypes={applyHighlightDataTypes}
            applyGroupColumns={applyGroupColumns}
            columns={columns}
            highlightRangeFormData={highlightRangeFormData}
            setHighlightRangeFormData={setHighlightRangeFormData}
            setAnchorEl={setAnchorEl}
            applyShowHideColumn={applyShowHideColumn}
            allColumns={allColumns}
            getToggleHideAllColumnsProps={
              getToggleHideAllColumnsProps
            }
            optionsConfig={optionsConfig}
            setOptionConfig={setOptionConfig}
            initialOptionConfig={initialOptionConfig}
            onDownloadCSV={onDownloadCSV}
            dataSetName={dataSetName}
            applyHighlightIllegalValues={applyHighlightIllegalValues}
            applyHighlightMisspell={applyHighlightMisspell}
            applyHighlightMisfield={applyHighlightMisfield}
            applyHighlightWithRegex={applyHighlightWithRegex}
            highlightIllegalValuesFormData={
              highlightIllegalValuesFormData
            }
            setHighlightIllegalValuesFormData={
              setHighlightIllegalValuesFormData
            }
            highlightWithRegexFormData={highlightWithRegexFormData}
            setHighlightWithRegexFormData={
              setHighlightWithRegexFormData
            }
            highlightMisfieldFormData={highlightMisfieldFormData}
            setHighlightMisfieldFormData={
              setHighlightMisfieldFormData
            }
            setCurrentOperation={setCurrentOperation}
          />
        </Box>
      )}
    </Toolbar>
  );
};

ReactMuiTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  addUserHandler: PropTypes.func.isRequired,
  deleteUserHandler: PropTypes.func.isRequired,
  setGlobalFilter: PropTypes.func.isRequired,
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string,
  onRefreshClick: PropTypes.func,
  onDownloadCSV: PropTypes.func,
  datasetName: PropTypes.string,
  rowSelectionConfig: PropTypes.shape({
    enable: PropTypes.bool.isRequired,
    mode: PropTypes.arrayOf(
      PropTypes.oneOf(['checkbox', 'row-click']),
    ).isRequired,
    showDeleteOnSelected: PropTypes.bool,
    type: PropTypes.arrayOf(
      PropTypes.oneOf(['single-select', 'multi-select']),
    ).isRequired,
    selectedRowStyle: PropTypes.object,
  }),
};

export default ReactMuiTableToolbar;
