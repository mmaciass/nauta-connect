export const hideSplash = (deltaTime = 1000 * 3) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: 'HIDE_SPLASH' });
    }, deltaTime);
  };
};
