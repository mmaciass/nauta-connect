import * as moment from 'moment';

export const loginInitialState = {
  updateInstance: parseInt((Math.random()*100000000).toFixed()),
  state: 'disconected', // 'disconected' | "loading" | "connected" | "error"
  // username: '',
  // ATTRIBUTE_UUID: '',
  // CSRFHW: '',
  // wlanuserip: '',
  // loggerId: '',
  // lastUpdateTime: undefined,
  // lastTimeLeft: undefined,
};

const login = (state = loginInitialState, { type, payload }) => {
  switch (type) {
    case 'LOGIN_BEGIN':
      return { ...payload };
    case 'LOGIN_SUCCESS':
      return { ...state, ...payload, lastUpdateTime: moment().toISOString() };
    case 'LOGIN_FAILURE':
      return { ...state, ...payload };
    case 'UPDATE_TIME_BEGIN':
      return state;
    case 'UPDATE_TIME_SUCCESS':
      return { ...state, lastUpdateTime: moment().toISOString(), ...payload };
    case 'UPDATE_TIME_FAILURE':
      return state;
    case 'LOGOUT_BEGIN':
      return state;
    case 'LOGOUT_SUCCESS':
      return { ...state, state: 'disconected' };
    case 'LOGOUT_FAILURE':
      return state;
    case 'FORCE_UPDATE_ACTION':
      return { ...state, updateInstance: parseInt((Math.random()*100000000).toFixed()) }
    default:
      return state;
  }
};

export default login;
