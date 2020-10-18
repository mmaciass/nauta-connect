import { combineReducers } from 'redux';
import login from './reducers/login';
import userStorage from './reducers/userStorage';
import configs from './reducers/configs';
import timerConnection from './reducers/timerConnection';
import proxy from './reducers/proxy';

export const allReducers = {
  login, userStorage, configs, timerConnection, proxy
};

const reducers = combineReducers(allReducers);

export default reducers;
