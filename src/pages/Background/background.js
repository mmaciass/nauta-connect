// Service Worker for Manifest V3
import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

import store from '../../store';
import { wrapStore } from 'react-chrome-redux';
import loginAction from '../../actions/loginAction';
import logoutAction, { endTimeToLogout, forceLogoutAction } from '../../actions/logoutAction';
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
import { disableWarnings, enableWarnings, restoreDisableWarning } from '../../actions/notificationAction';
import { autoProxy } from '../../actions/proxyAutoAction';

// Power management state
let powerSaveBlocker = null;

// Initialize on install/update
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated');
  initializeExtension();
});

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Browser started');
  initializeExtension();
});

// Initialize extension
function initializeExtension() {
  store.dispatch(restoreLastTheme());
  store.dispatch(detectNavigatorAction());
  store.dispatch(loadCountConnect());
  store.dispatch(loadQualifiedState());
  store.dispatch(restorePreventSleepConnected());
  store.dispatch(restoreDisableWarning());
}

// Handle messages from popup and other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'LOGIN':
      store.dispatch(loginAction(request.payload.username, request.payload.password, request.payload.remember));
      break;
    case 'LOGOUT':
      store.dispatch(logoutAction());
      break;
    case 'FORCE_LOGOUT':
      store.dispatch(forceLogoutAction());
      break;
    case 'LOAD_USER_STORE':
      store.dispatch(loadUserAction(request.payload.username));
      break;
    case 'REMOVE_USER_STORE':
      store.dispatch(removeUserAction(request.payload.username));
      break;
    case 'HIDE_SPLASH':
      store.dispatch(hideSplash());
      break;
    case 'NEXT_THEME':
      store.dispatch(nextTheme());
      break;
    case 'OPEN_DIALOG_USERS':
      store.dispatch(openDialogUsers());
      break;
    case 'CLOSE_DIALOG_USERS':
      store.dispatch(closeDialogUsers());
      break;
    case 'OPEN_DIALOG_ABOUT':
      store.dispatch(openDialogAbout());
      break;
    case 'CLOSE_DIALOG_ABOUT':
      store.dispatch(closeDialogAbout());
      break;
    case 'OPEN_DIALOG_QUALIFIED':
      store.dispatch(openDialogQualified());
      break;
    case 'CLOSE_DIALOG_QUALIFIED':
      store.dispatch(closeDialogQualified());
      break;
    case 'OPEN_DIALOG_TIMER':
      store.dispatch(openDialogTimer());
      break;
    case 'CLOSE_DIALOG_TIMER':
      store.dispatch(closeDialogTimer());
      break;
    case 'START_TIMER_DISCONNECT':
      if (request.payload)
        store.dispatch(startTimerDisconnect(request.payload));
      break;
    case 'STOP_TIMER_DISCONNECT':
      store.dispatch(stopTimerDisconnect());
      break;
    case 'QUALIFIED_ACCEPTED':
      store.dispatch(qualifiedAccepted());
      break;
    case 'LOAD_SESSION_FROM_STORAGE':
      store.dispatch(loadSessionFromStorage());
      break;
    case 'PREVENT_SLEEP_CONNECTED':
      store.dispatch(preventSleepConnected());
      break;
    case 'ALLOW_SLEEP_CONNECTED':
      store.dispatch(allowSleepConnected());
      break;
    case 'DISABLE_WARNINGS':
      store.dispatch(disableWarnings());
      break;
    case 'ENABLE_WARNINGS':
      store.dispatch(enableWarnings());
      break;
    case 'END_TIME_TO_LOGOUT':
      store.dispatch(endTimeToLogout());
      break;
    case 'AUTO_ENABLE_PROXY':
      store.dispatch(autoProxy(true));
      break;
    case 'MANUAL_ENABLE_PROXY':
      store.dispatch(autoProxy(false));
      break;
    case 'GET_STATE':
      // Allow other parts of the extension to get the current state
      sendResponse(store.getState());
      return true;
  }
});

// Monitor store changes for power management
let previousState = store.getState();
store.subscribe(() => {
  const currentState = store.getState();
  const { login, timerConnection, configs } = currentState;
  const prevLogin = previousState.login || {};
  const prevTimerConnection = previousState.timerConnection || {};
  const prevConfigs = previousState.configs || {};

  // Check if we need to update power save blocker
  const shouldPreventSleep =
    (configs.preventSleepConnected && login.status === 'connected') ||
    (login.status === 'connected' && timerConnection.enabled);

  const wasPreventingSleep =
    (prevConfigs.preventSleepConnected && prevLogin.status === 'connected') ||
    (prevLogin.status === 'connected' && prevTimerConnection.enabled);

  if (shouldPreventSleep && !wasPreventingSleep) {
    // Start preventing sleep
    if (chrome.power) {
      chrome.power.requestKeepAwake('display');
      console.log('PREVENT SLEEP ACTIVE');
    }
  } else if (!shouldPreventSleep && wasPreventingSleep) {
    // Stop preventing sleep
    if (chrome.power) {
      chrome.power.releaseKeepAwake();
      console.log('PREVENT SLEEP STOPPED');
    }
  }

  previousState = currentState;
});

// Wrap store for react-chrome-redux to sync with popup
wrapStore(store, {
  portName: 'nauta-connect',
});

// Initialize extension when service worker starts
initializeExtension();

console.log('Nauta Connect service worker initialized');
