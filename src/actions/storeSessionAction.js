export const saveSessionInStorage = (session) => {
  return (dispatch) => {
    chrome.storage.local.set(session, () => {
      dispatch({ type: 'SAVED_SESSION_IN_STORAGE' });
    });
  };
};
export const clearSessionInStorage = () => {
  return (dispatch) => {
    chrome.storage.local.remove([
      'username', 'ATTRIBUTE_UUID', 'CSRFHW', 'wlanuserip',
      'loggerId', 'lastUpdateTime', 'lastTimeLeft',
    ], () => {
      dispatch({ type: 'REMOVED_SESSION_IN_STORAGE' });
    });
  };
};

export const loadSessionFromStorage = () => {
  return (dispatch) => {
    chrome.storage.local.get([
      'username', 'ATTRIBUTE_UUID', 'CSRFHW', 'wlanuserip',
      'loggerId', 'lastUpdateTime', 'lastTimeLeft',
    ], (sc) => {
      if (sc.username && sc.ATTRIBUTE_UUID && sc.CSRFHW && sc.lastUpdateTime && sc.lastTimeLeft)
        dispatch({ type: 'LOAD_SESSION_FROM_STORAGE', payload: sc });
    });
  };
};
