import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: 15,
  },
}));

const Request = ({ ...props }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper} {...props}>
      <Typography align="center">
        Solicitar licencia
      </Typography>
    </Paper>
  );
};

export default Request;
