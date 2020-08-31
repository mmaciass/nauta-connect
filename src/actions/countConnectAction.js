export const loadCountConnect = () => {
  return (dispatch, getState) => {
    chrome.storage.local.get('countConnect', e => {
      if (e.countConnect)
        dispatch({ type: 'SET_COUNT_CONNECT', payload: e.countConnect });
    });
  };
};
