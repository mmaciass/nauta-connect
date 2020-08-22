import CryptoJS from 'crypto-js';
// TODO: IMPORTANT sustituir el archivo ".env.example" por ".env" antes de realizar el release
import { REACT_APP_KEY_PROTECT } from '../utils/env.example';

export const saveUserAction = (username, password) => {
  return (dispatch) => {
    const cipherPassword = CryptoJS.AES.encrypt(password, REACT_APP_KEY_PROTECT).toString();
    const callbackPre = () => {
      dispatch({ type: 'SAVE_USER_STORE', payload: { username, password } });
      dispatch(clearUserInTimeDeltaAction());
    };

    chrome.storage.sync.get(['users'], ({ users }) => {
      if (users) {
        let index = users.findIndex(user => user.username === username);
        if (index >= 0) {
          users[index] = { username, password: cipherPassword };
        } else {
          users.push({ username, password: cipherPassword });
        }
        chrome.storage.sync.set({ users }, callbackPre);
      } else {
        users = [{ username, password: cipherPassword }];
        chrome.storage.sync.set({ users }, callbackPre);
      }
    });
  };
};

export const loadUserAction = (username = '') => {
  return (dispatch) => {
    chrome.storage.sync.get(['users'], ({ users }) => {
      if (users) {
        let index = users.findIndex(user => user.username === username);
        if (index >= 0) {
          const bytes = CryptoJS.AES.decrypt(users[index].password, REACT_APP_KEY_PROTECT);
          const password = bytes.toString(CryptoJS.enc.Utf8);
          dispatch({ type: 'LOAD_USER_STORE', payload: { username, password } });
          dispatch(clearUserInTimeDeltaAction());
        }
      }
    });
  };
};

export const clearUserInTimeDeltaAction = (timeDelta = 1000 * 2) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: 'CLEAR_USER_STORE' });
    }, timeDelta);
  };
};
