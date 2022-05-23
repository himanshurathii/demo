import React from "react";
import "./App.css";
import {
  ReactMuiTable,
  LinearProgressWithLabel,
  EditableCell,
  ReactMuiColumnHeaderWithOptions,
  ReactMuiTableColumnHeaderTextEllipsis,
  MultiSelect,
  MultiSelectWithTree,
  MuiDatePicker,
} from "./lib";
import { ThemeProvider } from "@mui/material/styles";
import { Box, ButtonGroup, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { createTheme } from "@mui/material/styles";
import _ from "lodash";

const MultiSelectFormSchema = Yup.object().shape({
  listType: Yup.array()
    .of(Yup.string())
    .min(1, "Required!")
    .required("Required!"),
  list: Yup.array().of(Yup.string()).min(1, "Required!").required("Required!"),
  date: Yup.date().required("Required!").typeError("Invalid Date!"),
});
const treeData = [
  {
    title: "APAC Watchlists",
    key: "APAC Watchlists",
    children: [
      {
        title: "Colombia Open Data",
        key: "Colombia Open Data",
        checked: false,
      },
      {
        title: "Department of foreign affairs and trade Australia",
        key: "Department of foreign affairs and trade Australia",
        checked: false,
      },
      {
        title: "North Korea sanction List",
        key: "North Korea sanction List",
        checked: false,
      },
      {
        title: "People's Daily",
        key: "People's Daily",
        checked: false,
      },
    ],
  },
];

const defaultData = [
  {
    col1: 1,
    col2: 66,
    col3: 4,
    col4: 7,
    col5: 12,
    col6: 123,
  },
  {
    col1: 2,
    col2: 56,
  },
  {
    col1: 3,
    col2: 66,
  },
  {
    col1: 4,
    col2: 56,
  },
  {
    col1: 5,
    col2: 66,
  },
  {
    col1: 6,
    col2: 56,
  },
  {
    col1: 7,
    col2: 66,
  },
  {
    col1: 8,
    col2: 56,
  },
  {
    col1: 9,
    col2: 66,
  },
  {
    col1: 10,
    col2: 56,
  },
  {
    col1: 11,
    col2: 66,
  },
];

function App() {
  const theme = createTheme({});
  const [skipPageReset, setSkipPageReset] = React.useState(true);
  const [data, setData] = React.useState(defaultData);

  const columnOptionsCallbacks = {
    onDeleteCallback: ({ state }) => {},
    onRenameCallback: (newColumnName, { state }) => {},
    onDuplicateCallback: (value, state) => {},
  };
  const tableColumns = [
    {
      Header: ReactMuiColumnHeaderWithOptions,
      accessor: "pk",
      optionsCallbacks: columnOptionsCallbacks,
      heading: "Row Id",
    },
    {
      Header: ReactMuiColumnHeaderWithOptions,
      accessor: "col2",
      optionsCallbacks: columnOptionsCallbacks,
      heading: "col2",

      Cell: EditableCell,
    },
    {
      Header: ReactMuiColumnHeaderWithOptions,
      accessor: "col3",
      optionsCallbacks: columnOptionsCallbacks,
      heading: "col3",
    },
    {
      Header: ReactMuiTableColumnHeaderTextEllipsis,
      heading: "col4",
      accessor: "col4",
    },
    {
      Header: ReactMuiTableColumnHeaderTextEllipsis,
      accessor: "col5",
      heading: "col5",
    },
    {
      Header: ReactMuiTableColumnHeaderTextEllipsis,
      accessor: "col6",
      heading: "col6",
    },
    {
      Header: ReactMuiTableColumnHeaderTextEllipsis,
      accessor: "col7",
      heading: "col7",
    },
  ];
  const MultiSelectForm = useFormik({
    initialValues: {
      listType: ["Sanctions", "NNS", "PEP"],
      list: [],
      date: new Date(),
    },
    validationSchema: MultiSelectFormSchema,
    onSubmit: (values) => {},
  });
  const handleUserNameChange = (date) => {
    MultiSelectForm.setFieldValue("date", date);
  };
  React.useEffect(() => {
    const checked = [];

    treeData.forEach((data) => {
      data.children.forEach((item) => {
        if (item.checked) {
          checked.push(item.key);
        }
      });
    });
    MultiSelectForm.setFieldValue("list", checked);
  }, [treeData]);

  const fetchIdRef = React.useRef(0);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);

  const fetchRowsData = React.useCallback(
    ({ datasetId, pageSize, pageIndex }) => {
      const arr = [];
      for (let i = 1; i <= 500; i++) {
        let obj = {
          pk: i,
          col2: Math.floor(Math.random() * 300),
          col3: "text",
          col4: "123.6",
          col5: Math.floor(Math.random() * 30000),
          col6: Math.floor(Math.random() * 3000),
          col7: Math.floor(Math.random() * 3),
        };
        arr.push(obj);
      }
      const fetchId = ++fetchIdRef.current;

      setLoading(true);
      setTimeout(() => {
        if (fetchId === fetchIdRef.current) {
          const startRow = pageSize * pageIndex;
          const endRow = startRow + pageSize;
          const newArr = arr.slice(startRow, endRow);
          setData(newArr);

          setPageCount(Math.ceil(arr.length / pageSize));

          setLoading(false);
        }
      }, 1000);
    },
    []
  );

  const fetchData = React.useCallback(
    (pageIndex = 0, pageSize = 100) => {
      const datasetId = 15;

      if (datasetId) {
        fetchRowsData({ datasetId, pageSize, pageIndex });
      }
    },
    [fetchRowsData]
  );

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const [highlightCallBack, setHighlightCallback] = React.useState({
    callBack: "",
  });

  const highlightOperationResults = (highlightCallBackFunc) => {
    setHighlightCallback({
      callBack: highlightCallBackFunc,
    });
  };

  const handleResultsClick = () => {
    const operation = "Uniqueness";
    const resultsData = [3, 2, 6];
    highlightCallBack.callBack(operation, resultsData, "Col3");
  };

  const onRowClick = (row, toggleAllRowsSelected) => {
    if (!row.isSelected) {
      toggleAllRowsSelected(false);
    }
    row.toggleRowSelected();
    //
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Box marginTop={100}>
          <Grid>
            <MultiSelect
              label="List Type"
              onChange={MultiSelectForm.handleChange}
              value={MultiSelectForm.values.listType}
              name="listType"
              error={MultiSelectForm.errors.listType}
              helperText={MultiSelectForm.errors.listType}
              opts={[
                { label: "AMS", value: "NNS" },
                { label: "PEP", value: "PEP" },
                { label: "Sanctions", value: "Sanctions" },
              ]}
              variant="outlined"
              size="small"
              noLaunchIcon={true}
              showLimited={false}
            />
          </Grid>
          <Grid item xs={2}>
            <MultiSelectWithTree
              label="Select Sanctions list"
              modalTitle="Select required Sanctions List from below"
              onChange={(newVal) => {
                MultiSelectForm.setFieldValue("list", newVal);
              }}
              value={
                MultiSelectForm.values.list ? MultiSelectForm.values.list : []
              }
              name="list"
              onBlur={MultiSelectForm.handleBlur}
              error={
                MultiSelectForm.touched.list && MultiSelectForm.errors.list
              }
              helperText={
                MultiSelectForm.touched.list && MultiSelectForm.errors.list
              }
              variant="outlined"
              size="small"
              treeData={treeData?.length ? treeData : []}
            />
          </Grid>
          <button onClick={handleResultsClick}>Click Me</button>
          <Grid item xs={2}>
            <MuiDatePicker
              // commented to avoid console errors in nimbus
              disableFuture
              label="Responsive"
              format="yyyy/MM/DD"
              value={MultiSelectForm.values.date}
              error={Boolean(MultiSelectForm.errors.date)}
              helperText={MultiSelectForm.errors.date}
              onChange={handleUserNameChange}
            />
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
