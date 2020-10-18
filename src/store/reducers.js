import { combineReducers } from 'redux';
import login from './reducers/login';
import userStorage from './reducers/userStorage';
import configs from './reducers/configs';
import timerConnection from './reducers/timerConnection';
import proxy from './reducers/proxy';

// Cada vez que se agregue un nuevo reducer, se debe agregar la inicializacion en '/pages/Popup/index.jsx'
export const allReducers = {
  login, userStorage, configs, proxy, timerConnection,
};

const reducers = combineReducers(allReducers);

export default reducers;
