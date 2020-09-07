import fetchCustom from '../utils/fetch';
import { disconnectSplash } from './splashAction';
import { clearSessionInStorage } from './storeSessionAction';
import { basicNotification } from '../utils/shorters';

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
        if (reason.message === 'Failed to fetch') {
          basicNotification('Ha ocurrido un error con la conexión de red. Por favor revise su conexión de red y asegúrese de no tener ningún VPN otra herramienta que filtre o manipule el tráfico de la red activa.');
        } else {
          console.log('Reason to error no notificated.', reason);
          console.log('Message in reason to error no notificated.', reason.message);
        }
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
    setTimeout(() => {
      dispatch({ type: 'RESTORE_NONE' });
    }, 1000 * 1.5);
    const bodyData = bodyDataConstructor(getState());
    fetchCustom('https://secure.etecsa.net:8443/LogoutServlet', bodyData)
      .then(() => {
      })
      .catch(() => {
        basicNotification('Se ha forzado el cierre de la sesión, esto no asegura que la conexión se haya cerrado, por favor cerciórese que su sesión termino correctamente.');
        setTimeout(()=>{
          basicNotification('Si necesita volver al estado anterior utilice la opción "Recuperar sesión" del menú de opciones.');
        }, 4500)
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
