import React from 'react';
import { useField } from 'formik';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const CheckBoxCustom = ({ label, isSubmitting, ...props }) => {
  const [field] = useField(props);
  return (
    <FormControlLabel
      control={
        <Checkbox {...props} {...field} />
      }
      label={label}
    />
  );
};
export default CheckBoxCustom;
