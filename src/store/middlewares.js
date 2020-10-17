import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';

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

const middlewares = applyMiddleware(
  thunk, loggerMiddleware, identityGenerator,
);

export default middlewares;
