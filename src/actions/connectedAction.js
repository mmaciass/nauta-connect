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

export const restorePreventSleepConnected = () => {
  return (dispatch) => {
    chrome.storage.local.get('preventSleepConnected', e => {
      if (e.preventSleepConnected)
        dispatch(preventSleepConnected());
      else
        dispatch(allowSleepConnected());
    });
  };
};
