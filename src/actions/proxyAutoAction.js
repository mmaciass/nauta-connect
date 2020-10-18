export const autoProxy = (auto = true) => {
  return (dispatch, getState) => {
    if (auto) dispatch({ type: 'AUTO_ENABLE_PROXY' });
    else dispatch({ type: 'MANUAL_ENABLE_PROXY' });
  };
};
