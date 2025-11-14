import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import loggerMiddleware from './logger';
import identityGenerator from './identity';

// protectActions uses jsonwebtoken which doesn't work in service workers
// Only load it in browser contexts (popup/license pages)
let protectActions = null;
if (typeof window !== 'undefined') {
  protectActions = require('./protectActions').default;
}

// Build middleware list - exclude protectActions in service worker context
const middlewareList = [thunk, loggerMiddleware, identityGenerator];
if (protectActions) {
  middlewareList.push(protectActions);
}

const middlewares = applyMiddleware(...middlewareList);

export default middlewares;
