import { combineReducers } from 'redux';
import login from './reducers/login';

const allReducers = {
  login,
};

const reducers = combineReducers(allReducers);

export default reducers;
