import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import loggerMiddleware from './logger';
import protectActions from './protectActions';
import identityGenerator from './identity';

const middlewares = applyMiddleware(
  thunk, loggerMiddleware, identityGenerator, protectActions,
);

export default middlewares;
