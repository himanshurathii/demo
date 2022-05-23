import React from 'react';
import {Box,Popover, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(1),
  },
  boxStyle: {
    '&:hover': {
      background: theme.palette.grey[100],
      cursor: 'pointer',
    },
  },
}));

const PopoverMenus = ({
  id,
  open,
  anchorEl,
  handleClose,
  menus,
  setAnchorEl,
}) => {
  const classes = useStyles();

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {menus.length > 0 &&
          menus.map((ele, i) => {
            return (
              ele.label && (
                <React.Fragment key={i + ele.label}>
                  <Box
                    minWidth={150}
                    p={1}
                    className={classes.boxStyle}
                    display="flex"
                    flexDirection="row"
                    onClick={() => {
                      ele.onClick();
                      setAnchorEl(null);
                    }}
                  >
                    <Box mr={1}>{ele.icon}</Box>
                    <Box ml={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'primary.main',
                          opacity: 0.5,
                        }}
                      >
                        {ele.label}
                      </Typography>
                    </Box>
                  </Box>
                </React.Fragment>
              )
            );
          })}
      </Popover>
    </>
  );
};

export default PopoverMenus;
