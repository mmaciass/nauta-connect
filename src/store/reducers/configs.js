import { openInNewTab } from '../../utils/shorters';

export const configInitialState = {
  theme: 'auto', // 'auto' || 'dark' || 'light'
  animSplashInit: true,
  animSplashDisconnect: false,
  openDialogUsers: false,
  navigator: 'chrome', // 'chrome' || 'firefox' || 'opera' || 'unknown'
  urlShared: 'https://chrome.google.com/webstore/detail/nauta-connect/ppopcmgfgajciikdmipmmpffkpccinep',
  openDialogAbout: false,
  countConnect: 0,
  qualified: false,
  openDialogQualified: false,
  preventSleepConnected: false,
};

export const urlsSharedNavigator = {
  chrome: 'https://chrome.google.com/webstore/detail/nauta-connect/ppopcmgfgajciikdmipmmpffkpccinep',
  firefox: 'https://addons.mozilla.org/es/firefox/addon/nauta-connect/',
};


const configs = (state = configInitialState, { type, payload }) => {
  switch (type) {
    case 'HIDE_SPLASH':
      return { ...state, animSplashInit: false };
    case 'DISCONNECT_SPLASH':
      return { ...state, animSplashInit: true };
    case 'DISCONNECT_SPLASH_END':
      return { ...state, animSplashInit: false };
    case 'NEXT_THEME':
      const nextTheme = state.theme === 'auto'
        ? 'dark'
        : state.theme === 'dark'
          ? 'light'
          : 'auto';
      chrome.storage.local.set({ theme: nextTheme });
      return {
        ...state,
        theme: nextTheme,
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: payload,
      };
    case 'OPEN_DIALOG_USERS':
      return { ...state, openDialogUsers: true };
    case 'CLOSE_DIALOG_USERS':
      return { ...state, openDialogUsers: false };
    case 'OPEN_DIALOG_ABOUT':
      return { ...state, openDialogAbout: true };
    case 'CLOSE_DIALOG_ABOUT':
      return { ...state, openDialogAbout: false };
    case 'OPEN_DIALOG_QUALIFIED':
      return { ...state, openDialogQualified: true };
    case 'CLOSE_DIALOG_QUALIFIED':
      return { ...state, openDialogQualified: false };
    case 'QUALIFIED_ACCEPTED':
      openInNewTab(state.urlShared);
      chrome.storage.local.set({ qualified: true });
      return { ...state, qualified: true };
    case 'NAVIGATOR_RECOGNIZED':
      console.info('Navigator detected:', payload);
      const url = urlsSharedNavigator[payload] || urlsSharedNavigator['chrome'];
      console.info('URL to Shared:', url);
      return { ...state, navigator: payload, urlShared: url };
    case 'SET_COUNT_CONNECT':
      return { ...state, countConnect: payload };
    case 'SET_QUALIFIED':
      return { ...state, qualified: payload };
    case 'LOGIN_SUCCESS':
      chrome.storage.local.set({ countConnect: state.countConnect + 1 });
      if (!state.qualified && state.countConnect !== 0 && state.countConnect % 50 === 0)
        return { ...state, countConnect: state.countConnect + 1, openDialogQualified: true };
      return { ...state, countConnect: state.countConnect + 1 };
    case 'PREVENT_SLEEP_CONNECTED':
      return { ...state, preventSleepConnected: true };
    case 'ALLOW_SLEEP_CONNECTED':
      return { ...state, preventSleepConnected: false };
    default:
      return state;
  }
};

export default configs;
