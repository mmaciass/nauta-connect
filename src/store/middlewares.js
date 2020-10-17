import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from '../utils/env.example';

const loggerMiddleware = (store) => (next) => (action) => {
  const { type, payload } = action;
  console.info('dispatching', type);
  if (process.env.NODE_ENV === 'development')
    console.info('with payload', payload);
  return next(action);
};

const identityGenerator = (store) => (next) => (action) => {
  const { type, payload } = action;
  if (type === 'NAVIGATOR_RECOGNIZED') {
    chrome.storage.sync.get(['identity'], (val) => {
      if (!val.identity) {
        const identity = {
          id: parseInt((Math.random() * 10000000000000000).toString()),
          timeCheck: Date.now(),
          client: payload,
        };
        console.info('IDENTITY GENERATED');
        chrome.storage.sync.set({ identity });
      }
    });
  }
  return next(action);
};


const protectActions = (store) => (next) => (action) => {
  const { type, payload } = action;
  const listTypesProtected = ['OPEN_DIALOG_TIMER', 'START_TIMER_DISCONNECT'];
  const result = listTypesProtected.find(value => value === type);
  if (result) {
    chrome.storage.sync.get(['token', 'identity'], (v) => {
      const { id, timeCheck, client } = v.identity;
      try {
        const identityCheck = jwt.verify(v.token, PUBLIC_KEY, { algorithms: ['RS256'] });
        if (parseInt(identityCheck.id) !== id || parseInt(identityCheck.timeCheck) !== timeCheck
          || identityCheck.client.toLowerCase() !== client.toLowerCase()) {
          const w = window.open('/license.html');
          w.focus();
        } else {
          return next(action);
        }
      } catch (e) {
        const w = window.open('/license.html');
        w.focus();
      }

    });
  } else return next(action);
};

const middlewares = applyMiddleware(
  thunk, loggerMiddleware, identityGenerator, protectActions,
);

export default middlewares;
