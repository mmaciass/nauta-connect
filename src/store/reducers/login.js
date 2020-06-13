const initialState = {
  state: 'none',
  username: '',
  ATTRIBUTE_UUID: '',
};

const login = (state = initialState, { type, payload }) => {
  console.log('disp', type);
  switch (type) {
    case 'LOGIN_BEGIN':
      return { ...state, username: payload.username };
    case 'LOGIN_SUCCESS':
      return { ...state, ATTRIBUTE_UUID: payload.ATTRIBUTE_UUID };
    case 'LOGIN_FAILURE':
      return { ...state };
    default:
      return state;
  }
};

export default login;