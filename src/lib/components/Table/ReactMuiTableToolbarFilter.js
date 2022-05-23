import React from 'react';

import InputBase from '@mui/material/InputBase';
import {alpha} from '@mui/material/styles';
import {makeStyles} from '@mui/styles';
import PropTypes from 'prop-types';
import SearchIcon from '../../assets/icons/SearchIcon.svg';

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(0),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
    paddingLeft: theme.spacing(5),
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    top: 0,
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 7, 1, 1),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
}));

const ReactMuiTableToolbarFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  dataLength,
}) => {
  const classes = useStyles();
  const count = preGlobalFilteredRows.length;

  // Global filter only works with pagination from the first page.
  // This may not be a problem for server side pagination when
  // only the current page is downloaded.

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <img
          height={20}
          width={20}
          src={SearchIcon}
          alt="searchIcon"
        />
      </div>
      <InputBase
        value={globalFilter || ''}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`${dataLength ? dataLength : count} records...`}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{'aria-label': 'search'}}
      />
    </div>
  );
};

ReactMuiTableToolbarFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

export default ReactMuiTableToolbarFilter;
