import * as moment from 'moment';

export const loginInitialState = {
  updateInstance: parseInt((Math.random() * 100000000).toFixed()),
  status: 'none', // 'disconected' | "loading" | "connected" | "error"
  idTimeOutNextUpdate: null,
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
    case 'SET_ID_TIME_OUT_NEXT_UPDATE':
      clearTimeout(state.idTimeOutNextUpdate);
      return {...state, idTimeOutNextUpdate: payload};
    case 'LOGOUT_BEGIN':
      return state;
    case 'LOGOUT_SUCCESS':
      clearTimeout(state.idTimeOutNextUpdate);
      return { status: 'disconected' };
    case 'RESTORE_NONE':
      return { status: 'none' };
    case 'LOGOUT_FAILURE':
      return state;
    case 'FORCE_UPDATE_ACTION':
      return { ...state, updateInstance: parseInt((Math.random() * 100000000).toFixed()) };
    case 'LOAD_SESSION_FROM_STORAGE':
      return { ...state, ...payload, status: 'connected' };
    default:
      return state;
  }
};

export default login;
