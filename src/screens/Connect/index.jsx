import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Countdown from 'react-countdown';
import * as moment from 'moment';
import useStyles from '../useStyles';
import Button from '@material-ui/core/Button';

const Connect = ({ login, ...props }) => {
  const classes = useStyles();
  const logout = () => {
    chrome.runtime.sendMessage({ type: 'LOGOUT' });
  };
  return (
    <Fragment>
      <Typography>Usted se encuentra conectado.</Typography>
      <Divider/>
      <Typography>Tiempo restante: --:--:--</Typography>
      <Typography>Tiempo conectado: --:--:--</Typography>

      <Typography>
        <Countdown daysInHours date={moment().add(35, 'h').toDate()}/>
      </Typography>

      <div className={classes.buttonsContainer}>
        <Button fullWidth variant="contained" color="primary" size="small" onClick={logout}>
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