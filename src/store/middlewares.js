import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';

const loggerMiddleware = (store) => (next) => (action) => {
  const { type, payload } = action;
  console.info('dispatching', type);
  if(process.env.NODE_ENV === 'development')
    console.info('with payload', payload);
  return next(action);
};

const middlewares = applyMiddleware(
  thunk, loggerMiddleware,
);

export default middlewares;
