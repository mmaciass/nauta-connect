import { firefoxProxyErrorListener, firefoxProxyListener } from '../utils/proxy';
import { disableProxy } from './proxyDisableAction';

export const enableProxy = () => {
  return (dispatch, getState) => {
    // dispatch({ type: 'RESET_PROXY' });
    const { navigator } = getState().configs;
    switch (navigator) {
      case 'chrome':
        dispatch(enableProxyChrome());
        break;
      case 'firefox':
        dispatch(enableProxyFirefox());
        break;
      default:
        dispatch(enableProxyChrome());
        break;
    }
  };
};

const enableProxyChrome = () => {
  return (dispatch, getState) => {
    const { proxy } = getState();
    const proxyConfig = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          scheme: 'https',
          host: proxy.serversList[proxy.currentPosProxy].domain,
          port: 443,
        },
        bypassList: proxy.byPassList,
      },
    };

    chrome.proxy.settings.set({ scope: 'regular', value: proxyConfig }, function() {
      dispatch({ type: 'ENABLE_PROXY' });
    });
  };
};

const enableProxyFirefox = () => {
  return (dispatch, getState) => {
    const { proxy } = getState();
    dispatch(disableProxy());
    if (!proxy.active) {

      const firefoxErrorListener = firefoxProxyErrorListener;
      chrome.proxy.onError.addListener(firefoxErrorListener);
      dispatch({ type: 'SET_FIREFOX_ERROR_LISTENER', payload: firefoxErrorListener });

      const firefoxListener = firefoxProxyListener(proxy.serversList[proxy.currentPosProxy].domain, proxy.byPassList);
      chrome.proxy.onRequest.addListener(firefoxListener, { urls: ['<all_urls>'] });
      dispatch({ type: 'SET_FIREFOX_LISTENER', payload: firefoxListener });
    }
    dispatch({ type: 'ENABLE_PROXY' });
  };
};


