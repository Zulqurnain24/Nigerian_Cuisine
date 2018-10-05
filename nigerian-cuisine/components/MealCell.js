'use strict';

import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';
import _ from 'lodash';
import getImage from './getImage';

export default class MealCell extends Component {

  render({ meal } = this.props) {
    const image = getImage(meal);
    let TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View>
          <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
        <View style={styles.row}>
          <View style={styles.imageContainer}>
            { image ? <Image source={image} style={styles.mealImage} />
              : <View style={styles.noImage}><Text style={styles.noImageText}>No image</Text></View>
            }
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.mealName} numberOfLines={1}>
            {'\t'}Name : {meal.strMeal}
            </Text>
          </View>
        </View>
        </TouchableElement>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderBottomColor: '#dddddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 5,
  },
  imageContainer: {
    backgroundColor: '#dddddd',
    width: 90,
    height: 90,
    paddingTop: 10,
  },
  textContainer: {
    flex: 1,
  },
  noImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: '#aaaaaa',
  },
  mealImage: {
    width: 90,
    height: 90,
  },
  mealName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});