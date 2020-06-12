import { createStore } from 'redux';
import reducers from './reducers';
import middlewares from './middlewares';

const store = createStore(reducers, middlewares);

export default store;