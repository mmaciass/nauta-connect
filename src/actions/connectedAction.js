export const preventSleepConnected = () => {
  return (dispatch) => {
    dispatch({ type: 'PREVENT_SLEEP_CONNECTED' });
  };
};

export const allowSleepConnected = () => {
  return (dispatch) => {
    dispatch({ type: 'ALLOW_SLEEP_CONNECTED' });
  };
};
