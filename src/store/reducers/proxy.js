import { PROXYS_SERVERS_LIST } from '../../utils/env';

export const proxyInitialState = {
  automatic: false,
  active: false,
  currentPosProxy: 0,
  checkConnection: false,
  serversList: PROXYS_SERVERS_LIST,
  byPassList: ['localhost', '127.0.0.1'],

  firefoxProxyErrorListener: null,
  firefoxProxyListener: null,
};

const proxy = (state = proxyInitialState, { type, payload }) => {
  switch (type) {
    case 'RESET_PROXY':
      return { ...proxyInitialState };
    case 'AUTO_ENABLE_PROXY':
      return { ...state, automatic: true };
    case 'MANUAL_ENABLE_PROXY':
      return { ...state, automatic: false };
    case 'ENABLE_PROXY':
      return { ...state, active: true };
    case 'DISABLE_PROXY':
      return { ...state, active: false };
    case 'CHANGE_PROXY':
      return { ...state, currentPosProxy: payload, checkConnection: false };
    case 'CHECKED_PROXY':
      return { ...state, checkConnection: true };
    case 'SET_FIREFOX_ERROR_LISTENER':
      return {...state, firefoxProxyErrorListener: payload};
    case 'SET_FIREFOX_LISTENER':
      return {...state, firefoxProxyListener: payload};
    default:
      return state;
  }
};

export default proxy;
