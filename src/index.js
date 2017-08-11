import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import { Provider } from 'react-redux';
import App from './App.js';
import { setupStore } from './Store.js';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeIsLoaded: true,
      store: setupStore(),
    };
  }
  render() {
    if (!this.state.storeIsLoaded) {
      return null;
    }
    return (<Provider store={this.state.store}>
        <App />
    </Provider>);
  }
}