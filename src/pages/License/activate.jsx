import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from '../../utils/env.example';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: 15,
  },
  textArea: {
    width: '100%',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    fontSize: 'smaller',
    textAlign: 'center',
  },
  msgArea: {
    height: '3em',
  },
}));


const Activate = ({ ...props }) => {
  const classes = useStyles();

  const [checking, setChecking] = useState(false);

  const [license, setLicense] = React.useState('');
  const handleChangeLicense = (event) => {
    setLicense(event.target.value);
  };

  const [msgLicense, setMsgLicense] = React.useState('Pegue aquí su licencia');
  const [listener, setListener] = useState(null);
  const resetMsg = (secondsTimeWait = 5) => {
    setTimeout(() => {
      setMsgLicense('Pegue aquí su licencia');
    }, secondsTimeWait * 1000);
  };

  const clearToken = () => {
    chrome.storage.sync.remove(['token'], () => {
      setLicense('');
    });
  };


  const checkLicense = (event, token = license) => {
    setChecking(true);
    chrome.storage.sync.get(['identity'], ({ identity: i, ...v }) => {
      try {
        const identityCheck = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
        if (parseInt(identityCheck.id) !== i.id || parseInt(identityCheck.timeCheck) !== i.timeCheck
          || identityCheck.client.toLowerCase() !== i.client.toLowerCase()) {
          setMsgLicense('Su licencia no es válida o ya se ha vencido. Solicite una nueva licencia.');
          return;
        }
        setMsgLicense(`Su licencia de Nauta Connect es válida hasta el ${new Date(identityCheck.exp * 1000).toLocaleString()}.`);
        chrome.storage.sync.set({ token }, () => {
        });
      } catch (e) {
        setMsgLicense('Su licencia no es válida o ya se ha vencido. Solicite una nueva licencia.');
        resetMsg();
      } finally {
        setChecking(false);
      }
    });

  };

  useEffect(() => {
    chrome.storage.sync.get(['token'], (v) => {
      if (v.token) {
        setLicense(v.token);
        checkLicense(null, v.token);
      }
    });
  }, []);

  return (
    <Paper className={classes.paper}>
      <Typography align="center">
        Licencia
      </Typography>
      {checking
        ? (<Skeleton height={236} width='100%' variant="rect"/>)
        : (<TextareaAutosize className={classes.textArea} rowsMin={23} value={license}
                             onChange={handleChangeLicense}/>)}

      <Typography align="center" className={classes.msgArea}>
        {msgLicense}
      </Typography>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={8}>
          <Button fullWidth variant="contained" color="primary" onClick={checkLicense}>
            Activar
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button fullWidth variant="contained" color="default" onClick={clearToken}>
            Limpiar
          </Button>
        </Grid>
      </Grid>
    </Paper>);
};

export default Activate;
