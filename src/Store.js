import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist'
import thunkMiddleware from 'redux-thunk';
import { AsyncStorage } from 'react-native';
import logger from "redux-logger";

import { appReducer } from './flux/reducers';
import { localization } from './flux/localization';

export function setupStore(callback) {
  const reducer = combineReducers({ app: appReducer, str: localization });
  let middlewares = [thunkMiddleware];

  if (__DEV__) {
    middlewares.push(logger);
  }

  const store = createStore(
    reducer,
    undefined,
    compose(
      applyMiddleware(...middlewares),
      autoRehydrate()
    )
  )
  persistStore(store, {storage: AsyncStorage});
  callback && callback();
  return store;
}