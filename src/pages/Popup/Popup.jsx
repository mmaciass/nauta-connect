import React, { Fragment, useEffect } from 'react';
import Login from '../../screens/Login';
import NotifierMessenger from '../../components/NotifierMessenger';
import { connect } from 'react-redux';
import Connect from '../../screens/Connect';
import logo from '../../assets/img/icon-128.png';
import useStyles from '../../screens/useStyles';
import Container from '@material-ui/core/Container';
import FirstScreen from '../../screens/Splash/FirstScreen';
// import ShareButtons from '../../components/SharedButtons';

const Popup = ({ login, configs, ...props }) => {
  const classes = useStyles();
  useEffect(()=>{
    chrome.runtime.sendMessage({ type: 'HIDE_SPLASH'});
  }, [])

  return (
    <Fragment>
      {configs.showSplash ? <FirstScreen/>
        : <Container>
          <div className={classes.logoContainer}>
            <img src={logo} alt="logo" className={classes.logo}/>
          </div>
          {login.status === 'connected' && login.lastTimeLeft && login.lastUpdateTime ? <Connect/> : <Login/>}
          {/*<ShareButtons className={classes.ShareButtons}/>*/}
          <div style={{ marginBottom: 15 }}/>
          <NotifierMessenger/>
        </Container>
      }
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    configs: state.configs,
  };
};

export default connect(mapStateToProps)(Popup);
