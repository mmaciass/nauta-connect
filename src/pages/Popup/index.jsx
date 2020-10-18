import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { Store } from 'react-chrome-redux';
import { Provider } from 'react-redux';
import { loginInitialState } from '../../store/reducers/login';
import Popup from './Popup';
import { configInitialState } from '../../store/reducers/configs';
import { userStorageInitial } from '../../store/reducers/userStorage';
import { timeConnectionInitialState } from '../../store/reducers/timerConnection';
import { proxyInitialState } from '../../store/reducers/proxy';

const proxyStore = new Store({
  state: {
    login: loginInitialState,
    configs: configInitialState,
    userStorage: userStorageInitial,
    timerConnection: timeConnectionInitialState,
    proxy: proxyInitialState,
  },
  portName: 'nauta-connect',
});

const App = (props) => {
  return (
    <Provider store={proxyStore}>
      <Popup/>
    </Provider>
  );
};

render(<App/>, window.document.querySelector('#app-container'));
