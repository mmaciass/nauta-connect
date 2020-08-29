export const nextTheme = () => {
  return (dispatch) => {
    dispatch({ type: 'NEXT_THEME' });
  };
};

export const restoreLastTheme = () => {
  return (dispatch) => {
    chrome.storage.local.get('theme', e => {
      if (e.theme)
        dispatch({ type: 'SET_THEME', payload: e.theme });
    });
  };
};
