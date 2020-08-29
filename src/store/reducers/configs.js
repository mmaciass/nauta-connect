export const configInitialState = {
  theme: 'auto', // 'auto' || 'dark' || 'light'
  animSplashInit: true,
  animSplashDisconnect: false,
  openDialogUsers: false,
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
      return {
        ...state,
        theme: nextTheme,
      };
    case 'OPEN_DIALOG_USERS':
      return { ...state, openDialogUsers: true };
    case 'CLOSE_DIALOG_USERS':
      return { ...state, openDialogUsers: false };
    default:
      return state;
  }
};

export default configs;
