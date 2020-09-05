import React, { Fragment, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import loginAction from '../../actions/loginAction';
import logoutAction, { forceLogoutAction } from '../../actions/logoutAction';
import { loadUserAction, removeUserAction } from '../../actions/userStorageAction';
import { disconnectSplash, hideSplash } from '../../actions/splashAction';
import { nextTheme, restoreLastTheme } from '../../actions/themeAction';
import { closeDialogUsers, openDialogUsers } from '../../actions/dialogUsersAction';
import { loadSessionFromStorage } from '../../actions/storeSessionAction';
import { closeDialogAbout, openDialogAbout } from '../../actions/dialogAboutAction';
import { detectNavigatorAction } from '../../actions/detectNavigatorAction';
import {
  closeDialogQualified,
  loadCountConnect,
  loadQualifiedState,
  openDialogQualified,
  qualifiedAccepted,
} from '../../actions/connectQualifiedAction';
import {
  closeDialogTimer,
  openDialogTimer,
  startTimerDisconnect,
  stopTimerDisconnect,
} from '../../actions/dialogTimerAction';
import {
  allowSleepConnected,
  preventSleepConnected,
  restorePreventSleepConnected,
} from '../../actions/connectedAction';

const Background = ({
                      login, loginAction, logoutAction, forceLogoutAction, loadUserAction, hideSplash,
                      disconnectSplash, nextTheme, openDialogUsers, closeDialogUsers, removeUserAction,
                      loadSessionFromStorage, restoreLastTheme, openDialogAbout, closeDialogAbout,
                      detectNavigatorAction, loadCountConnect, openDialogQualified, closeDialogQualified,
                      qualifiedAccepted, loadQualifiedState, openDialogTimer, closeDialogTimer,
                      startTimerDisconnect, stopTimerDisconnect, timerConnection, configs,
                      allowSleepConnected, preventSleepConnected, restorePreventSleepConnected, ...props
                    }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    restoreLastTheme();
    detectNavigatorAction();
    loadCountConnect();
    loadQualifiedState();
    restorePreventSleepConnected();

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
          case 'REMOVE_USER_STORE':
            debugger
            removeUserAction(request.payload.username);
            break;
          case 'HIDE_SPLASH':
            hideSplash();
            break;
          case 'NEXT_THEME':
            nextTheme();
            break;
          case 'OPEN_DIALOG_USERS':
            openDialogUsers();
            break;
          case 'CLOSE_DIALOG_USERS':
            closeDialogUsers();
            break;
          case 'OPEN_DIALOG_ABOUT':
            openDialogAbout();
            break;
          case 'CLOSE_DIALOG_ABOUT':
            closeDialogAbout();
            break;
          case 'OPEN_DIALOG_QUALIFIED':
            openDialogQualified();
            break;
          case 'CLOSE_DIALOG_QUALIFIED':
            closeDialogQualified();
            break;
          case 'OPEN_DIALOG_TIMER':
            openDialogTimer();
            break;
          case 'CLOSE_DIALOG_TIMER':
            closeDialogTimer();
            break;
          case 'START_TIMER_DISCONNECT':
            if (request.payload)
              startTimerDisconnect(request.payload);
            break;
          case 'STOP_TIMER_DISCONNECT':
            stopTimerDisconnect();
            break;
          case 'QUALIFIED_ACCEPTED':
            qualifiedAccepted();
            break;
          case 'LOAD_SESSION_FROM_STORAGE':
            loadSessionFromStorage();
            break;
          case 'PREVENT_SLEEP_CONNECTED':
            preventSleepConnected();
            break;
          case 'ALLOW_SLEEP_CONNECTED':
            allowSleepConnected();
            break;
        }
      },
    );
  }, []);

  useEffect(() => {
    if (configs.preventSleepConnected && login.status === 'connected') {
      videoRef.current.setAttribute('loop', 'loop');
      videoRef.current.play();
      console.log('PREVENT SLEEP ACTIVE');
    } else if (login.status === 'connected' && timerConnection.enabled) {
      videoRef.current.setAttribute('loop', 'loop');
      videoRef.current.play();
      console.log('PREVENT SLEEP ACTIVE');
    } else {
      videoRef.current.removeAttribute('loop');
      videoRef.current.pause();
      console.log('PREVENT SLEEP STOPPED');
    }
  }, [login.status, configs.preventSleepConnected, timerConnection.enabled]);

  return (
    <Fragment>
      <video ref={videoRef} width="10" height="10" loop="loop" style={{ position: 'absolute', top: -10, left: -10 }}>
        <source src="/muted-blank.mp4" type="video/mp4"/>
        <source src="/muted-blank.ogv" type="video/ogg"/>
      </video>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    timerConnection: state.timerConnection,
    configs: state.configs,
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
  openDialogUsers,
  closeDialogUsers,
  removeUserAction,
  loadSessionFromStorage,
  restoreLastTheme,
  openDialogAbout,
  closeDialogAbout,
  detectNavigatorAction,
  loadCountConnect,
  openDialogQualified,
  closeDialogQualified,
  qualifiedAccepted,
  loadQualifiedState,
  openDialogTimer,
  closeDialogTimer,
  startTimerDisconnect,
  stopTimerDisconnect,
  preventSleepConnected,
  allowSleepConnected,
  restorePreventSleepConnected
};

export default connect(mapStateToProps, mapDispatchToProps)(Background);
