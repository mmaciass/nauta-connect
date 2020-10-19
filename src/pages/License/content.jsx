import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Description from './description';
import Identity from './identity';
import Request from './request';
import Activate from './activate';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const Content = ({ ...props }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Description/>
      <Identity/>

      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={7}>
          <Request/>
        </Grid>
        <Grid item xs={5}>
          <Activate/>
        </Grid>
      </Grid>

    </React.Fragment>
  );
};

export default Content;
