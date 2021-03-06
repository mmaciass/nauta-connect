import logoutAction from './logoutAction';
import { basicNotification, delayedNotification } from '../utils/shorters';
import { formatTime } from '../utils/timeUtil';

export const openDialogTimer = () => {
  return (dispatch) => {
    dispatch({ type: 'OPEN_DIALOG_TIMER' });
  };
};

export const closeDialogTimer = () => {
  return (dispatch) => {
    dispatch({ type: 'CLOSE_DIALOG_TIMER' });
  };
};

export const startTimerDisconnect = (msDuration) => {
  return (dispatch, getState) => {
    const state = getState();
    if (state.timerConnection.enabled)
      dispatch({ type: 'STOP_TIMER_DISCONNECT' });
    const idTimeOut = setTimeout(() => {
      dispatch(logoutAction());
      dispatch(stopTimerDisconnect());
    }, msDuration);
    basicNotification(`Su conexión se cerrara de forma automática pasado el tiempo de ${formatTime(msDuration)}.`);
    if (!state.configs.disableWarnings)
      delayedNotification('Asegúrese de no tener ningún VPN o otra herramienta que filtre o manipule el tráfico de la red activa, de lo contrario puede que la sesión no se cierre correctamente.');
    dispatch({ type: 'START_TIMER_DISCONNECT', payload: { msDuration, idTimeOut } });
  };
};


export const stopTimerDisconnect = () => {
  return (dispatch) => {
    basicNotification(`Se ha cancelado la desconexión automática.`);
    dispatch({ type: 'STOP_TIMER_DISCONNECT' });
  };
};
