import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';

const middlewares = applyMiddleware(
  thunk,
);

export default middlewares;
