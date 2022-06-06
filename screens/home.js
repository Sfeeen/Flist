import React,  { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, Picker, Button, Alert,ActivityIndicator, ToastAndroid} from 'react-native';
import {globalStyles} from '../styles/global';
import { NavigationEvents } from 'react-navigation';
import { server_endpoints } from '../assets/connectionValues';
import { Entypo, Ionicons, Feather } from '@expo/vector-icons'; 
import NetInfo from '@react-native-community/netinfo';
import {LogBox} from "react-native";

LogBox.ignoreLogs([
"ViewPropTypes will be removed",
"ColorPropType will be removed",
])

export default function Home({navigation}) {

    const onFocusScreen = async () => {
      console.log("onFocusScreen")
    };

    const ReturnFromCameraCallback = async (type, data) => {
      console.log("ReturnFromCameraCallback");
      console.log("type: " + type + " data: " + data)

      var state = await NetInfo.fetch()
        // console.log(state, state.type)

        if(!state.isConnected || !state.isInternetReachable){
            Alert.alert("Error: you don't seem to be connected to the internet!");
            return
        } else {
          fetch_product(data)
        }
  };



  const fetch_product = async (product_code) => {
      let response = await fetch(server_endpoints.get_product + new URLSearchParams({
        product_code: product_code,
      }));
      // let response = await fetch(server_endpoints.get_product);

      if (response.ok) {
        let restext = await response.text();
        console.log(restext)

      } else {
        Alert.alert("Error: server did not respond normally, status: " + response.status);
      }

  }

  const camPressHandler = () => {
      navigation.navigate("BarScan", {rfcc: ReturnFromCameraCallback})
  };

  const historyPressHandler = () => {
    navigation.navigate("History")
  };

  const shoppingListPressHandler = () => {
    navigation.navigate("ShoppingList")
  };

    useEffect(() => {
        console.log("started!");
      }, []);

    return (
        <View style={globalStyles.container}>
            <NavigationEvents
                onWillFocus={onFocusScreen}
            />
            <View style={{marginVertical: 20}}><Button title="scan product" onPress={camPressHandler} /></View>
            <View style={{marginVertical: 20}}><Button title="view history" onPress={historyPressHandler} /></View>
            <View style={{marginVertical: 20}}><Button title="Shopping list" onPress={shoppingListPressHandler} /></View>
                
                
        </View>

    );
}