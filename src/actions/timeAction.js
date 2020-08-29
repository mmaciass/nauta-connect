import fetchCustom from '../utils/fetch';
import { saveSessionInStorage } from './storeSessionAction';
import * as moment from 'moment';

const updateTimeLeftAction = (reintentos = 0) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({ type: 'UPDATE_TIME_BEGIN' });
    const bodyData = {
      op: 'getLeftTime',
      username: state.login.username,
      ATTRIBUTE_UUID: state.login.ATTRIBUTE_UUID,
      CSRFHW: state.login.CSRFHW,
      wlanuserip: state.login.wlanuserip,
      loggerId: state.login.loggerId,
    };
    fetchCustom('https://secure.etecsa.net:8443//EtecsaQueryServlet', bodyData)
      .then(value => {
        return value.text();
      })
      .then(value => {
        if (value.includes('errorop'))
          throw new Error('Error de operacion.');
        const lastUpdateTime =  moment().toISOString();
        dispatch({ type: 'UPDATE_TIME_SUCCESS', payload: { lastTimeLeft: value, lastUpdateTime } });
        dispatch(saveSessionInStorage({ lastTimeLeft: value, lastUpdateTime }));
      })
      .catch(reason => {
        if (reason.message === 'Failed to fetch')
          chrome.runtime.sendMessage({ type: 'LOGIN_ERROR', payload: 'Ha ocurrido un error con la conexión de red.' });
        dispatch({ type: 'UPDATE_TIME_FAILURE' });
        if (reintentos < 2)
          dispatch(updateTimeLeftAction(++reintentos));
      });
  };
};

export default updateTimeLeftAction;
