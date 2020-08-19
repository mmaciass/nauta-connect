import React, { useEffect } from 'react';
import Login from '../../screens/Login';
import NotifierMessenger from '../../components/NotifierMessenger';
import { connect } from 'react-redux';
import Connect from '../../screens/Connect';
import useStyles from '../../screens/useStyles';
import Splash from '../../screens/Splash';
import { Box } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { blue, indigo } from '@material-ui/core/colors';
// import ShareButtons from '../../components/SharedButtons';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: blue,
    type: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  },
});

const Popup = ({ login, configs, ...props }) => {
  const classes = useStyles();
  useEffect(() => {
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'HIDE_SPLASH' });
    }, 1000);
  }, []);

  return (

    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Box {...props}>
        <Splash/>
        <div style={{ paddingTop: 100 }}/>
        {login.status === 'connected' ? <Connect/> : <Login/>}
        {/*<Connect/>*/}
        {/*<ShareButtons className={classes.ShareButtons}/>*/}
        {/*<div style={{ marginBottom: 15 }}/>*/}
        <NotifierMessenger/>
      </Box>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    configs: state.configs,
  };
};

export default connect(mapStateToProps)(Popup);
