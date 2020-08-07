import React, { useEffect } from 'react';
import Login from '../../screens/Login';
import NotifierMessenger from '../../components/NotifierMessenger';
import { connect } from 'react-redux';
import Connect from '../../screens/Connect';
import useStyles from '../../screens/useStyles';
import Splash from '../../screens/Splash';
import { Box } from '@material-ui/core';
// import ShareButtons from '../../components/SharedButtons';

const Popup = ({ login, configs, ...props }) => {
  const classes = useStyles();
  useEffect(() => {
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'HIDE_SPLASH' });
    }, 1000 * 2);
  }, []);

  return (
    <Box {...props}>
      <Splash/>
      <div style={{ paddingTop: 100 }}/>
        {login.status === 'connected' ? <Connect/> : <Login/>}
        {/*<Connect/>*/}
        {/*<ShareButtons className={classes.ShareButtons}/>*/}
        {/*<div style={{ marginBottom: 15 }}/>*/}
        <NotifierMessenger/>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    configs: state.configs,
  };
};

export default connect(mapStateToProps)(Popup);
