import fetchCustom from '../utils/fetch';
import { disconnectSplash } from './splashAction';
import { clearSessionInStorage } from './storeSessionAction';
import { basicNotification, delayedNotification } from '../utils/shorters';
import Log from '../utils/log';
import updateTimeLeftAction from './timeAction';

const logoutAction = () => {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({ type: 'LOGOUT_BEGIN' });
    const bodyData = bodyDataConstructor(state);
    fetchCustom('https://secure.etecsa.net:8443/LogoutServlet', bodyData)
      .then(value => {
        return value.text();
      })
      .then(value => {
        if (value.includes('logoutcallback(\'FAILURE\')')) {
          basicNotification('No se ha podido cerrar la sesión.');
          dispatch({ type: 'LOGOUT_FAILURE' });
        } else {
          dispatch({ type: 'LOGOUT_SUCCESS' });
          basicNotification('Se ha desconectado de forma satisfactoria.');
          setTimeout(() => {
            dispatch({ type: 'RESTORE_NONE' });
          }, 1000 * 1.5);
          dispatch(clearSessionInStorage());
          dispatch(disconnectSplash());
        }
      })
      .catch(reason => {
        Log.Debug('error reason >>', reason);
        basicNotification('Ha ocurrido un error con la conexión de red.');
        if (!state.configs.disableWarnings)
          delayedNotification('Por favor revise su conexión de red y asegúrese de no tener ningún VPN o otra herramienta que filtre o manipule el tráfico de la red activa.');
        dispatch({ type: 'LOGOUT_FAILURE' });
      });
  };
};

export default logoutAction;

export const forceLogoutAction = () => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({ type: 'LOGOUT_SUCCESS' });
    dispatch(disconnectSplash());
    setTimeout(() => {
      dispatch({ type: 'RESTORE_NONE' });
    }, 1000 * 1.5);
    const bodyData = bodyDataConstructor(state);
    fetchCustom('https://secure.etecsa.net:8443/LogoutServlet', bodyData)
      .then(() => {
      })
      .catch(() => {
        basicNotification('Se ha forzado el cierre de la sesión, esto no asegura que la conexión se haya cerrado, por favor cerciórese que su sesión termino correctamente.');
        if (!state.configs.disableWarnings)
          delayedNotification('Si necesita volver al estado anterior utilice la opción "Recuperar sesión" del menú de opciones.');
      });
  };
};

export const endTimeToLogout = () => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(updateTimeLeftAction());
    dispatch({ type: 'LOGOUT_SUCCESS' });
    dispatch(disconnectSplash());
    setTimeout(() => {
      dispatch({ type: 'RESTORE_NONE' });
    }, 1000 * 1.5);
    const bodyData = bodyDataConstructor(state);
    fetchCustom('https://secure.etecsa.net:8443/LogoutServlet', bodyData)
      .then(() => {
      })
      .catch(() => {
        basicNotification('Su tiempo de conexión disponible se ha agotado.');
        // if (!state.configs.disableWarnings)
        //   delayedNotification('Si necesita volver al estado anterior utilice la opción "Recuperar sesión" del menú de opciones.');
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
