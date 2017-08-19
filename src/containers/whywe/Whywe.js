import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import FloatingButton from '../../components/FloatingButton';
import { connect } from 'react-redux';

import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView
} from 'react-native';
import { globalStyles } from '../../GlobalStyles';

export class Whywe extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: <WhyweTabTitle />,
  });

  render() {
    const {str} = this.props;
    const styleBody = str.style_body.split('<br/>');
    const cosyBody = str.cosy_body.split('<br/>');
    const emojiBody = str.emoji_body.split('<br/>');
    
    return (<ScrollView>
      <View style={globalStyles.ContentMask}>
        <View style={globalStyles.PageTitleUnderline}>
          <Text style={globalStyles.PageTitle}>{str.title.toUpperCase()}</Text>
        </View>
        <View style={globalStyles.TextContainer}>
          <Text style={styles.BodyText}>{str.style_heading}</Text>
          {styleBody.map((snippet, index) => <Text key={index} style={globalStyles.BodyText}>{snippet}</Text>)}
        </View>
        <View style={globalStyles.TextContainer}>
          <Text style={styles.BodyText}>{str.cosy_heading}</Text>
          {cosyBody.map((snippet, index) => <Text key={index} style={globalStyles.BodyText}>{snippet}</Text>)}
        </View>
        <View style={globalStyles.TextContainer}>
          <Text style={styles.BodyText}>{str.emoji_heading}</Text>
          {emojiBody.map((snippet, index) => <Text key={index} style={globalStyles.BodyText}>{snippet}</Text>)}
        </View>
      </View>
    </ScrollView>);
    /*
        <FloatingButton showBookingButton history={this.props.history}/>
         <section  className="">
          <article role="whywe" className="whywe-pan">
            <header className="page-title">
              <h2>{str.title}</h2>
            </header>
             <ul role="services">
                <li> <i className="fa fa-diamond" aria-hidden="true"></i>
                  <h6>{str.style_heading}</h6>
                  <p dangerouslySetInnerHTML={{__html: str.style_body}}></p>
                </li>
                <li> <i className="fa fa-coffee" aria-hidden="true"></i>
                  <h6>{str.cosy_heading}</h6>
                  <p dangerouslySetInnerHTML={{__html: str.cosy_body}}></p>
                </li>
                <li> <i className="fa fa-heart" aria-hidden="true"></i>
                  <h6>{str.emoji_heading}</h6>
                  <p dangerouslySetInnerHTML={{__html: str.emoji_body}}></p>
                </li>
              </ul>
             </article>
      </section>
    </div>);
    */
  }
}

const styles = StyleSheet.create({
  AfterText: {
    marginBottom: 15
  }
});

function mapStateToProps(state) {
  return { str: state.str.currentLocalization.whywe };
}

export default connect(mapStateToProps)(Whywe);

function TabTitle(props) {
  return <Text>{props.str.tabBarLabel}</Text>
}

const WhyweTabTitle = connect(mapStateToProps)(TabTitle);