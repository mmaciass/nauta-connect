export const timeConnectionInitialState = {
  openDialog: false,
  enabled: false,
  timeInit: 0,
  msDuration: 0,
  idTimeOut: null,
};

const timerConnection = (state = timeConnectionInitialState, { type, payload }) => {
  switch (type) {
    case 'OPEN_DIALOG_TIMER':
      return { ...state, openDialog: true };
    case 'CLOSE_DIALOG_TIMER':
      return { ...state, openDialog: false };
    case 'START_TIMER_DISCONNECT':
      return {
        ...state, openDialog: false, enabled: true, timeInit: new Date().getTime(),
        msDuration: payload.msDuration, idTimeOut: payload.idTimeOut,
      };
    case 'STOP_TIMER_DISCONNECT':
      return stopTimerDisconnect(state);
    case 'LOGOUT_SUCCESS':
      return stopTimerDisconnect(state);
    default:
      return state;
  }
};

const stopTimerDisconnect = (state) => {
  if (state.idTimeOut)
    clearTimeout(state.idTimeOut);
  return { ...timeConnectionInitialState };
};

export default timerConnection;
