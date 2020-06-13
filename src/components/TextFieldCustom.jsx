import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useField } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import { Error } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  field: {
    marginTop: 10,
  },
}));

const TextFieldCustom = ({ label, id, type = undefined, fullWidth, errors, ...props }) => {
  const classes = useStyles();
  const [field] = useField(props);
  return (
    <TextField className={classes.field} {...field} disabled={props.isSubmitting} error={!!errors[field.name]}
               variant="outlined" size="small"
               InputProps={errors[field.name] ? {
                 endAdornment: (
                   <InputAdornment position="end">
                     <Tooltip title={errors[field.name]}>
                       <Error/>
                     </Tooltip>
                   </InputAdornment>
                 ),
               } : null} fullWidth={fullWidth} label={label} id={id} type={type}/>
  );
};
export default TextFieldCustom;