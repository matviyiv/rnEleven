import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import firebase from './firebase-setup.js';
import { globalStyles } from './GlobalStyles';

export default class Home2 extends Component {
  static navigationOptions = {
    tabBarLabel: 'Home2',
  }
  render() {
    return (
      <View style={globalStyles.ContentMask}>
        <View style={globalStyles.TextContainer}>
        <Text style={styles.welcome}>
          Welcome to Home2!
        </Text>
        <Button
            onPress={() => this.props.navigation.navigate('Home')}
            title="Go to Home"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
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
