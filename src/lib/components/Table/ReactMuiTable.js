import React from "react";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import PropTypes from "prop-types";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import ReactMuiTablePaginationActions from "./ReactMuiTablePaginationActions";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import ReactMuiTableToolbar from "./ReactMuiTableToolbar";
import SortButtonArrowIcon from "../../assets/icons/SortButtonArrowIcon.svg";
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
  useFlexLayout,
  useResizeColumns,
  useGroupBy,
  useExpanded,
  useColumnOrder,
} from "react-table";
import useReactMuiTableOptions from "../../hooks/useReactMuiTableOptions";
import { FixedSizeList } from "react-window";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { LinearProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
// Set our editable cell renderer as the default Cell renderer
// const defaultColumn = {
// 	Cell: EditableCell,
// };
// Create a default prop getter
const defaultPropGetter = () => ({});
const ROW_LEVEL_HOVER_OPTIONS_DEFAULT_STYLE = {
  position: "absolute",
  float: "right",
  right: 0,
  height: "inherit",
  display: "none",
};

const ReactMuiTable = ({
  columns,
  data,
  setData,
  dataSetName,
  projectId,
  updateMyData,
  skipPageReset,
  rowSelectionConfig = {
    enable: false,
    mode: "checkbox",
    showDeleteOnSelected: false,
    type: "multi-select",
  },
  stickyHeader = false,
  stickyHeaderConfig = {},
  onRefreshClick,
  showOptions,
  enablePagination = true,
  maxHeightForVirtualization = document.documentElement.clientHeight * 0.65,
  itemHeightForVirtualization = 40,
  enableVirtualization = false,
  fetchColumnMetaData = () => {},
  onDownloadCSV = () => {},
  highlightCells,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  showToolbar = true,

  enableControlledPagination = false,
  enableManualFilter = false,
  rowsPerPageOptions,
  dataLength,
  initialPageSize = 5,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
  uniqueId = Math.floor(Math.random()),
  selectedTaskRowId,
  onTableStateChange,
  isAllOptionDisabled = false,
  rowLevelOnHoverOptions = () => {},
}) => {
  const {
    optionsConfig,
    applyHeatGrid,
    applyHighlightMissing,
    applyHighlightRange,
    highlightCell,
    applyHighlightDataTypes,
    highlightRangeFormData,
    setHighlightRangeFormData,
    datasetColumnDetails,
    applyShowHideColumn,
    applyGroupColumns,
    setOptionConfig,
    initialOptionConfig,

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
  } = useReactMuiTableOptions(
    dataSetName,
    projectId,
    fetchColumnMetaData,
    highlightCells
  );

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      maxWidth: 400,
      columnMetaData: datasetColumnDetails,
    }),
    [datasetColumnDetails, data]
  );

  const {
    allColumns,
    getToggleHideAllColumnsProps,
    toggleAllRowsSelected,
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      initialState: {
        pageIndex: 0,
        pageSize: initialPageSize,
        globalFilter: "",
      },
      manualPagination: enableControlledPagination,
      pageCount: controlledPageCount,
      manualGlobalFilter: enableManualFilter,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
    },
    useGlobalFilter,
    useFlexLayout,
    useResizeColumns,
    useColumnOrder,
    useGroupBy,

    useSortBy,
    useExpanded,
    usePagination,

    useRowSelect,
    (hooks) => {
      if (rowSelectionConfig.enable && rowSelectionConfig.mode === "checkbox") {
        hooks.allColumns.push((columns) => [
          // Let's make a column for selection
          {
            id: "selection",
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox.  Pagination is a problem since this will select all
            // rows even though not all rows are on the current page.  The solution should
            // be server side pagination.  For one, the clients should not download all
            // rows in most cases.  The client should only download data for the current page.
            // In that case, getToggleAllRowsSelectedProps works fine.
            Header: ({ getToggleAllRowsSelectedProps, column }) => (
              <Box display={"flex"} alignItems={"center"} textAlign="center">
                {rowSelectionConfig.type === "multi-select" ? (
                  <>
                    <IndeterminateCheckbox
                      {...getToggleAllRowsSelectedProps()}
                    />
                    <Typography variant="subtitle2" color="inherit">
                      Select All
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle2" color="inherit">
                    Select Row
                  </Typography>
                )}
              </Box>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox
                  {...row.getToggleRowSelectedProps({
                    onChange: toggleRowSelection.bind(null, row),
                  })}
                />
              </div>
            ),
          },
          ...columns,
        ]);
      }
      hooks.useControlledState.push(useControlledState);
      hooks.visibleColumns.push((columns, { instance }) => {
        if (!instance.state.groupBy.length) {
          return columns;
        }

        return [
          {
            id: "expander", // Make sure it has an ID
            // Build our expander column
            Header: ({ allColumns, state: { groupBy } }) => {
              return groupBy.map((columnId) => {
                const column = allColumns.find((d) => d.id === columnId);

                return (
                  <Box display="flex" alignItems="center">
                    {column.canGroupBy ? (
                      // If the column can be grouped, let's add a toggle
                      <Box
                        {...column.getGroupByToggleProps()}
                        title="click here to remove grouping"
                        mr={1}
                        display="flex"
                      >
                        {column.isGrouped ? <GroupWorkIcon /> : ""}
                      </Box>
                    ) : null}
                    <Box>{column.render("Header")} </Box>
                  </Box>
                );
              });
            },
            Cell: ({ row }) => {
              if (row.canExpand) {
                const groupedCell = row.allCells.find((d) => d.isGrouped);

                return (
                  <Box
                    {...row.getToggleRowExpandedProps({
                      style: {
                        // We can even use the row.depth property
                        // and paddingLeft to indicate the depth
                        // of the row
                        paddingLeft: `${row.depth * 2}rem`,
                      },
                    })}
                    display="flex"
                    alignItems="center"
                  >
                    {row.isExpanded ? (
                      <IndeterminateCheckBoxIcon />
                    ) : (
                      <AddBoxIcon />
                    )}{" "}
                    {groupedCell.render("Cell")} ({row.subRows.length})
                  </Box>
                );
              }

              return null;
            },
          },
          ...columns,
        ];
      });
    }
  );

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
    gotoPage(0);
  };

  const removeByIndexs = (array, indexs) =>
    array.filter((_, i) => !indexs.includes(i));

  const deleteUserHandler = (event) => {
    const newData = removeByIndexs(
      data,
      Object.keys(selectedRowIds).map((x) => parseInt(x, 10))
    );
    setData(newData);
  };

  const addUserHandler = (user) => {
    const newData = data.concat([user]);
    setData(newData);
  };

  const toggleRowSelection = React.useCallback(
    (row, e) => {
      if (rowSelectionConfig.enable) {
        if (rowSelectionConfig.type === "single-select" && !row.isSelected) {
          toggleAllRowsSelected(false);
        }
        row.toggleRowSelected();
      }
    },
    [rowSelectionConfig, toggleAllRowsSelected]
  );

  React.useEffect(() => {
    if (enableControlledPagination && fetchData) {
      fetchData(pageIndex, pageSize, globalFilter);
    }
  }, [
    fetchData,
    pageIndex,
    pageSize,
    enableControlledPagination,
    globalFilter,
  ]);

  React.useEffect(() => {
    if (onTableStateChange) {
      onTableStateChange({
        pageIndex,
        pageSize,
        selectedRowIds,
        globalFilter,
        selectedFlatRows,
      });
    }
  }, [pageIndex, pageSize, selectedRowIds, globalFilter, selectedFlatRows]);

  // Virtualized rows Row Render function
  const VirtualizedRowsRenderer = React.useCallback(
    ({ index, style }) => {
      const row = (enablePagination ? page : rows)[index];
      prepareRow(row);
      return (
        <TableRow
          {...row.getRowProps([
            {
              style: {
                ...style,
                ...(rowSelectionConfig.enable &&
                rowSelectionConfig.selectedRowStyle &&
                Object.keys(selectedRowIds).includes(row.id)
                  ? rowSelectionConfig.selectedRowStyle
                  : {}),
              },
              ...(rowSelectionConfig.enable &&
              rowSelectionConfig.mode === "row-click"
                ? { onClick: toggleRowSelection.bind(null, row) }
                : {}),
            },
            getRowProps(row, toggleAllRowsSelected),
          ])}
          sx={{
            "&:hover": {
              ["& .row-level-options-on-hover-" + index]: {
                display: "block",
              },
            },
          }}
        >
          {rowLevelOnHoverOptions({
            className: "row-level-options-on-hover-" + index,
            containerSx: ROW_LEVEL_HOVER_OPTIONS_DEFAULT_STYLE,
            row: row,
            rowIndex: index,
          })}
          {row.cells.map((cell) => {
            return (
              <TableCell
                {...cell.getCellProps([
                  {
                    style: {
                      backgroundColor:
                        cell.column.id !== "pk" ? highlightCell(cell) : null,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      wordBreak: "initial",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                    },
                  },
                  getColumnProps(cell.column),
                  getCellProps(cell),
                ])}
                title={cell.value}
                align="right"
              >
                {cell.isAggregated
                  ? // If the cell is aggregated, use the Aggregated
                    // renderer for cell
                    cell.render("Aggregated")
                  : cell.isPlaceholder
                  ? null // For cells with repeated values, render null
                  : // Otherwise, just render the regular cell
                    cell.render("Cell")}
              </TableCell>
            );
          })}
        </TableRow>
      );
    },
    [prepareRow, rows, highlightCell, toggleRowSelection]
  );

  // Render the UI for your table
  return (
    <>
      <Box width="100%">
        {showToolbar ? (
          <ReactMuiTableToolbar
            numSelected={Object.keys(selectedRowIds).length}
            deleteUserHandler={deleteUserHandler}
            addUserHandler={addUserHandler}
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
            onRefreshClick={onRefreshClick}
            showOptions={showOptions}
            applyHeatGrid={applyHeatGrid}
            applyHighlightMissing={applyHighlightMissing}
            applyHighlightRange={applyHighlightRange}
            applyHighlightDataTypes={applyHighlightDataTypes}
            applyShowHideColumn={applyShowHideColumn}
            applyGroupColumns={applyGroupColumns}
            allColumns={allColumns}
            getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
            optionsConfig={optionsConfig}
            data={data}
            columns={datasetColumnDetails}
            highlightRangeFormData={highlightRangeFormData}
            setHighlightRangeFormData={setHighlightRangeFormData}
            uniqueId={uniqueId}
            pageState={{
              pageIndex,
              pageSize,
              selectedRowIds,
              globalFilter,
            }}
            rowSelectionConfig={rowSelectionConfig}
            setOptionConfig={setOptionConfig}
            initialOptionConfig={initialOptionConfig}
            onDownloadCSV={onDownloadCSV}
            dataSetName={dataSetName}
            applyHighlightIllegalValues={applyHighlightIllegalValues}
            applyHighlightMisspell={applyHighlightMisspell}
            applyHighlightMisfield={applyHighlightMisfield}
            applyHighlightWithRegex={applyHighlightWithRegex}
            highlightIllegalValuesFormData={highlightIllegalValuesFormData}
            setHighlightIllegalValuesFormData={
              setHighlightIllegalValuesFormData
            }
            highlightWithRegexFormData={highlightWithRegexFormData}
            setHighlightWithRegexFormData={setHighlightWithRegexFormData}
            highlightMisfieldFormData={highlightMisfieldFormData}
            setHighlightMisfieldFormData={setHighlightMisfieldFormData}
            setCurrentOperation={setCurrentOperation}
            dataLength={dataLength}
          />
        ) : null}

        <TableContainer
          style={
            stickyHeader
              ? { maxHeight: 450, ...stickyHeaderConfig.containerStyle }
              : {}
          }
        >
          {dataLength === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="subtitle1">loading...</Typography>
            </Box>
          ) : data.length && columns.length ? (
            <Table
              {...getTableProps()}
              size="small"
              stickyHeader={stickyHeader}
            >
              <TableHead
                style={
                  stickyHeader
                    ? {
                        position: "sticky",
                        top: 0,
                        ...stickyHeaderConfig.tableHeadStyle,
                      }
                    : {}
                }
              >
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <TableCell
                        align="center"
                        {...column.getHeaderProps([
                          getColumnProps(column),
                          getHeaderProps(column),
                        ])}
                      >
                        {column.render("Header")}

                        {!["selection", "expander", "pk", ""].includes(
                          column.id
                        ) ? (
                          <Box
                            {...(column.id === "selection"
                              ? {}
                              : column.getSortByToggleProps())}
                          >
                            {column.isSorted ? (
                              <TableSortLabel
                                active={column.isSorted}
                                // react-table has a unsorted state which is not treated here
                                direction={column.isSortedDesc ? "desc" : "asc"}
                              />
                            ) : !column.disableSortBy ? (
                              <Box ml={1} mt={-0.5}>
                                <img
                                  src={SortButtonArrowIcon}
                                  alt="SortButtonArrowIcon"
                                  height={11}
                                  width={11}
                                />
                              </Box>
                            ) : null}
                          </Box>
                        ) : null}
                        <div
                          {...column.getResizerProps()}
                          className={`resizer ${
                            column.isResizing ? "isResizing" : ""
                          }`}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {enableVirtualization ? (
                  <FixedSizeList
                    height={
                      enablePagination
                        ? pageSize < data.length
                          ? pageSize * itemHeightForVirtualization
                          : maxHeightForVirtualization
                        : maxHeightForVirtualization
                    }
                    itemCount={(enablePagination ? page : rows).length}
                    itemSize={itemHeightForVirtualization}
                    width={"100%"}
                    style={{
                      overflowX: "hidden",
                      overflowY: "auto",
                    }}
                  >
                    {VirtualizedRowsRenderer}
                  </FixedSizeList>
                ) : (
                  (enablePagination ? page : rows)?.map((row, i) => {
                    prepareRow(row);
                    return (
                      <TableRow
                        {...row.getRowProps([
                          {
                            style: {
                              ...(rowSelectionConfig.enable &&
                              rowSelectionConfig.selectedRowStyle &&
                              Object.keys(selectedRowIds).includes(row.id)
                                ? rowSelectionConfig.selectedRowStyle
                                : {}),
                            },
                            ...(rowSelectionConfig.enable &&
                            rowSelectionConfig.mode === "row-click"
                              ? { onClick: toggleRowSelection.bind(null, row) }
                              : {}),
                          },
                          getRowProps(row, toggleAllRowsSelected),
                        ])}
                        sx={{
                          "&:hover": {
                            ["& .row-level-options-on-hover-" + i]: {
                              display: "block",
                            },
                          },
                        }}
                      >
                        {rowLevelOnHoverOptions({
                          className: "row-level-options-on-hover-" + i,
                          containerSx: ROW_LEVEL_HOVER_OPTIONS_DEFAULT_STYLE,
                          row: row,
                          rowIndex: i,
                        })}
                        {row.cells.map((cell) => {
                          return (
                            <TableCell
                              {...cell.getCellProps([
                                {
                                  style: {
                                    backgroundColor:
                                      cell.column.id !== "pk"
                                        ? highlightCell(cell)
                                        : null,
                                  },
                                },
                                getColumnProps(cell.column),
                                getCellProps(cell),
                              ])}
                              align="right"
                            >
                              {cell.isAggregated
                                ? // If the cell is aggregated, use the Aggregated
                                  // renderer for cell
                                  cell.render("Aggregated")
                                : cell.isPlaceholder
                                ? null // For cells with repeated values, render null
                                : // Otherwise, just render the regular cell
                                  cell.render("Cell")}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                )}
                <TableRow>
                  {loading && enableControlledPagination ? (
                    // Use our custom loading state to show a loading indicator
                    <TableCell colSpan="10000">
                      <LinearProgress color="primary" />
                    </TableCell>
                  ) : null}
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="subtitle1">No data present !</Typography>
            </Box>
          )}
        </TableContainer>
        <Box width="100%" overflow="auto">
          {enablePagination && (
            <TablePagination
              rowsPerPageOptions={[
                ...(rowsPerPageOptions
                  ? rowsPerPageOptions.map((ele) => {
                      return { label: ele + " rows", value: ele };
                    })
                  : [5, 10, 20, 50].map((ele) => {
                      return { label: ele + " rows", value: ele };
                    })),
                ...(isAllOptionDisabled
                  ? []
                  : [
                      {
                        label: "All",
                        value: enableControlledPagination
                          ? dataLength
                          : data.length,
                      },
                    ]),
              ]}
              colSpan={columns?.length}
              count={enableControlledPagination ? dataLength : data.length}
              rowsPerPage={pageSize}
              page={pageIndex}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={"Show:"}
              ActionsComponent={ReactMuiTablePaginationActions}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

ReactMuiTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  skipPageReset: PropTypes.bool.isRequired,
  updateMyData: PropTypes.func,
  setData: PropTypes.func,
  dataSetName: PropTypes.string,
  projectId: PropTypes.number,
  rowSelectionConfig: PropTypes.shape({
    enable: PropTypes.bool.isRequired,
    mode: PropTypes.arrayOf(PropTypes.oneOf(["checkbox", "row-click"]))
      .isRequired,
    showDeleteOnSelected: PropTypes.bool,
    type: PropTypes.arrayOf(PropTypes.oneOf(["single-select", "multi-select"]))
      .isRequired,
    selectedRowStyle: PropTypes.object,
  }),
  onRefreshClick: PropTypes.func,
  stickyHeader: PropTypes.bool,
  enablePagination: PropTypes.bool,
  enableVirtualization: PropTypes.bool,
  fetchColumnMetaData: PropTypes.func,
  onDownloadCSV: PropTypes.func,
  showOptions: PropTypes.bool,
  maxHeightForVirtualization: PropTypes.number,
  itemHeightForVirtualization: PropTypes.number,
  showToolbar: PropTypes.bool,
  loading: PropTypes.bool,
  fetchData: PropTypes.func,
  enableControlledPagination: PropTypes.bool,
  rowsPerPageOptions: PropTypes.array,
  dataLength: PropTypes.number,
  initialPageSize: PropTypes.number,
  pageCount: PropTypes.number,

  getHeaderProps: PropTypes.func,
  getColumnProps: PropTypes.func,
  getRowProps: PropTypes.func,
  getCellProps: PropTypes.func,

  onTableStateChange: PropTypes.func,
  rowLevelOnHoverOptions: PropTypes.func,
};

export default ReactMuiTable;

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;
    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);
    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} />
      </>
    );
  }
);

function useControlledState(state, { instance }) {
  return React.useMemo(() => {
    if (state.groupBy.length) {
      return {
        ...state,
        hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
          (d, i, all) => all.indexOf(d) === i
        ),
      };
    }
    return state;
  }, [state]);
}
