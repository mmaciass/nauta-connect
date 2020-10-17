import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { Store } from 'react-chrome-redux';
import { Provider } from 'react-redux';
import { loginInitialState } from '../../store/reducers/login';
import License from './License';
import { configInitialState } from '../../store/reducers/configs';
import { userStorageInitial } from '../../store/reducers/userStorage';
import { timeConnectionInitialState } from '../../store/reducers/timerConnection';

const proxyStore = new Store({
  state: {
    login: loginInitialState,
    configs: configInitialState,
    userStorage: userStorageInitial,
    timerConnection: timeConnectionInitialState,
  },
  portName: 'nauta-connect',
});

const App = (props) => {
  return (
    <Provider store={proxyStore}>
      <License/>
    </Provider>
  );
};

render(<App/>, window.document.querySelector('#app-container'));
