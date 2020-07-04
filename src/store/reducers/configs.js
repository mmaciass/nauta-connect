export const configInitialState = {
  theme: 'auto', // 'auto' || 'dark' || 'light'
  showSplash: true,
}


const configs = (state = configInitialState, { type, payload }) => {
  switch (type) {
    case 'HIDE_SPLASH':
      return {...state, showSplash: false }
    default:
      return state;
  }
};

export default configs;
