import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InitialViewScreen from './components/InitialViewScreen';
import MealScreen from './components/MealScreen';
import { createStackNavigator } from 'react-navigation';

//disable yellow warning boxs
console.disableYellowBox = true; 

const RootStack = createStackNavigator( { 
  InitialViewScreen: InitialViewScreen,
  MealScreen: MealScreen
} )

export default class App extends React.Component {
  render() {
    return <RootStack/>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})