import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import { render } from 'react-dom';
import React from 'react';
import Background from './Background';
import { wrapStore } from 'react-chrome-redux';

import store from '../../store';
import { Provider } from 'react-redux';

wrapStore(store, {
  portName: 'nauta-connect',
});

render((
  <Provider store={store}>
    <Background/>
  </Provider>
), window.document.querySelector('#app-background'));