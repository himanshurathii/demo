import React, { useState } from "react";
import { Tree, Input } from "antd";
import "antd/dist/antd.css";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Grid,
  FormControl,
  TextField,
  InputAdornment,
} from "@mui/material";
import * as _ from "lodash";
import { Search } from "@mui/icons-material";
const hasSearchTerm = (n, searchTerm) =>
  n.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
const filterData = (arr, searchTerm) =>
  arr?.filter(
    (n) =>
      hasSearchTerm(n.title, searchTerm) ||
      filterData(n.children, searchTerm)?.length > 0
  );
function filteredTreeData(data, searchString, checkedKeys, setExpandedTree) {
  let keysToExpand = [];
  const filteredData = searchString
    ? filterData(data, searchString).map((n) => {
        keysToExpand.push(n.key);
        return {
          ...n,
          children: filterData(n.children, searchString, checkedKeys),
        };
      })
    : data;
  setExpandedTree([...keysToExpand]);
  return filteredData;
}
const MultiSelectWithTree = ({
  preExpanded = [],
  value = [],
  name = "multiSelectWithTree",
  onBlur,
  error,
  helperText,
  disabled = false,
  label,
  modalTitle,
  itemsSelectedLabel = "Items Selected",
  onChange = () => {},
  treeData,
  alterCountsCalculation = {},
}) => {
  const [expandedKeys, setExpandedKeys] = useState(preExpanded);
  const [checkedKeys, setCheckedKeys] = useState(value);
  const [tree, setTree] = useState(treeData);
  const [searchValue, setSearchValue] = useState("");
  const [checkedKeysCount, setCheckedKeysCount] = useState(0);
  const [openModal, setOpenModal] = React.useState(false);
  const handleModalClose = () => {
    setOpenModal(false);
    onChange(checkedKeys);
    setSearchValue("");
    setExpandedKeys([]);
  };
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  React.useEffect(async () => {
    if (searchValue) {
      const filteredData = filteredTreeData(
        treeData,
        searchValue,
        checkedKeys,
        setExpandedKeys
      );
      await sleep(1000);
      setTree([...filteredData]);
    } else {
      await sleep(1000);
      setTree(treeData);
    }
  }, [searchValue, treeData, checkedKeys]);
  React.useEffect(() => {
    setCheckedKeys(value?.length ? value : []);
  }, [value]);
  React.useEffect(() => {
    let alteredCount = 0;
    let count = checkedKeys.filter((item) => {
      if (Object.keys(alterCountsCalculation).includes(item)) {
        alteredCount = alteredCount + alterCountsCalculation[item];
        return false;
      }
      return !treeData.filter((node) => node.title == item).length;
    }).length;
    setCheckedKeysCount(count + alteredCount);
  }, [checkedKeys, treeData, alterCountsCalculation]);
  const onExpand = (expandedKeysValue) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    //setAutoExpandParent(false);
  };
  React.useEffect(() => {}, [checkedKeys]);
  const onCheck = React.useCallback(
    (checkedKeysValue, e) => {
      if (e.checked) {
        if (e.node?.children?.length) {
          setCheckedKeys(
            _.union(
              checkedKeys,
              _.cloneDeep([
                ...e.node.key,
                ...e.node.children.map((child) => child.key),
              ])
            )
          );
        } else {
          setCheckedKeys(_.union(checkedKeys, [e.node.key]));
        }
      } else {
        if (e.node?.children?.length) {
          setCheckedKeys(
            _.union(
              checkedKeys.filter((item) => {
                return (
                  item !== e.node.key &&
                  !e.node.children.filter((child) => child.key === item).length
                );
              })
            )
          );
        } else {
          setCheckedKeys(
            _.cloneDeep(checkedKeys.filter((item) => item !== e.node.key))
          );
        }
      }
    },
    [searchValue, checkedKeys, setCheckedKeys]
  );
  return (
    <>
      <FormControl
        variant="outlined"
        size="small"
        name={name}
        error={Boolean(error)}
        fullWidth
      >
        <Box alignItems="center" flexDirection="row" display="flex">
          <TextField
            label={label}
            error={Boolean(error)}
            helperText={helperText}
            onBlur={onBlur}
            name={name}
            disabled={disabled}
            fullWidth
            value={
              checkedKeysCount
                ? checkedKeysCount + " " + itemsSelectedLabel
                : ""
            }
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            size="small"
            onClick={() => (!disabled ? setOpenModal(true) : "")}
          ></TextField>
        </Box>
      </FormControl>
      <Dialog
        disableBackdropClick={true}
        onClose={handleModalClose}
        aria-labelledby="multi-select-dialog-title"
        open={openModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          id="multi-select-dialog-title"
          onClose={handleModalClose}
          disableTypography
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography color="primary" variant="subtitle1">
              {modalTitle}
            </Typography>
            {handleModalClose ? (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box mr={3}>
                  <Typography color="primary" variant="subtitle1">
                    {checkedKeysCount} {itemsSelectedLabel}
                  </Typography>
                </Box>
                <IconButton
                  aria-label="close"
                  onClick={handleModalClose}
                  size="small"
                >
                  <CloseIcon size="small" />
                </IconButton>
              </Box>
            ) : null}
          </Box>
        </DialogTitle>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          pl={5}
          pr={5}
          mb={2}
        >
          <FormControl fullWidth>
            <TextField
              size="small"
              type="search"
              value={searchValue}
              placeholder="Search..."
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (e.target.value == "") {
                  setExpandedKeys([]);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton edge="start" size="small">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Box>
        <DialogContent dividers style={{ minHeight: 150 }}>
          <Grid container>
            <Grid item xs={12}>
              <Box>
                <Tree
                  checkable
                  onExpand={onExpand}
                  titleRender={(nodeData) => {
                    const index = nodeData.title
                      .toLowerCase()
                      .indexOf(searchValue.toLowerCase());
                    const beforeStr = nodeData.title.substr(0, index);
                    const afterStr = nodeData.title.substr(
                      index + searchValue?.length
                    );
                    const searchedString = nodeData.title.substr(
                      index,
                      searchValue?.length
                    );
                    let countSelectedChilds = 0;
                    if (nodeData.children?.length) {
                      nodeData.children.forEach((child) => {
                        if (checkedKeys?.includes(child.key)) {
                          countSelectedChilds++;
                        }
                      });
                    }
                    return index > -1 ? (
                      <span>
                        {beforeStr}
                        <span className="site-tree-search-value">
                          {searchedString}
                        </span>{" "}
                        {afterStr}{" "}
                        {countSelectedChilds ? (
                          <span>({countSelectedChilds})</span>
                        ) : (
                          ""
                        )}
                      </span>
                    ) : (
                      <span>{nodeData.title}</span>
                    );
                  }}
                  autoExpandParent={true}
                  onCheck={onCheck}
                  checkedKeys={checkedKeys}
                  expandedKeys={expandedKeys}
                  treeData={tree}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default MultiSelectWithTree;
