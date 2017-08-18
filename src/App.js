import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';
import './moment/moment-timezone-with-data-2012-2022';
moment.tz.setDefault('Europe/Kiev');
import { connect } from 'react-redux';

import LanguageSelector from './containers/language-selector/LanguageSelector';

import { TabNavigation } from './Navigation';
import BackgroundSlider from './components/background-slider/BackgroundSlider';

export class App extends Component {
  render() {
    const { currentLocale } = this.props;
    let content = <TabNavigation />;

    if (currentLocale == '') {
      content = <LanguageSelector />
    }

    return (<View style={styles.TopContainer}>
      <BackgroundSlider >
        {content}
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

function mapStateToProps(state) {
  return { currentLocale: state.str.currentLocale };
}

export default connect(mapStateToProps)(App);