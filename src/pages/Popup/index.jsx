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

// Render immediately to avoid blank screen
render(<App/>, window.document.querySelector('#app-container'));

// Then try to connect to service worker with timeout
const connectTimeout = setTimeout(() => {
  console.warn('[Popup] Store connection timeout - service worker may not be running');
}, 5000);

proxyStore.ready()
  .then(() => {
    clearTimeout(connectTimeout);
    console.log('[Popup] ✅ Store connected to service worker');
  })
  .catch((error) => {
    clearTimeout(connectTimeout);
    console.error('[Popup] ❌ Failed to connect to service worker:', error);
    console.error('[Popup] Extension will work with limited functionality');
  });
