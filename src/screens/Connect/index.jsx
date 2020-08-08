import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import * as moment from 'moment';
import useStyles from '../useStyles';
import { formatTime } from '../../utils/timeUtil';
import ButtonCustom from '../../components/ButtonCustom';
import CancelIcon from '@material-ui/icons/Cancel';
import Container from '@material-ui/core/Container';
import './anims.css';
import ReplyIcon from '@material-ui/icons/Reply';

const Connect = ({ login, ...props }) => {
  const [time, setTime] = useState('--:--:--');
  const [showForce, setShowForce] = useState(false);
  const [restante, setRestante] = useState(login.lastTimeLeft);
  const classes = useStyles();
  const logout = () => {
    chrome.runtime.sendMessage({ type: 'LOGOUT' });
    setTimeout(() => {
      setShowForce(true);
    }, 2 * 1000);
    setTimeout(() => {
      setShowForce(false);
    }, 20 * 1000);
  };
  const forceLogout = () => {
    chrome.runtime.sendMessage({ type: 'FORCE_LOGOUT' });
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
        forceLogout();
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
    <Container className="containerConnect">
      <Typography>Usted se encuentra conectado</Typography>
      <Typography>{login.username ? login.username : '@nauta'}</Typography>
      <Divider/>
      <Typography>{time === '--:--:--' ? 'Tiempo inicial:' : 'Tiempo restante:'}</Typography>
      <Typography>{restante ? restante : '--:--:--'}</Typography>
      <Typography>Tiempo conectado:</Typography>
      <Typography>{time}</Typography>

      <div className={classes.buttonsContainer}>
        <ButtonCustom color="inherit" onClick={logout} style={{ backgroundColor: 'white', color: '#3f51b5' }}
                      startIcon={<CancelIcon/>}>DESCONECTARSE</ButtonCustom>
        {showForce
          ? <ButtonCustom fullWidth={false} color="inherit" onClick={forceLogout} style={{
            backgroundColor: 'white', color: '#3f51b5', position: 'absolute', right: 10, bottom: 25,
          }} startIcon={<ReplyIcon/>} children="Forzar"/>
          : null
        }

      </div>

    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps)(Connect);
