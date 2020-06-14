import React, { Fragment } from 'react';
import Login from '../../screens/Login';
import NotifierMessenger from '../../components/NotifierMessenger';
import { connect } from 'react-redux';
import Connect from '../../screens/Connect';
import logo from '../../assets/img/icon-128.png';
import useStyles from '../../screens/useStyles';
import ShareButtons from '../../components/SharedButtons';
import Typography from '@material-ui/core/Typography';

const Popup = ({ login, ...props }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={classes.logoContainer}>
        <img src={logo} alt="logo" className={classes.logo}/>
      </div>
      {login.state === 'connected'
        ? <Connect/>
        : <Login/>}
      <ShareButtons className={classes.ShareButtons}/>
      <NotifierMessenger/>
      {/*<Typography>{JSON.stringify(login, null, 2)}</Typography>*/}

    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps)(Popup);
