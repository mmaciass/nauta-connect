import { combineReducers } from 'redux';
import login from './reducers/login';
import userStorage from './reducers/userStorage';
import configs from './reducers/configs';

const allReducers = {
  login, userStorage, configs,
};

const reducers = combineReducers(allReducers);

export default reducers;
