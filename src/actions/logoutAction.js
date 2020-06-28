import fetchCustom from '../utils/fetch';

const logoutAction = () => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({ type: 'LOGOUT_BEGIN' });
    const bodyData = {
      username: state.login.username,
      ATTRIBUTE_UUID: state.login.ATTRIBUTE_UUID,
      CSRFHW: state.login.CSRFHW,
      wlanuserip: state.login.wlanuserip,
      loggerId: state.login.loggerId,
    };
    fetchCustom('https://secure.etecsa.net:8443/LogoutServlet', bodyData)
      .then(value => {
        return value.text();
      })
      .then(value => {
        if (value.includes('logoutcallback(\'FAILURE\')'))
          dispatch({ type: 'LOGOUT_FAILURE' });
        else
          dispatch({ type: 'LOGOUT_SUCCESS' });
      })
      .catch(reason => {
        if (reason.message === 'Failed to fetch')
          chrome.runtime.sendMessage({ type: 'LOGIN_ERROR', payload: 'Ha ocurrido un error con la conexión de red.' });
        dispatch({ type: 'LOGOUT_FAILURE' });
        console.log(reason);
      });
  };
};

export default logoutAction;

export const forceLogoutAction = () => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({ type: 'LOGOUT_SUCCESS' });
    const bodyData = {
      username: state.login.username,
      ATTRIBUTE_UUID: state.login.ATTRIBUTE_UUID,
      CSRFHW: state.login.CSRFHW,
      wlanuserip: state.login.wlanuserip,
      loggerId: state.login.loggerId,
    };
    fetchCustom('https://secure.etecsa.net:8443/LogoutServlet', bodyData)
      .then(value => {
        return value.text();
      })
      .then(value => {
      })
      .catch(reason => {
        if (reason.message === 'Failed to fetch')
          chrome.runtime.sendMessage({ type: 'LOGIN_ERROR', payload: 'Ha ocurrido un error con la conexión de red.' });
        dispatch({ type: 'LOGOUT_FAILURE' });
        console.log(reason);
      });
  };
};

