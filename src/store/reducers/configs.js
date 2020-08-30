export const configInitialState = {
  theme: 'auto', // 'auto' || 'dark' || 'light'
  animSplashInit: true,
  animSplashDisconnect: false,
  openDialogUsers: false,
  navigator: 'chrome', // 'chrome' || 'firefox' || 'opera' || 'unknown'
  urlShared: 'https://chrome.google.com/webstore/detail/nauta-connect/ppopcmgfgajciikdmipmmpffkpccinep',
  openDialogAbout: false,
  firstUseTime: 0,
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
    case 'NAVIGATOR_RECOGNIZED':
      console.info('Navigator detected:', payload);
      const url = urlsSharedNavigator[payload] || urlsSharedNavigator['chrome'];
      console.info('URL to Shared:', url);
      return { ...state, navigator: payload, urlShared: url };
    default:
      return state;
  }
};

export default configs;
