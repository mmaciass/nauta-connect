import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import './index.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { blue, indigo } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Store } from 'react-chrome-redux';
import { Provider } from 'react-redux';
import { loginInitialState } from '../../store/reducers/login';
import FirstScreen from '../../screens/Splash/FirstScreen';
import Popup from './Popup';

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
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 1000 * 2);
  }, []);

  return (
    <Provider store={proxyStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        {splash ? <FirstScreen/>
          : (
            <Container>
              <Popup/>
            </Container>
          )}
      </ThemeProvider>
    </Provider>
  );
};

render(<App/>, window.document.querySelector('#app-container'));
