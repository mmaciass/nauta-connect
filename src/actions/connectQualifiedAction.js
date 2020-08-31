export const loadCountConnect = () => {
  return (dispatch) => {
    chrome.storage.local.get('countConnect', e => {
      if (e.countConnect)
        dispatch({ type: 'SET_COUNT_CONNECT', payload: e.countConnect });
    });
  };
};

export const loadQualifiedState = () => {
  return (dispatch) => {
    chrome.storage.local.get('qualified', e => {
      if (e.qualified)
        dispatch({ type: 'SET_QUALIFIED', payload: e.qualified });
    });
  };
};

export const openDialogQualified = () => {
  return (dispatch) => {
    dispatch({ type: 'OPEN_DIALOG_QUALIFIED' });
  };
};

export const closeDialogQualified = () => {
  return (dispatch) => {
    dispatch({ type: 'CLOSE_DIALOG_QUALIFIED' });
  };
};

export const qualifiedAccepted = () => {
  return (dispatch) => {
    dispatch({ type: 'QUALIFIED_ACCEPTED' });
  };
};
