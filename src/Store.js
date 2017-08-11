import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { appReducer } from './flux/reducers';
import { localization } from './flux/localization';

export function setupStore(callback) {
  const reducer = combineReducers({ app: appReducer, str: localization });
  const createStoreWithMiddleware = applyMiddleware(
      thunkMiddleware // lets us dispatch() functions
    )(createStore);
  const store = createStoreWithMiddleware(reducer);
  callback && callback();
  return store;
}