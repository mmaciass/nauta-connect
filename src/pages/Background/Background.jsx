import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import loginAction from '../../actions/loginAction';
import logoutAction, { forceLogoutAction } from '../../actions/logoutAction';
import { loadUserAction } from '../../actions/userStorageAction';
import { disconnectSplash, hideSplash } from '../../actions/splashAction';
import { nextTheme } from '../../actions/themeAction';

const Background = ({ login, loginAction, logoutAction, forceLogoutAction, loadUserAction, hideSplash, disconnectSplash, nextTheme, ...props }) => {
  // if (process.env.NODE_ENV === 'development')
  //   console.log('chrome instance', chrome);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        switch (request.type) {
          case 'LOGIN':
            loginAction(request.payload.username, request.payload.password, request.payload.remember);
            break;
          case 'LOGOUT':
            logoutAction();
            break;
          case 'FORCE_LOGOUT':
            forceLogoutAction();
            break;
          case 'LOAD_USER_STORE':
            loadUserAction(request.payload.username);
            break;
          case 'HIDE_SPLASH':
            hideSplash();
            break;
          case 'NEXT_THEME':
            nextTheme();
            break;
        }
      },
    );

  }, []);
  return (
    <Fragment/>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

const mapDispatchToProps = {
  loginAction,
  logoutAction,
  forceLogoutAction,
  loadUserAction,
  hideSplash,
  disconnectSplash,
  nextTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(Background);
