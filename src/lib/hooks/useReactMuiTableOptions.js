import {useEffect, useState} from 'react';
import {useTheme} from '@mui/material/styles';
import spelling from 'spelling';
import dictionary from 'spelling/dictionaries/en_US';

var dict = new spelling(dictionary);

export default function useReactMuiTableOptions(
  dataSetName,
  projectId,
  fetchColumnMetaData = () => {},
  highlightCells,
) {
  const theme = useTheme();
  const initialOptionConfig = {
    heatGrid: false,
    highlightMissing: false,
    highlightRange: false,
    highlightDatatypes: false,
    showHideColumn: false,
    groupColumns: false,
    highlightIllegalValues: false,
    highlightMisspell: false,
    highlightMisfield: false,
    highlightWithRegex: false,
  };

  // Range Modal Data
  const [highlightRangeFormData, setHighlightRangeFormData] =
    useState([]);

  // Highlight Illegal values form data
  const [
    highlightIllegalValuesFormData,
    setHighlightIllegalValuesFormData,
  ] = useState({});

  // Highlight Misfield form data
  const [highlightMisfieldFormData, setHighlightMisfieldFormData] =
    useState({});

  // Highlight With Regex form data
  const [highlightWithRegexFormData, setHighlightWithRegexFormData] =
    useState({});

  const cellStyles = {
    highlightMissing: {
      bg: '#F4B2B6',
    },
    highlightRange: {
      bg: '#FDE5AA',
    },
    highlightIllegalValues: {
      bg: '#C6CFFF',
    },
    highlightMisspell: {
      bg: '#DEF0B8',
    },
    highlightMisfield: {
      bg: '#C6FFE8',
    },
    highlightWithRegex: {
      bg: '#AAD6FF',
    },
    highlightGenericTaskData: {
      bg: '#F9BCE4',
    },
  };

  const dataTypeColorMapping = {
    // String  Datatypes 
    'character varying': '#F4B2B6',
    varchar: '#8E94B6',
    character: '#C5EAFF',
    text: '#FFD3B4',
    blob: '#FEC65C',
    enum: '#C3C3C3',
    binary: '#C9FDFD',
    varbinary: '#FE797B',
    string: '#99FFB6',

    //Integer Datatypes 
    smallint: '#E9AC72',
    integer: '#DEF0B8',
    bigint: '#C6CFFF',
    decimal: '#F4F9BF',
    numeric: '#E9D7FF',
    real: '#F0CB7B',
    'double precision': '#8AC8BB',
    smallserial: '#D0D6A6',
    serial: '#91999C',
    bigserial: '#CEE68A',
    bit: '#96C781',
    tinyint: '#59D0B9',
    mediumint: '#CBFBFF',
    float: '#FDE5AA',

    // Date datatypes 
    'timestamp with time zone': '#FDDA99',
    'timestamp without time zone': '#f44336',
    timestamp: '#C6FFE8',
    datetime: '#AAD6FF',
  };

  const [datasetColumnDetails, setDatasetColumnDetails] = useState(
    [],
  );

  const [optionsConfig, setOptionConfig] = useState(
    initialOptionConfig,
  );
  const [currentOperation, setCurrentOperation] = useState('');

  useEffect(() => {
    if (dataSetName && projectId) {
      fetchDatasetColumnDetails(dataSetName, projectId);
    }
  }, [dataSetName, projectId]);

  const fetchDatasetColumnDetails = (
    activeDataset,
    activeProject,
  ) => {
    fetchColumnMetaData(
      {
        table_name: activeDataset,
        project_id: activeProject,
      },
      (resp) => {
        setDatasetColumnDetails(resp.data);
      },
      () => {},
    );
  };

  const applyHeatGrid = (enableHeatgrid) => {
    setOptionConfig(initialOptionConfig);
    setCurrentOperation('Heat Grid');
    enableHeatgrid &&
      setOptionConfig((prevState) => {
        prevState.heatGrid = enableHeatgrid;
        return {...prevState};
      });
  };

  const applyHighlightMissing = (enableHighlightMissing) => {
    setOptionConfig(initialOptionConfig);
    setCurrentOperation('Highlight Missing');
    enableHighlightMissing &&
      setOptionConfig((prevState) => {
        prevState.highlightMissing = enableHighlightMissing;
        return {...prevState};
      });
  };

  const applyGroupColumns = (enableApplyGroupCol) => {
    setOptionConfig(initialOptionConfig);
    setCurrentOperation('Group Column');
    enableApplyGroupCol &&
      setOptionConfig((prevState) => {
        prevState.groupColumns = enableApplyGroupCol;
        return {...prevState};
      });
  };

  const applyHighlightRange = (enableHighlightRange) => {
    setOptionConfig(initialOptionConfig);
    setCurrentOperation('Highlight Range');
    enableHighlightRange &&
      setOptionConfig((prevState) => {
        prevState.highlightRange = enableHighlightRange;
        return {...prevState};
      });
  };
  const applyHighlightDataTypes = (enableHighlightDatatypes) => {
    setOptionConfig(initialOptionConfig);
    setCurrentOperation('Highlight Datatype');
    enableHighlightDatatypes &&
      setOptionConfig((prevState) => {
        prevState.highlightDatatypes = enableHighlightDatatypes;
        return {...prevState};
      });
    fetchDatasetColumnDetails(dataSetName, projectId);
  };
  const applyShowHideColumn = (enableShowHideColumn) => {
    setOptionConfig(initialOptionConfig);
    setCurrentOperation('Show/Hide Columns');
    enableShowHideColumn &&
      setOptionConfig((prevState) => {
        prevState.showHideColumn = enableShowHideColumn;
        return {...prevState};
      });
  };

  const applyHighlightIllegalValues = (
    enableHighlightIllegalValues,
  ) => {
    setOptionConfig(initialOptionConfig);
    setCurrentOperation('Highlight Illegal Values');
    enableHighlightIllegalValues &&
      setOptionConfig((prevState) => {
        prevState.highlightIllegalValues =
          enableHighlightIllegalValues;
        return {...prevState};
      });
  };
  const applyHighlightMisspell = (enableHighlightMisspell) => {
    setOptionConfig(initialOptionConfig);
    setCurrentOperation('Highlight Misspell');
    enableHighlightMisspell &&
      setOptionConfig((prevState) => {
        prevState.highlightMisspell = enableHighlightMisspell;
        return {...prevState};
      });
  };
  const applyHighlightMisfield = (enableHighlightMisfield) => {
    setOptionConfig(initialOptionConfig);
    setCurrentOperation('Highlight Misfield');
    enableHighlightMisfield &&
      setOptionConfig((prevState) => {
        prevState.highlightMisfield = enableHighlightMisfield;
        return {...prevState};
      });
  };
  const applyHighlightWithRegex = (enableHighlightWithRegex) => {
    setOptionConfig(initialOptionConfig);
    setCurrentOperation('Highlight with Regex');
    enableHighlightWithRegex &&
      setOptionConfig((prevState) => {
        prevState.highlightWithRegex = enableHighlightWithRegex;
        return {...prevState};
      });
  };

  // This is the function used for highlighting operations ----------------------------------------->
  const highlightCell = (cell) => {
    switch (currentOperation) {
      // For Heatgrid --------------------------------------------->
      case 'Heat Grid':
        if (
          cell?.value &&
          cell?.value !== null &&
          typeof cell.value !== 'string'
        ) {
          return `hsl(${
            1000 * ((1000 - cell.value) / 1000) * -1 + 1000
          }, 100%, 80%)`;
        }
        break;
      // For Highlight Missing/Blank values --------------------------------------------->
      case 'Highlight Missing':
        if (
          cell.value === isNaN ||
          cell.value === '' ||
          cell.value === null ||
          cell.value === undefined ||
          typeof cell.value === 'boolean'
        )
          return cellStyles.highlightMissing.bg;
        break;
      // For Highlight Range Option --------------------------------------------->
      case 'Highlight Range':
        // values for range highlight
        // ---- for single column---
        const equalValue =
          highlightRangeFormData[cell?.column?.id]?.equalsTo;
        const greaterValue =
          highlightRangeFormData[cell?.column?.id]?.greaterThan;
        const smallerValue =
          highlightRangeFormData[cell?.column?.id]?.lessThan;

        // ------ for all columns -----
        const equalValueAllCols =
          highlightRangeFormData['Apply to All Columns']?.equalsTo;
        const greaterValueAllCols =
          highlightRangeFormData['Apply to All Columns']?.greaterThan;
        const smallerValueAllCols =
          highlightRangeFormData['Apply to All Columns']?.lessThan;

        // operator values for range highlight
        // ---- for single column---
        const op1 =
          highlightRangeFormData[cell?.column?.id]?.operator1;
        const op2 =
          highlightRangeFormData[cell?.column?.id]?.operator2;

        // ------ for all columns -----
        const op1AllCols =
          highlightRangeFormData['Apply to All Columns']?.operator1;
        const op2AllCols =
          highlightRangeFormData['Apply to All Columns']?.operator2;

        // Operator based conditions to evaluate the range based on provided inputs
        // ---- for single column---
        const condition = eval(
          `${
            equalValue
              ? 'eval(cell?.value === parseFloat(highlightRangeFormData[cell?.column?.id]?.equalsTo))'
              : ''
          } ${greaterValue ? op1 : ''}  ${
            greaterValue
              ? 'eval(cell?.value > parseFloat(highlightRangeFormData[cell?.column?.id]?.greaterThan))'
              : ''
          } ${smallerValue ? op2 : ''} ${
            smallerValue
              ? 'eval(cell?.value < parseFloat(highlightRangeFormData[cell?.column?.id]?.lessThan))'
              : ''
          } `,
        );

        // ------ for all columns -----
        const conditionAllCols = eval(
          `${
            equalValueAllCols
              ? "eval(cell?.value === parseFloat(highlightRangeFormData['Apply to All Columns']?.equalsTo))"
              : ''
          } ${greaterValueAllCols ? op1AllCols : ''}  ${
            greaterValueAllCols
              ? "eval(cell?.value > parseFloat(highlightRangeFormData['Apply to All Columns']?.greaterThan))"
              : ''
          } ${smallerValueAllCols ? op2AllCols : ''} ${
            smallerValueAllCols
              ? "eval(cell?.value < parseFloat(highlightRangeFormData['Apply to All Columns']?.lessThan))"
              : ''
          } `,
        );

        if (cell?.value || typeof cell.value !== 'string') {
          if (
            Object.keys(highlightRangeFormData).includes(
              'Apply to All Columns',
            )
          ) {
            if (conditionAllCols) {
              return cellStyles.highlightRange.bg;
            }
          }
          if (
            Object.keys(highlightRangeFormData).includes(
              cell?.column.id,
            )
          ) {
            if (condition) {
              return cellStyles.highlightRange.bg;
            }
          }
        }

        break;
      // For Highlight Datatypes Option --------------------------------------------->
      case 'Highlight Datatype':
        let cellColor = '';
        datasetColumnDetails.map((data) => {
          if (data.column_name === cell?.column?.id) {
            cellColor = dataTypeColorMapping[data.data_type];
          }
        });
        return cellColor;
      // For Highlight Illegal Values Option --------------------------------------->
      case 'Highlight Illegal Values':
        if (
          cell.value <
            parseFloat(highlightIllegalValuesFormData?.lowerLimit) ||
          cell.value >
            parseFloat(highlightIllegalValuesFormData?.upperLimit)
        ) {
          return cellStyles.highlightIllegalValues.bg;
        }
        break;
      // For Highlight Misspell Option -------------------------------------------->
      case 'Highlight Misspell':
        if (cell.value && typeof cell.value === 'string') {
          const regexCheckAlphabetical = new RegExp('^[a-zA-Z]*$');
          const isMisspell = !dict.lookup(cell.value)?.found;
          if (
            isMisspell &&
            regexCheckAlphabetical.test(cell?.value)
          ) {
            return cellStyles.highlightMisspell.bg;
          }
        }
        break;
      // For Highlight Misfield Option --------------------------------------------->
      case 'Highlight Misfield':
        const regexAlphaNumeric = new RegExp(
          '^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$',
        );
        const regexAlphabetical = new RegExp('^[a-zA-Z]*$');
        const regexNumeric = new RegExp(
          '^[+-]?([0-9]+.?[0-9]*|.[0-9]+)$',
        );
        if (
          highlightMisfieldFormData.datatype === 'alphanumeric' &&
          !regexAlphaNumeric.test(cell?.value)
        ) {
          return cellStyles.highlightMisfield.bg;
        }
        if (
          highlightMisfieldFormData.datatype === 'alphabetical' &&
          !regexAlphabetical.test(cell?.value)
        ) {
          return cellStyles.highlightMisfield.bg;
        }
        if (
          highlightMisfieldFormData.datatype === 'numeric' &&
          !regexNumeric.test(cell?.value)
        ) {
          return cellStyles.highlightMisfield.bg;
        }
        break;
      // For Highlight with regex Option --------------------------------------------->
      case 'Highlight with Regex':
        const regex = new RegExp(highlightWithRegexFormData?.regex);
        if (regex.test(cell.value))
          return cellStyles.highlightWithRegex.bg;
        break;

      // For DM >>> Data Quality/ Data Validation column level operations  ----------------------------->
      default:
        if (
          highlightCells?.columns?.includes(
            cell.column.heading.toLowerCase(),
          ) &&
          highlightCells?.pks?.includes(
            parseInt(cell.row.original.pk),
          )
        ) {
          return cellStyles.highlightGenericTaskData.bg;
        }
        if (highlightCells?.scoresData?.length) {
          var colors = '';
          highlightCells.scoresData.map((key) => {
            if (key.pks.includes(parseInt(cell.row.original.pk))) {
              colors = key.color_code;
            }
          });
          return colors;
        }
        return '';
    }
  };

  return {
    optionsConfig,
    applyHeatGrid,
    applyHighlightMissing,
    applyHighlightRange,
    highlightCell,
    applyHighlightDataTypes,
    fetchDatasetColumnDetails,
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
  };
}
