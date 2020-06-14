import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { blue, indigo } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Store } from 'react-chrome-redux';
import { Provider } from 'react-redux';
import { loginInitialState } from '../../store/reducers/login';

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
  },
  portName: 'nauta-connect',
});

const App = (props) => {
  return (
    <Provider store={proxyStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Container>
          <Popup/>
        </Container>
      </ThemeProvider>
    </Provider>
  );
};

render(<App/>, window.document.querySelector('#app-container'));
