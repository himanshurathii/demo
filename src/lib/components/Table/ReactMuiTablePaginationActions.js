import React from 'react';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {useTheme} from '@mui/material/styles';
import {makeStyles} from '@mui/styles';
import {Pagination} from '@mui/material';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const ReactMuiTablePaginationActions = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const {count, page, rowsPerPage, onPageChange} = props;

  const handlePageChange = (event, page) => {
    onPageChange(event, page - 1);
  };
  return (
    <div className={classes.root}>
      <Pagination
        count={
          count <= rowsPerPage && count / rowsPerPage === 0
            ? count / rowsPerPage
            : Math.max(0, Math.ceil(count / rowsPerPage))
        }
        page={page + 1}
       
        onChange={handlePageChange}
        color="primary"
        size="small"
        boundaryCount={3}
      />

    </div>
  );
};

ReactMuiTablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default ReactMuiTablePaginationActions;
