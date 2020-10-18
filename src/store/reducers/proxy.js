export const proxyInitialState = {
  active: false,
  currentPosProxy: 0,
  checkConnection: false,
};

const proxy = (state = proxyInitialState, { type, payload }) => {
  switch (type) {
    case 'ENABLE_PROXY':
      return { ...state, active: true };
    case 'DISABLE_PROXY':
      return { ...state, active: false, currentPosProxy: 0, checkConnection: false };
    case 'CHANGE_PROXY':
      return { ...state, currentPosProxy: payload, checkConnection: false };
    case 'CHECKED_PROXY':
      return { ...state, checkConnection: true };
    default:
      return state;
  }
};

export default proxy;
