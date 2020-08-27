export const configInitialState = {
  theme: 'auto', // 'auto' || 'dark' || 'light'
  animSplashInit: true,
  animSplashDisconnect: false,
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
      return {
        ...state,
        theme: state.theme === 'auto'
          ? 'dark'
          : state.theme === 'dark'
            ? 'light'
            : 'auto',
      };
    default:
      return state;
  }
};

export default configs;
