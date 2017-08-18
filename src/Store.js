import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist'
import thunkMiddleware from 'redux-thunk';
import { AsyncStorage } from 'react-native';

import { appReducer } from './flux/reducers';
import { localization } from './flux/localization';

export function setupStore(callback) {
  const reducer = combineReducers({ app: appReducer, str: localization });
  // const createStoreWithMiddleware = applyMiddleware(
  //     thunkMiddleware // lets us dispatch() functions
  //   )(createStore);
  // const store = createStoreWithMiddleware(reducer);

  const store = createStore(
    reducer,
    undefined,
    compose(
      applyMiddleware(thunkMiddleware),
      autoRehydrate()
    )
  )
  persistStore(store, {storage: AsyncStorage});
  callback && callback();
  return store;
}