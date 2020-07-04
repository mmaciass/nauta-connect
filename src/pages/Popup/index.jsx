import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { blue, indigo } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Store } from 'react-chrome-redux';
import { Provider } from 'react-redux';
import { loginInitialState } from '../../store/reducers/login';
import Popup from './Popup';
import { configInitialState } from '../../store/reducers/configs';
import { userStorageInitial } from '../../store/reducers/userStorage';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: blue,
    type: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  },
});

const proxyStore = new Store({
  state: {
    login: loginInitialState,
    configs: { ...configInitialState, showSplash: false },
    userStorage: userStorageInitial,
  },
  portName: 'nauta-connect',
});

const App = (props) => {

  return (
    <Provider store={proxyStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Popup/>
      </ThemeProvider>
    </Provider>
  );
};

render(<App/>, window.document.querySelector('#app-container'));
