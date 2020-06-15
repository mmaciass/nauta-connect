import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';

const loggerMiddleware = (store) => (next) => ({ type, ...action }) => {
  console.info('dispatching', type);
  return next(action);
};

const middlewares = applyMiddleware(
  thunk, loggerMiddleware,
);

export default middlewares;
