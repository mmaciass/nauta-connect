const configInitialState = {
  theme: 'auto', // 'auto' || 'dark' || 'light'
  runOneSplash: false,

}


const configs = (state = configInitialState, { type, payload }) => {
  switch (type) {
    default:
      return state;
  }
};

export default configs;
