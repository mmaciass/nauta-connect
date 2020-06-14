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

const TextFieldCustom = ({
                           label, id, type = undefined, fullWidth, errors, isSubmitting,
                           next = undefined, submitAction = undefined, submitted, ...props
                         }) => {
  const classes = useStyles();
  const [field] = useField(props);
  return (
    <TextField {...props} className={classes.field} {...field} disabled={isSubmitting} error={submitted && !!errors[field.name]}
               variant="outlined" size="small" fullWidth={fullWidth} label={label} id={id} type={type}
               onKeyPress={event => {
                 if (event.key === 'Enter' && !!next) {
                   event.preventDefault();
                   next.focus();
                 } else if (event.key === 'Enter' && !!submitAction) {
                   event.preventDefault();
                   submitAction();
                 }
               }}
               InputProps={errors[field.name] ? {
                 endAdornment: (
                   <InputAdornment position="end">
                     <Tooltip title={errors[field.name]} arrow>
                       <Error/>
                     </Tooltip>
                   </InputAdornment>
                 ),
               } : null}/>
  );
};
export default TextFieldCustom;