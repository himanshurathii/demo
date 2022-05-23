import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
export function LinearProgressWithLabel({
  value,
  progressBarWidth=100
}) {
  return (
    <Box display="flex" alignItems="center"  flexGrow={1}>
      <Box display="flex" flexGrow="1" flexDirection="column" mr={1}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box >
        <Typography variant="body2" color="textSecondary" noWrap={true}>{`${Math.round(
          value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};