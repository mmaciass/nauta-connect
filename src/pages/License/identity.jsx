import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: 15,
  },
  actions: {
    alignSelf: 'center',
  },
  inputSkeleton: {
    height: 40,
    width: '100%',
    marginTop: 8,
  },
}));

const Identity = ({ ...props }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);

  const [id, setId] = useState('');
  const [timeCheck, setTimeCheck] = useState('');
  const [client, setClient] = useState('');

  useEffect(() => {
    setLoading(true);
    chrome.storage.sync.get(['identity'], (v) => {
      if (v.identity) {
        setId(v.identity.id);
        setTimeCheck(v.identity.timeCheck);
        setClient(v.identity.client);
      }
      setLoading(false);
    });
  }, []);

  return (
    <Paper className={classes.paper} {...props}>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={4} className={classes.actions}>
          <Typography align="center">
            IDENTIDAD DEL USUARIO
          </Typography>
        </Grid>
        <Grid item xs={3}>
          {loading
            ? (<Skeleton variant="rect" animation="wave" className={classes.inputSkeleton}/>)
            : (<TextField margin="dense" size="small" fullWidth label="ID del usuario" variant="outlined"
                          type="number" value={id} InputLabelProps={{ shrink: true }}/>)}
        </Grid>
        <Grid item xs={3}>
          {loading
            ? (<Skeleton variant="rect" animation="wave" className={classes.inputSkeleton}/>)
            : (<TextField margin="dense" size="small" fullWidth label="Tiempo de chequeo" variant="outlined"
                          type="number" value={timeCheck} InputLabelProps={{ shrink: true }}/>)}
        </Grid>
        <Grid item xs={2}>
          {loading
            ? (<Skeleton variant="rect" animation="wave" className={classes.inputSkeleton}/>)
            : (<TextField margin="dense" size="small" fullWidth label="Navegador" variant="outlined"
                          value={client} InputLabelProps={{ shrink: true }}/>)}

        </Grid>
      </Grid>
    </Paper>
  );
};

export default Identity;
