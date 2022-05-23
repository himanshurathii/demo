import React from "react";
import { Box, Typography } from "@mui/material";
import PopoverMenus from "../../Menus/PopoverMenus";
import RenameColumnModal from "../Modals/RenameColumnModal";
import DeleteColumnModal from "../Modals/DeleteColumnModal";
import DuplicateColumnModal from "../Modals/DuplicateColumnModal";
import AddColumnModal from "../Modals/AddColumnModal";
import ManageSpacesModal from "../Modals/ManageSpacesModal";
import ManageCasesModal from "../Modals/ManageCasesModal";
import SplitColumnModal from "../Modals/SplitColumnModal";
import FindAndReplaceModal from "../Modals/FindAndReplaceModal";
import SortColumnModal from "../Modals/SortColumnModal";
import EmbeddedValuesModal from "../Modals/EmbeddedValuesModal";
import IntegrityRulesModal from "../Modals/IntegrityRulesModal";
import ScoresModal from "../Modals/ScoresModal";
import StandardisationErrorModal from "../Modals/StandardisationErrorModal";
import FindDuplicateColumnsModal from "../Modals/FindDuplicateColumnsModal";
import { Assets } from "../../../assets";

const ReactMuiColumnHeaderWithOptions = ({ column, ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showRenameModal, setShowRenameModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = React.useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = React.useState(false);
  const [showManageSpacesModal, setShowManageSpacesModal] =
    React.useState(false);
  const [showManageCasesModal, setShowManageCasesModal] = React.useState(false);
  const [showSplitColumnModal, setShowSplitColumnModal] = React.useState(false);
  const [showFindAndReplaceModal, setShowFindAndReplaceModal] =
    React.useState(false);

  const [showSortColumnModal, setShowSortColumnModal] = React.useState(false);
  const [showFindDuplicateModal, setShowFindDuplicateModal] =
    React.useState(false);

  // Data Quality opeartions state
  const [showStandardisationErrorModal, setShowStandardisationErrorModal] =
    React.useState(false);
  const [showIntegrityRulesModal, setShowIntegrityRulesModal] =
    React.useState(false);
  const [showScoresModal, setShowScoresModal] = React.useState(false);
  const [showEmbeddedValuesModal, setShowEmbeddedValuesModal] =
    React.useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popOverID = open
    ? "ReactMuiColumnHeaderWithOptions-Popover"
    : undefined;

  const menus = [
    {
      label: "Rename",
      icon: (
        <img
          src={Assets.RenameOperationIcon}
          alt="RenameIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowRenameModal(true);
      },
    },
    {
      label: "Delete",
      icon: (
        <img
          src={Assets.DeleteOperationIcon}
          alt="DeleteIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowDeleteModal(true);
      },
    },
    {
      label: "Create Duplicate",
      icon: (
        <img
          src={Assets.DuplicateOperationIcon}
          alt="DuplicateColIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowDuplicateModal(true);
      },
    },
    {
      label: "Find Duplicate",
      icon: (
        <img
          src={Assets.DuplicateOperationIcon}
          alt="DuplicateColIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowFindDuplicateModal(true);
      },
    },
    {
      label: "Add Column",
      icon: (
        <img
          src={Assets.AddColumnOperationIcon}
          alt="AddColumnIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowAddColumnModal(true);
      },
    },
    column?.columnMetaData[column?.index]?.data_type?.toLowerCase() ===
      "text" && {
      label: "Manage Spaces",
      icon: (
        <img
          src={Assets.ManageSpacesOperationIcon}
          alt="ManageSpaceIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowManageSpacesModal(true);
      },
    },
    column?.columnMetaData[column?.index]?.data_type?.toLowerCase() ===
      "text" && {
      label: "Manage Cases",
      icon: (
        <img
          src={Assets.ManageCasesOperationIcon}
          alt="ManageCasesIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowManageCasesModal(true);
      },
    },
    column?.columnMetaData[column?.index]?.data_type?.toLowerCase() ===
      "text" && {
      label: "Split Column",
      icon: (
        <img
          src={Assets.SplitColumnOperationIcon}
          alt="SplitIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowSplitColumnModal(true);
      },
    },
    {
      label: "Find & Replace",
      icon: (
        <img
          src={Assets.FindAndReplaceOperationIcon}
          alt="FindAndReplaceIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowFindAndReplaceModal(true);
      },
    },
    {
      label: "Sort",
      icon: (
        <img
          src={Assets.SortColOperationIcon}
          alt="SortIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowSortColumnModal(true);
      },
    },
    {
      label: "Analyse",
      icon: (
        <img
          src={Assets.AnalyseOperationIcon}
          alt="AnalyseIcon"
          height={25}
          width={23}
        />
      ),

      onClick: () => {
        column?.optionsCallbacks?.onAnalyseCallback &&
          column?.optionsCallbacks?.onAnalyseCallback({
            column,
            ...props,
          });
      },
    },
    {
      label: "Standardisation Error",
      icon: (
        <img
          src={Assets.StdErrorOperationIcon}
          alt="StandardisationErrorIcon"
          height={23}
          width={23}
        />
      ),
      onClick: () => {
        setShowStandardisationErrorModal(true);
      },
    },
    {
      label: "Integrity Rules",

      icon: (
        <img
          src={Assets.IntegrityValuesOperationIcon}
          alt="IntegrityRulesIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowIntegrityRulesModal(true);
      },
    },
    column?.columnMetaData[column?.index]?.data_type?.toLowerCase() ===
      "text" && {
      label: "Embedded Values",

      icon: (
        <img
          src={Assets.EmbeddedValuesOperationIcon}
          alt="EmbeddedValuesIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        setShowEmbeddedValuesModal(true);
      },
    },
    {
      label: "Uniqueness",
      icon: (
        <img
          src={Assets.UniquenessOperationIcon}
          alt="UniquenessIcon"
          height={25}
          width={23}
        />
      ),
      onClick: () => {
        column?.optionsCallbacks?.onUniquenessCallback &&
          column?.optionsCallbacks?.onUniquenessCallback({
            column,
            ...props,
          });
      },
    },
    {
      label: "Scores",
      icon: (
        <img
          src={Assets.ScoresOperationIcon}
          alt="ScoresIcon"
          height={25}
          width={23}
        />
      ),

      onClick: () => {
        setShowScoresModal(true);
      },
    },
  ];

  return (
    <Box
      whiteSpace="noWrap"
      overflow="hidden"
      style={{ cursor: "pointer" }}
      width="100%"
      display="flex"
      alignItems={"center"}
      flexDirection="row"
    >
      <Box onClick={handleClick} mt={-0.5}>
        <img
          src={Assets.ColumnOperationsDownIcon}
          alt="ColumnOperationsDownIcon"
          height={12}
          width={11}
        />
      </Box>
      <Box ml={1} component="div" title={column.id}>
        {column.id}
      </Box>

      <PopoverMenus
        id={popOverID}
        open={open}
        handleClose={handleClose}
        anchorEl={anchorEl}
        menus={menus}
        setAnchorEl={setAnchorEl}
      />
      <RenameColumnModal
        open={showRenameModal}
        setOpen={setShowRenameModal}
        onRenameCallback={(values) => {
          column?.optionsCallbacks?.onRenameCallback &&
            column?.optionsCallbacks?.onRenameCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <DeleteColumnModal
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        onDeleteCallback={() => {
          column?.optionsCallbacks?.onDeleteCallback &&
            column?.optionsCallbacks?.onDeleteCallback({
              column,
              ...props,
            });
        }}
        column={column}
      />
      <DuplicateColumnModal
        open={showDuplicateModal}
        setOpen={setShowDuplicateModal}
        onDuplicateCallback={(values) => {
          column?.optionsCallbacks?.onDuplicateCallback &&
            column?.optionsCallbacks?.onDuplicateCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <FindDuplicateColumnsModal
        open={showFindDuplicateModal}
        setOpen={setShowFindDuplicateModal}
        column={column}
        onFindDulicateColumnsCallback={(values) => {
          column?.optionsCallbacks?.onFindDulicateColumnsCallback &&
            column?.optionsCallbacks?.onFindDulicateColumnsCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <AddColumnModal
        open={showAddColumnModal}
        setOpen={setShowAddColumnModal}
        onAddColumnCallback={(values) => {
          column?.optionsCallbacks?.onAddColumnCallback &&
            column?.optionsCallbacks?.onAddColumnCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <ManageSpacesModal
        open={showManageSpacesModal}
        setOpen={setShowManageSpacesModal}
        onManageSpacesCallback={(values) => {
          column?.optionsCallbacks?.onManageSpacesCallback &&
            column?.optionsCallbacks?.onManageSpacesCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <ManageCasesModal
        open={showManageCasesModal}
        setOpen={setShowManageCasesModal}
        onManageCasesCallback={(values) => {
          column?.optionsCallbacks?.onManageCasesCallback &&
            column?.optionsCallbacks?.onManageCasesCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <SplitColumnModal
        open={showSplitColumnModal}
        setOpen={setShowSplitColumnModal}
        onSplitColumnCallback={(values) => {
          column?.optionsCallbacks?.onSplitColumnCallback &&
            column?.optionsCallbacks?.onSplitColumnCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <FindAndReplaceModal
        open={showFindAndReplaceModal}
        setOpen={setShowFindAndReplaceModal}
        onFindAndReplaceCallback={(values) => {
          column?.optionsCallbacks?.onFindAndReplaceCallback &&
            column?.optionsCallbacks?.onFindAndReplaceCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <SortColumnModal
        open={showSortColumnModal}
        setOpen={setShowSortColumnModal}
        onSortColumnCallback={(values) => {
          column?.optionsCallbacks?.onSortColumnCallback &&
            column?.optionsCallbacks?.onSortColumnCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <EmbeddedValuesModal
        open={showEmbeddedValuesModal}
        setOpen={setShowEmbeddedValuesModal}
        onEmbeddedValuesCallback={(values) => {
          column?.optionsCallbacks?.onEmbeddedValuesCallback &&
            column?.optionsCallbacks?.onEmbeddedValuesCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <IntegrityRulesModal
        open={showIntegrityRulesModal}
        setOpen={setShowIntegrityRulesModal}
        datasetList={column?.datasetList ? column?.datasetList : []}
        activeDataset={
          column?.activeDataset ? column?.activeDataset : "table288"
        }
        fetchColumnMetaData={column?.fetchColumnMetaData}
        projectId={column?.projectId}
        column={column}
        onIntegrityRulesCallback={(values) => {
          column?.optionsCallbacks?.onIntegrityRulesCallback &&
            column?.optionsCallbacks?.onIntegrityRulesCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <ScoresModal
        open={showScoresModal}
        setOpen={setShowScoresModal}
        columns={props?.columns ? props?.columns : []}
        columnMetaData={column?.columnMetaData ? column?.columnMetaData : []}
        onScoresCallback={(values) => {
          column?.optionsCallbacks?.onScoresCallback &&
            column?.optionsCallbacks?.onScoresCallback(values, {
              column,
              ...props,
            });
        }}
      />
      <StandardisationErrorModal
        open={showStandardisationErrorModal}
        setOpen={setShowStandardisationErrorModal}
        columns={props?.columns ? props?.columns : []}
        columnMetaData={column?.columnMetaData ? column?.columnMetaData : []}
        onStandardisationErrorCallback={(values) => {
          column?.optionsCallbacks?.onStandardisationErrorCallback &&
            column?.optionsCallbacks?.onStandardisationErrorCallback(values, {
              column,
              ...props,
            });
        }}
      />
    </Box>
  );
};

export default ReactMuiColumnHeaderWithOptions;
