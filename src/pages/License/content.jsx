import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
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
  actions: {
    alignSelf: 'center',
  },
  rootTabs: {
    flexGrow: 1,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  textArea: {
    width: '100%',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    fontSize: 'smaller',
    textAlign: 'center',
  },
}));

const Content = ({ ...props }) => {
  const prices = { byMonths: 15, byYears: 120 };
  const classes = useStyles();
  const [id, setId] = useState(null);
  const [timeCheck, setTimeCheck] = useState(null);
  const [client, setClient] = useState('');

  const [license, setLicense] = React.useState('');
  const handleChangeLicense = (event) => {
    setLicense(event.target.value);
  };
  const [msgLicense, setMsgLicense] = React.useState('Pegue aquí su licencia');
  const resetMsg = (secondsTimeWait = 5) => {
    setTimeout(() => {
      setMsgLicense('Pegue aquí su licencia');
    }, secondsTimeWait * 1000);
  };

  const checkLicense = (event, token = license) => {
    chrome.storage.sync.get(['identity'], (v) => {
      debugger
      const { id, timeCheck, client } = v.identity;
      setId(id);
      setTimeCheck(timeCheck);
      setClient(client);
      try {
        const identityCheck = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
        if (parseInt(identityCheck.id) !== id || parseInt(identityCheck.timeCheck) !== timeCheck
          || identityCheck.client.toLowerCase() !== client.toLowerCase()) {
          setMsgLicense('Su licencia no es válida o ya se ha vencido. Solicite una nueva licencia.');
          return;
        }
        setMsgLicense(`Su licencia de Nauta Connect es válida hasta el ${new Date(identityCheck.exp * 1000).toLocaleString()}.`);
        chrome.storage.sync.set({ token }, () => {
        });
      } catch (e) {
        setMsgLicense('Su licencia no es válida o ya se ha vencido. Solicite una nueva licencia.');
        resetMsg();
      }
    });

  };

  useEffect(() => {
    chrome.storage.sync.get(['token'], (v) => {
      if (v.token)
        setLicense(v.token);
      checkLicense(null, v.token);
    });

  }, []);

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Typography>
          <b>Estimado usuario.</b>
        </Typography>
        <Typography>
          Esta extensión es parcialmente gratuita, si desea activar todas funcionalidades, usted debe comprar una
          licencia.
        </Typography>
        <Typography>
          <b>Precios:</b>
        </Typography>
        <Typography>
          Licencia mensual: <b>$ {prices.byMonths.toFixed(2)}</b> CUP por mes (1 - 11 meses)
        </Typography>
        <Typography>
          Licencia anual: <b>$ {prices.byYears.toFixed(2)}</b> CUP por año (1 - 5 años)
        </Typography>
      </Paper>
      <Paper className={classes.paper}>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={4} className={classes.actions}>
            <Typography align="center">
              IDENTIDAD DEL USUARIO
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField margin="dense" size="small" fullWidth label="ID del usuario" variant="outlined"
                       type="number" value={id} InputLabelProps={{ shrink: true }}/>
          </Grid>
          <Grid item xs={3}>
            <TextField margin="dense" size="small" fullWidth label="Tiempo de chequeo" variant="outlined"
                       type="number" value={timeCheck} InputLabelProps={{ shrink: true }}/>
          </Grid>
          <Grid item xs={2}>
            <TextField margin="dense" size="small" fullWidth label="Navegador" variant="outlined"
                       value={client} InputLabelProps={{ shrink: true }}/>
          </Grid>
        </Grid>
      </Paper>

      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={7}>
          <Paper className={classes.paper}>
            <Typography align="center">
              Solicitar licencia
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper className={classes.paper}>
            <Typography align="center">
              Ya tengo una licencia
            </Typography>
            <TextareaAutosize className={classes.textArea} rowsMin={23}
                              value={license} onChange={handleChangeLicense}/>
            <Typography align="center">
              {msgLicense}
            </Typography>
            <Grid container className={classes.root} spacing={2}>
              <Grid item xs={8}>
                <Button fullWidth variant="contained" color="primary" onClick={checkLicense}>
                  Activar
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button fullWidth variant="contained" color="default" onClick={event => {
                  chrome.storage.sync.remove(['token'], () => {
                    setLicense('');
                  });
                }}>
                  Limpiar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

    </React.Fragment>
  );
};

export default Content;
