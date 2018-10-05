'use strict';

import React, { Component } from 'react';
import {
  ActivityIndicator,
  ListView,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import _ from 'lodash';
import MealCell from './MealCell';
import MealScreen from './MealScreen';
import util from 'react-native-util';
import dismissKeyboard from 'dismissKeyboard';
const API_KEY = '1';
const RECIPE_REGION = 'Canadian';

const convert = (obj) => {
  let result = {};
  _.map(obj, (item, key) => {
    let value;
    if (typeof (item) === 'object') {
      if (item.$t) { value = item.$t; }
      else { value = convert(item); }
    }
    else { value = item; }
    result[key] = value;
  });
  return result;
};

let resultsCache = [];
//let navigator = Navigator();
export default class InitialViewScreen extends Component {

  state = {
    isLoading: false,
    isLoadingTail: false,
    lastOffset: 0,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
  };

  static navigationOptions = {
    title: 'Nigerian Recipies List',
    headerTitleStyle :{textAlign: 'center',alignSelf:'center'},
    headerStyle:{
        backgroundColor:'white',
    },
  };

  componentDidMount() {
    this.fetchMeals();
  }

  fetchMeals = () => {

    const URL = `http://www.themealdb.com/api/json/v1/${API_KEY}/filter.php?a=${RECIPE_REGION}`;

    if (_.isEmpty(resultsCache)) {
      this.setState({isLoading: true});
    }

    fetch(URL)
      .then((response) => response.json())
      .catch((error) => {
        this.setState({
          dataSource: this.getDataSource([]),
          isLoading: false,
        });
      })
      .then((data) => {
        //console.log('json data' + data.meals);
         resultsCache = _.concat(resultsCache, _.toArray(convert(data.meals)));
        this.setState({
          isLoading: false,
          isLoadingTail: false,
          lastOffset: data.idMeal,
          dataSource: this.getDataSource(resultsCache),
        });
      })
      .done();
  }

  getDataSource = (meals: Array<any>): ListView.DataSource => {
    return this.state.dataSource.cloneWithRows(meals);
  }

  selectMeal = (strMeal: Object) => {
    //console.log("selectMeal");
    console.log("strMeal:" + strMeal);
    if (Platform.OS === 'ios') {
        this.props.navigation.navigate("MealScreen", { strMeal: strMeal });
    } else {
      dismissKeyboard();
      this.props.navigation.navigate("MealScreen", {  strMeal : strMeal});
    }
  }

  onEndReached = () => {
    // We're already fetching
    if (this.state.isLoadingTail) {
      return;
    }
    this.setState({
      isLoadingTail: true,
    });
    this.fetchMeals();
  }

  renderRow = (
    meal: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void
  ) => {
    return (
      <MealCell
        key={meal.idMeal}
        onSelect={() => this.selectMeal(meal.strMeal)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        meal={meal}
      />
    );
  }

  renderFooter = () => {
    if (!this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }

    return <ActivityIndicator style={styles.scrollSpinner} />;
  }

  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        {isLoading
          ? <View style={styles.loading}><Text>Loading...</Text></View>
          : <ListView
            dataSource={this.state.dataSource}
            renderFooter={this.renderFooter}
            renderRow={this.renderRow}
            onEndReached={this.onEndReached}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
          />
        }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 64 : 20,
    flex: 1,
    backgroundColor: 'white',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
});
