'use strict';

import React, { Component } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
import {CreateStackNavigator} from 'react-navigation'
import getImage from './getImage';
import util from 'react-native-util';

const { height } = Dimensions.get('window');

export default class MealScreen extends Component {
  strMeal = "";
  state = {
    screenHeight:0,
    dataSource: "",
  };

  static navigationOptions = {
    title: 'Recipe Detail',
    headerTitleStyle :{textAlign: 'center',alignSelf:'center'},
    headerTintColor: 'black',
    headerStyle:{
        backgroundColor:'white',
    },
  };

  fetchMeals = (strMeal) => {

    const URL = `http://www.themealdb.com/api/json/v1/1/search.php?s=${strMeal}`;
 
    fetch(URL, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
}).then((response) => response.json())
    .then((responseJson) => {
      console.log("responseJson:" + responseJson.meals[0].strMealThumb);
      this.setState({
        dataSource: responseJson.meals[0],
      });
    })
    .catch((error) => {
      console.error("error:" + error);
    });
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  }

  render(strMeal = this.props.navigation.getParam('strMeal')) {
    this.fetchMeals(strMeal);
    let meal = this.state.dataSource;
    const scrollEnabled = this.state.screenHeight > height;
    return (
      <ScrollView 
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={scrollEnabled}
      onContentSizeChange={this.onContentSizeChange}>
       <View style={styles.imageContainer}>
          {
            meal.strMealThumb
            ? <Image source={{uri:meal.strMealThumb.replace("https", "http")}} style={styles.mealImage} />
            : <View style={styles.noImage}><Text style={styles.noImageText}>No image</Text></View>
          }
        </View> 
         <View style={styles.mainSection}>
          <Text style={styles.mealDecsription}><Text style={styles.titleText}>Date Published:</Text> {
            meal.dateModified
            ? meal.dateModified
            : "25/September/2018"
          }</Text>
          <Text><Text style={styles.titleText}>Cuisine Name:</Text> {meal.strMeal}</Text>
          <Text><Text style={styles.titleText}>Cuisine Category:</Text> {meal.strCategory}</Text>
          <Text><Text style={styles.titleText}>Cuisine Instructions:</Text> {meal.strInstructions}</Text>
          <Text style={styles.titleText}>Video Link:<Text style={{color: 'blue'}} onPress={() => Linking.openURL(meal.strYoutube)}>
            {meal["strYoutube"]}
          </Text></Text>
        </View>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#dddddd',
    flex: 1,
  },
  mealImage: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  noImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: '#aaaaaa',
  },
  mainSection: {
    flex: 2,
    padding: 5,
  },
  titleText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
