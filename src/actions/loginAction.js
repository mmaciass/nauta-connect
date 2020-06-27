import dataWrapper from '../../utils/htmlWrapper';
import fetchCustom from '../../utils/fetch';
import updateTimeLeftAction from './timeAction';
import forceUpdateAction from './forceUpdateAction';

const loginAction = (username, password, remember = false) => {
  return (dispatch) => {
    dispatch({ type: 'LOGIN_BEGIN', payload: { state: 'loading', username } });
    const bodyData = { username, password };
    fetchCustom('https://secure.etecsa.net:8443//LoginServlet', bodyData)
      .then(value => {
        return value.text();
      })
      .then(value => {
        if (value.includes('El usuario ya está conectado.')) {
          chrome.runtime.sendMessage({ type: 'LOGIN_ERROR', payload: 'Ya se encuentra un usuario conectado.' });
          dispatch({ type: 'LOGIN_FAILURE', payload: { state: 'error' } });
        } else if (value.includes('Usted ha realizado muchos intentos.')) {
          chrome.runtime.sendMessage({
            type: 'LOGIN_ERROR',
            payload: 'Usted ha realizado muchos intentos. Por favor intente más tarde.',
          });
          dispatch({ type: 'LOGIN_FAILURE', payload: { state: 'error' } });
        } else if (value.includes('Su tarjeta no tiene saldo disponible.')) {
          chrome.runtime.sendMessage({
            type: 'LOGIN_ERROR',
            payload: 'Su cuenta no tiene saldo disponible.',
          });
          dispatch({ type: 'LOGIN_FAILURE', payload: { state: 'error' } });
        } else {
          const resp = dataWrapper(value);
          dispatch(updateTimeLeftAction());
          dispatch({ type: 'LOGIN_SUCCESS', payload: { state: 'connected', ...resp } });
          dispatch(forceUpdateAction());
        }
      })
      .catch(reason => {
        if (reason.message === 'Failed to fetch')
          chrome.runtime.sendMessage({ type: 'LOGIN_ERROR', payload: 'Ha ocurrido un error con la conexión de red.' });
        dispatch({ type: 'LOGIN_FAILURE', payload: { state: 'error' } });
        console.log(reason);
      });
  };
};

export default loginAction;
