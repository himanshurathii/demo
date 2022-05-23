import React from 'react';
import {Box, Typography} from '@mui/material';

export default function ReactMuiTableColumnHeaderTextEllipsis({
  column,
}) {
  return (
    <Box
      whiteSpace="noWrap"
      overflow="hidden"
      style={{cursor: 'pointer'}}
      marginRight={1}
      display="flex"
      flexDirection="row"
    >
      <Box component="div" title={column.heading}>
        {column.heading}
      </Box>
    </Box>
  );
}
