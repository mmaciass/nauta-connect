export const configInitialState = {
  theme: 'auto', // 'auto' || 'dark' || 'light'
  animSplashInit: true,
}


const configs = (state = configInitialState, { type, payload }) => {
  switch (type) {
    case 'HIDE_SPLASH':
      return {...state, animSplashInit: false }
    default:
      return state;
  }
};

export default configs;
