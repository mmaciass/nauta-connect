const loginAction = (username, password, remember = false) => {
  debugger
  return (dispatch) => {
    dispatch({ type: 'LOGIN_BEGIN', payload: { username } });
  };
};

export default loginAction;