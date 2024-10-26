import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import { render } from 'react-dom';
import React from 'react';
import Background from './Background';
import { Provider } from 'react-redux';
import store from '../../store';

render((
  <Provider store={store}>
    <Background/>
  </Provider>
), window.document.querySelector('#app-background'));
