import React from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles((theme) => ({

	divider: {
		cursor: "pointer",
		background: "linear-gradient(to top right, rgba(255,255,255,0) 0%,rgba(255,255,255,0) calc(50% - 0.8px),rgba(255,255,255,1) 50%,rgba(255,255,255,0) calc(50% + 0.8px),rgba(255,255,255,0) 100%)"
	}	

}));

const ReactMuiTableRowColumnCountCell = ({ row }) => {
	const classes = useStyles();

	return (
		<Box className={classes.divider} display="flex" height="100%" width="100%" justifyContent="space-between">
			<Box display="flex" alignItems="flex-end"  marginBottom={-0.6} title="Number of rows" >
			<Typography >{row?.data?.length}</Typography>

			</Box>
			<Box display="flex" alignItems="flex-start"  marginTop={-0.6} title="Number of columns">
				<Typography  >
					{row?.columns?.length}
				</Typography>
			</Box>
		</Box>
	);
};

export default ReactMuiTableRowColumnCountCell;
