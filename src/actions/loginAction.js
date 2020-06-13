const loginAction = (username, password, remember = false) => {
  debugger
  return (dispatch) => {
    dispatch({ type: 'LOGIN_BEGIN', payload: { username } });
    fetch('https://secure.etecsa.net:8443//LoginServlet', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  };
};

export default loginAction;