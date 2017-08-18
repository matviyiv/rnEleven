import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../flux/actions';

import { globalStyles } from '../../GlobalStyles';

export class LanguageSelector extends Component {
  onPress = (lang) => () => {
    this.props.actions.changeLanguage(lang);
  }

  render() {
    return (
      <View style={globalStyles.ContentMask}>
        <View style={globalStyles.TextContainer}>
          <TouchableHighlight
            onPress={this.onPress('ua')}
            underlayColor='rgba(255,255,255,0.7)'
            style={[styles.Button, styles.ButtonDivider]}
            >
            <Text style={styles.LangText}>Українська</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.onPress('en')}
            underlayColor='rgba(255,255,255,0.7)'
            style={styles.Button}
            >
            <Text style={styles.LangText}>English</Text>
            </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Button: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 40,
    paddingLeft: 40,
    backgroundColor: '#c9bc17',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonDivider: {
    marginBottom: 40,
  },
  LangText: {
    color: '#fff',
    fontSize: 20
  }
});

function mapStateToProps(state) {
  return { app: state.app };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);