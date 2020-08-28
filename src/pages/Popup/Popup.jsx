import React, { useEffect, useState } from 'react';
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


const Popup = ({ login, configs, ...props }) => {
  let [theme, setTheme] = useState(createMuiTheme({
    palette: {
      primary: indigo,
      secondary: blue,
      type: configs.theme === 'auto'
        ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : (configs.theme || 'light'),
    }, props: {
      MuiMenuItem: { dense: true },
      MuiListItem: {dense: true}
    },
  }));
  const classes = useStyles();
  useEffect(() => {
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'HIDE_SPLASH' });
    }, 1000);
  }, []);

  useEffect(() => {
    const themeNew = createMuiTheme({
      palette: {
        primary: indigo,
        secondary: blue,
        type: configs.theme === 'auto'
          ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : (configs.theme || 'light'),
      }, props: {
        MuiMenuItem: { dense: true },
        MuiListItem: {dense: true}
      },
    });
    setTheme(themeNew);
  }, [configs.theme]);

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
