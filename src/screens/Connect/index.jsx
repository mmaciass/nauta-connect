import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import * as moment from 'moment';
import useStyles from '../useStyles';
import { formatTime } from '../../utils/timeUtil';
import ButtonCustom from '../../components/ButtonCustom';

const Connect = ({ login, dispatch, ...props }) => {
  const [time, setTime] = useState('--:--:--');
  const [restante, setRestante] = useState(login.lastTimeLeft);
  const classes = useStyles();
  const logout = () => {
    debugger
    chrome.runtime.sendMessage({ type: 'LOGOUT' });
  };

  const tiempoConectado = () => {
    let ms = moment().diff(moment(login.lastUpdateTime));
    setTime(formatTime(ms));
    if (!!login.lastTimeLeft) {
      let trestante = login.lastTimeLeft.split(':');
      let milTRestante =
        parseInt(trestante[0]) * 60 * 60 * 1000 +
        parseInt(trestante[1]) * 60 * 1000 +
        parseInt(trestante[2]) * 1000;
      if ((milTRestante - ms) <= 0)
        chrome.runtime.sendMessage({ type: 'FORCE_LOGOUT' });
      setRestante(formatTime(milTRestante - ms));
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
      <Typography style={{ textAlign: 'center', marginBottom: 15 }}>Usted se encuentra conectado.</Typography>

      <Typography>Usuario: {login.username}</Typography>
      <Divider/>
      <Typography>{time === '--:--:--' ? 'Tiempo inicial:' : 'Tiempo restante:'} {restante}</Typography>
      <Typography>Tiempo conectado: {time}</Typography>

      <div className={classes.buttonsContainer}>
        <ButtonCustom onClick={logout}>DESCONECTARSE</ButtonCustom>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps)(Connect);
