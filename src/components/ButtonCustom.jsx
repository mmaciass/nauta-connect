import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  btn: {
    borderRadius: 20,
  },
}));


const ButtonCustom = ({formikBag, fullWidth = true, text, onClick, ...props }) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.btn}
      variant="contained"
      fullWidth={fullWidth}
      color="primary"
      onClick={onClick}
      size="small"
      startIcon={
        formikBag.isSubmitting ? (
          <CircularProgress color="inherit" size={20}/>
        ) : (
          <ExitToAppIcon/>
        )
      }
      {...props}
    >
      {text}
    </Button>
  );
};

export default ButtonCustom;
