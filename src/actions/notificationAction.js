export const disableWarnings = () => {
  return (dispatch) => {
    dispatch({ type: 'DISABLE_WARNINGS' });
  };
};

export const enableWarnings = () => {
  return (dispatch) => {
    dispatch({ type: 'ENABLE_WARNINGS' });
  };
};

export const restoreDisableWarning = () => {
  return (dispatch) => {
    chrome.storage.local.get('disableWarnings', e => {
      if (e.disableWarnings)
        dispatch(disableWarnings());
      else
        dispatch(enableWarnings());
    });
  };
};
