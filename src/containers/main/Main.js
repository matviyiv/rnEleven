import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView
} from 'react-native';

import { globalStyles } from '../../GlobalStyles';

// import FloatingButton from '../../components/FloatingButton';

export class Main extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: <MainTabTitle />,
  });
  onBooking = () => {
    this.props.navigation.navigate('Home2')
  }
  render() {
    const {str, history} = this.props;
    return (<ScrollView>
      <View style={globalStyles.ContentMask}>
        <View style={globalStyles.PageTitleUnderline}>
          <Text style={globalStyles.PageTitle}>{str.title.toUpperCase()}</Text>
        </View>
        <View style={globalStyles.TextContainer}>
          <Text style={globalStyles.BodyText}>{str.bodyText1}</Text>
          <Text style={globalStyles.BodyText}>{str.bodyText2}</Text>
          <Text style={globalStyles.BodyText}>{str.bodyText3}</Text>
          <Text style={[globalStyles.BodyText, styles.AfterText]}>{str.bodyText4}</Text>
          <Button
            color="#c9bc17"
            onPress={this.onBooking}
            title={str.booknow}
            />
        </View>
      </View>
    </ScrollView>);
  }
}

const styles = StyleSheet.create({
  AfterText: {
    marginBottom: 15
  }
});

function mapStateToProps(state) {
  return { str: state.str.currentLocalization.main };
}

export default connect(mapStateToProps)(Main);

function TabTitle(props) {
  return <Text>{props.str.tabBarLabel}</Text>
}

const MainTabTitle = connect(mapStateToProps)(TabTitle);
