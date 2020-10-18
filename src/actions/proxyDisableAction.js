import { firefoxProxyListener } from '../utils/proxy';

export const disableProxy = () => {
  return (dispatch, getState) => {
    const { navigator } = getState().configs;
    switch (navigator) {
      case 'chrome':
        dispatch(disableProxyChrome());
        break;
      case 'firefox':
        dispatch(disableProxyFirefox());
        break;
      default:
        dispatch(disableProxyChrome());
        break;
    }
  };
};

const disableProxyChrome = () => {
  return (dispatch, getState) => {
    // const { proxy } = getState();
    chrome.proxy.settings.clear({ scope: 'regular' }, () => {
      dispatch({ type: 'DISABLE_PROXY' });
    });
  };
};

const disableProxyFirefox = () => {
  return (dispatch, getState) => {
    const { proxy } = getState();
    if (!proxy.active)
      return;

    chrome.proxy.onError.removeListener(proxy.firefoxProxyErrorListener);
    dispatch({ type: 'SET_FIREFOX_ERROR_LISTENER', payload: null });

    chrome.proxy.onRequest.removeListener(firefoxProxyListener);
    dispatch({ type: 'SET_FIREFOX_LISTENER', payload: null });

    dispatch({ type: 'DISABLE_PROXY' });
  };
};
