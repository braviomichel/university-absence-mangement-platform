import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const NoticationAlert = (props) => {
return (
<Snackbar open={props.open} autoHideDuration={3000} onClose={props.handleClose}>
<MuiAlert severity={props.type} sx={{ width: '100%' }} onClose={props.handleClose}>
{props.message}
</MuiAlert>
</Snackbar>
);
};

export default NoticationAlert;

NoticationAlert.propTypes = {
open: PropTypes.bool.isRequired,
type: PropTypes.oneOf(['success', 'error', 'info', 'warning']).isRequired,
message: PropTypes.string.isRequired,
handleClose: PropTypes.func.isRequired,
};