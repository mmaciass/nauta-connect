export const hideSplash = (deltaTime = 1000 * 0.01) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: 'HIDE_SPLASH' });
    }, deltaTime);
  };
};
