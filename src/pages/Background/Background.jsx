import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import loginAction from '../../actions/loginAction';

const Background = ({ login, loginAction, ...props }) => {
  useEffect(() => {
    console.log('in background init time is', new Date().getTime());
    loginAction('usus', 'pppsps')
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