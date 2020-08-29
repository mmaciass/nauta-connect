import fetchCustom from '../utils/fetch';
import { disconnectSplash } from './splashAction';
import { clearSessionInStorage } from './storeSessionAction';

const logoutAction = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'LOGOUT_BEGIN' });
    const bodyData = bodyDataConstructor(getState());
    fetchCustom('https://secure.etecsa.net:8443/LogoutServlet', bodyData)
      .then(value => {
        return value.text();
      })
      .then(value => {
        if (value.includes('logoutcallback(\'FAILURE\')')) {
          chrome.runtime.sendMessage({ type: 'LOGIN_ERROR', payload: 'No se ha podido cerrar la sesión.' });
          dispatch({ type: 'LOGOUT_FAILURE' });
        } else {
          dispatch({ type: 'LOGOUT_SUCCESS' });
          dispatch(clearSessionInStorage());
          dispatch(disconnectSplash());
        }
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
    dispatch({ type: 'LOGOUT_SUCCESS' });
    dispatch(disconnectSplash());
    const bodyData = bodyDataConstructor(getState());
    fetchCustom('https://secure.etecsa.net:8443/LogoutServlet', bodyData)
      .then(() => {
      })
      .catch(() => {
      });
  };
};

const bodyDataConstructor = (state) => {
  return {
    username: state.login.username,
    ATTRIBUTE_UUID: state.login.ATTRIBUTE_UUID,
    CSRFHW: state.login.CSRFHW,
    wlanuserip: state.login.wlanuserip,
    loggerId: state.login.loggerId,
  };
};
