import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import { globalStyles } from './GlobalStyles';

export default class Home extends Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
  }
  render() {
    return (
      <View style={globalStyles.ContentMask}>
        <View style={globalStyles.TextContainer}>
          <Text style={styles.welcome}>
            Welcome to RN Eleven!
          </Text>
          <Text style={styles.instructions}>
            To get started, edit App.js
          </Text>
          <Button
              onPress={() => this.props.navigation.navigate('Home2')}
              title="Go to Home2"
            />
          <Text style={styles.instructions}>
            Double tap R on your keyboard to reload,{'\n'}
            Shake or press menu button for dev menu
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
