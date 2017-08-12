import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';
import './moment/moment-timezone-with-data-2012-2022';
moment.tz.setDefault('Europe/Kiev');

import { TabNavigation } from './Navigation';
import BackgroundSlider from './components/background-slider/BackgroundSlider';

export default class App extends Component {
  render() {
    return (<View style={styles.TopContainer}>
      <BackgroundSlider >
        <TabNavigation />
      </BackgroundSlider>
    </View>);
  }
}

const styles = StyleSheet.create({
  TopContainer: {
    flex: 1,
    alignSelf: 'stretch'
  },
});