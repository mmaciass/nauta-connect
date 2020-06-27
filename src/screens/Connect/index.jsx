import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import * as moment from 'moment';
import useStyles from '../useStyles';
import Button from '@material-ui/core/Button';

const formatoTime = (ms) => {
  let mili = ms % 1000;
  ms -= mili;
  ms /= 1000;
  let segs = ms % 60;
  ms -= segs;
  ms /= 60;
  let mins = ms % 60;
  ms -= mins;
  ms /= 60;
  let horas = ms;
  return `${(horas + '').length == 1 ? '0' + horas : horas}:${
    (mins + '').length == 1 ? '0' + mins : mins
  }:${(segs + '').length == 1 ? '0' + segs : segs}`;
};

const Connect = ({ login, dispatch, ...props }) => {
  const [time, setTime] = useState('--:--:--');
  const [restante, setRestante] = useState(login.lastTimeLeft);
  const classes = useStyles();
  const logout = () => {
    chrome.runtime.sendMessage({ type: 'LOGOUT' });
  };

  const tiempoConectado = () => {
    let ms = moment().diff(moment(login.lastUpdateTime));
    setTime(formatoTime(ms));
    if (!!login.lastTimeLeft) {
      let trestante = login.lastTimeLeft.split(':');
      let milTRestante =
        parseInt(trestante[0]) * 60 * 60 * 1000 +
        parseInt(trestante[1]) * 60 * 1000 +
        parseInt(trestante[2]) * 1000;
      setRestante(formatoTime(milTRestante - ms));
    }
  };

  useEffect(() => {
    const p = setInterval(tiempoConectado, 1000);

    return () => {
      clearInterval(p);
    };
  }, []);

  return (
    <Fragment>
      <Typography>Usted se encuentra conectado.</Typography>
      <Typography>Usuario: {login.username}</Typography>
      <Divider/>
      <Typography>Tiempo restante: {restante}</Typography>
      <Typography>Tiempo conectado: {time}</Typography>

      <div className={classes.buttonsContainer}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="small"
          onClick={logout}
        >
          Desconectarse
        </Button>
      </div>
      <Divider/>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps)(Connect);
