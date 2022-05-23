import React from 'react';
import {Box, Typography} from '@mui/material';
import PopoverMenus from '../../Menus/PopoverMenus';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DuplicateRowModal from '../Modals/DuplicateRowModal';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteRowModal from '../Modals/DeleteRowModal';
import AddRowsModal from '../Modals/AddRowsModal';
import FindDuplicateRowsModal from '../Modals/FindDulicateRowsModal';

const ReactMuiCellWithOptions = ({column, row, ...props}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showDuplicateRowModal, setShowDuplicateRowModal] =
    React.useState(false);
  const [showDeleteRowModal, setShowDeleteRowModal] =
    React.useState(false);
  const [showAddRowModal, setShowAddRowModal] = React.useState(false);
  const [showFindDuplicateRowsModal, setShowFindDuplicateRowsModal] =
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
    ? 'ReactMuiRowWithOptions-Popover'
    : undefined;

  const menus = [
    {
      label: 'Duplicate Row',
      icon: <FileCopyIcon />,
      onClick: () => {
        setShowDuplicateRowModal(true);
      },
    },
    {
      label: 'Find Duplicate Rows',
      icon: <FileCopyIcon />,
      onClick: () => {
        setShowFindDuplicateRowsModal(true);
      },
    },
    {
      label: 'Delete Row',
      icon: <DeleteIcon />,
      onClick: () => {
        setShowDeleteRowModal(true);
      },
    },
    {
      label: 'Add Rows',
      icon: <PlaylistAddIcon />,
      onClick: () => {
        setShowAddRowModal(true);
      },
    },
  ];
  console.log(row);
  return (
    <Box onContextMenu={handleClick}>
      <Typography
        component="div"
        title={row?.original?.pk ? row.original.pk : null}
      >
        {row?.original?.pk ? row?.original?.pk : null}
      </Typography>
      <PopoverMenus
        id={popOverID}
        open={open}
        handleClose={handleClose}
        anchorEl={anchorEl}
        menus={menus}
        setAnchorEl={setAnchorEl}
      />
      <DuplicateRowModal
        open={showDuplicateRowModal}
        setOpen={setShowDuplicateRowModal}
        onDuplicateRowCallback={() => {
          column?.optionsCallbacks?.onDuplicateRowCallback &&
            column?.optionsCallbacks?.onDuplicateRowCallback({
              column,
              row,
              ...props,
            });
        }}
      />
      <FindDuplicateRowsModal
        open={showFindDuplicateRowsModal}
        setOpen={setShowFindDuplicateRowsModal}
        row={row}
        onFindDulicateRowsCallback={() => {
          column?.optionsCallbacks?.onFindDulicateRowsCallback &&
            column?.optionsCallbacks?.onFindDulicateRowsCallback({
              column,
              row,
              ...props,
            });
        }}
      />
      <DeleteRowModal
        open={showDeleteRowModal}
        setOpen={setShowDeleteRowModal}
        row={row}
        onDeleteRowCallback={() => {
          column?.optionsCallbacks?.onDeleteRowCallback &&
            column?.optionsCallbacks?.onDeleteRowCallback({
              column,
              row,
              ...props,
            });
        }}
      />
      <AddRowsModal
        columns={props.data}
        columnMetaData={column.columnMetaData}
        open={showAddRowModal}
        setOpen={setShowAddRowModal}
        onAddRowCallback={(values) => {
          column?.optionsCallbacks?.onAddRowCallback &&
            column?.optionsCallbacks?.onAddRowCallback(values, {
              column,
              row,
              ...props,
            });
        }}
      />
    </Box>
  );
};

export default ReactMuiCellWithOptions;
