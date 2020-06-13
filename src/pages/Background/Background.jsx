import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import loginAction from '../../actions/loginAction';

const Background = ({ login, loginAction, ...props }) => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        switch (request.type) {
          case 'LOGIN':
            loginAction(request.payload.username, request.payload.password, request.payload.remember);
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Background);