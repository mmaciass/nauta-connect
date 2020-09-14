export const hideSplash = (deltaTime = 1000 * 0.5) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: 'HIDE_SPLASH' });
    }, deltaTime);
  };
};

export const disconnectSplash = (timeEnd = 500) => {
  return (dispatch) => {
    dispatch({ type: 'DISCONNECT_SPLASH' });
    setTimeout(() => {
      dispatch({ type: 'DISCONNECT_SPLASH_END' });
    }, timeEnd);
  };
};
