import React, { Component } from 'react';
import { Image, View, StyleSheet, Dimensions } from 'react-native';

import image1 from './images/1.jpg';
import image2 from './images/2.jpg';
import image3 from './images/3.jpg';
import image4 from './images/4.jpg';

var {height: windowHeight, width: windowWidth} = Dimensions.get('window')

export default class BackgroundSlider extends Component {
  static defaultProps = {
    changeTime: 3000
  }

  state = {
    activeIndex: randomImageIndex(),
    imagesList: [image1, image2, image3, image4 ]
  }

  componentDidMount() {
    this.setTimer();
  }

  componentDidUpdate(prevProps, prevState) {
    this.setTimer();
  }

  setTimer = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({activeIndex: randomImageIndex()});
    }, this.props.changeTime);
  }

  render() {
    const { activeIndex, imagesList } = this.state;

    return (<View>
      <Image source={imagesList[activeIndex]} style={styles.BackgroundImage} resizeMode="cover" >
        {this.props.children}
      </Image>
    </View>);
  }
}

function randomImageIndex() {
  return Math.floor(Math.random() * 3) + 0;
}

const styles = StyleSheet.create({
  BackgroundImage: {
    width: windowWidth,
    height: windowHeight,
  }
})