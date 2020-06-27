import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import loginAction from '../../actions/loginAction';
import logoutAction, { forceLogoutAction } from '../../actions/logoutAction';

const Background = ({ login, loginAction, logoutAction, forceLogoutAction, ...props }) => {
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Background);
