import dataWrapper from '../utils/htmlWrapper';
import fetchCustom from '../utils/fetch';
import updateTimeLeftAction from './timeAction';
import forceUpdateAction from './forceUpdateAction';
import { saveUserAction } from './userStorageAction';
import { saveSessionInStorage } from './storeSessionAction';
import { msToNextFirstDate, nextDate } from '../utils/timeUtil';

const loginAction = (username, password, remember = false) => {
  return (dispatch) => {
    dispatch({ type: 'LOGIN_BEGIN', payload: { status: 'loading', username } });
    const bodyData = { username, password };
    fetchCustom('https://secure.etecsa.net:8443//LoginServlet', bodyData)
      .then(value => {
        return value.text();
      })
      .then(value => {
        if (value.includes('Entre el nombre de usuario y contraseña correctos.' || value.includes('No se pudo autorizar al usuario.'
          || value.includes('El nombre de usuario o contraseña son incorrectos.')))) {
          chrome.runtime.sendMessage({
            type: 'LOGIN_ERROR',
            payload: 'El nombre de usuario o contraseña son incorrectos.',
          });
          dispatch({ type: 'LOGIN_FAILURE', payload: { status: 'error' } });
        } else if (value.includes('El usuario ya está conectado.')) {
          chrome.runtime.sendMessage({ type: 'LOGIN_ERROR', payload: 'Ya se encuentra un usuario conectado.' });
          if (remember) dispatch(saveUserAction(username, password));
          dispatch({ type: 'LOGIN_FAILURE', payload: { status: 'error' } });
        } else if (value.includes('Usted ha realizado muchos intentos.')) {
          chrome.runtime.sendMessage({
            type: 'LOGIN_ERROR',
            payload: 'Usted ha realizado muchos intentos. Por favor intente más tarde.',
          });
          dispatch({ type: 'LOGIN_FAILURE', payload: { status: 'error' } });
        } else if (value.includes('Su tarjeta no tiene saldo disponible.')) {
          chrome.runtime.sendMessage({
            type: 'LOGIN_ERROR',
            payload: 'Su cuenta no tiene saldo disponible.',
          });
          dispatch({ type: 'LOGIN_FAILURE', payload: { status: 'error' } });
        } else {
          const resp = dataWrapper(value);
          dispatch(saveSessionInStorage(resp));
          dispatch(updateTimeLeftAction());
          dispatch({ type: 'LOGIN_SUCCESS', payload: { status: 'connected', ...resp } });
          checkAndTaskNextUpdate(dispatch);
          if (remember) dispatch(saveUserAction(username, password));
          dispatch(forceUpdateAction());
        }
      })
      .catch(reason => {
        if (reason.message === 'Failed to fetch')
          chrome.runtime.sendMessage({ type: 'LOGIN_ERROR', payload: 'Ha ocurrido un error con la conexión de red.' });
        dispatch({ type: 'LOGIN_FAILURE', payload: { status: 'error' } });
        console.log(reason);
      });
  };
};

export const checkAndTaskNextUpdate = (dispatch)=>{
  let idNextUpdate;
  if (nextDate() === 1) {
    idNextUpdate = setTimeout(() => {
      dispatch(updateTimeLeftAction());
    }, msToNextFirstDate());
  }
  dispatch({ type: 'SET_ID_TIME_OUT_NEXT_UPDATE', payload: idNextUpdate });
}

export default loginAction;
