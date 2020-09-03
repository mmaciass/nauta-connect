import logoutAction from './logoutAction';

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
    const { timerConnection } = getState();
    if (timerConnection.enabled)
      dispatch({ type: 'STOP_TIMER_DISCONNECT' });
    const idTimeOut = setTimeout(() => {
      dispatch(logoutAction());
    }, msDuration);
    dispatch({ type: 'START_TIMER_DISCONNECT', payload: { msDuration, idTimeOut } });
  };
};


export const stopTimerDisconnect = (msDuration) => {
  return (dispatch, getState) => {
    dispatch({ type: 'STOP_TIMER_DISCONNECT' });
  };
};
