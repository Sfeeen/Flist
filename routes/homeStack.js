
import React from 'react';
import {TouchableOpacity, View, Alert} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 

import Home from '../screens/home';
import BarScan from "../screens/barScan";
import History from "../screens/history";
import ShoppingList from "../screens/shopping_list";
import singleProduct from "../screens/singleProduct";


//expo publish
//expo build:android
//build link: https://expo.io/accounts/svenonderbeke/builds/11c1be31-b482-4b71-81bf-262b72d29471



const screens = {
    Home: {
        screen: Home,
        navigationOptions: ({navigation}) => {
            return {
                title: 'Flist',
                headerRight: () => (
                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ flex: 1, marginRight: 30 }}>
                            <TouchableOpacity onPress={() => {
                                    //v1.0 
                                    Alert.alert(
                                    "Version 1.00",
                                    "(This app updates automatically) \n\n",[], { cancelable: true }
                                    );
                            }}>
                            <Feather name="info" size={24} color="black" style={{'margin':5}} />
                            </TouchableOpacity>
                        </View>


                    </View>


                    
        
                ),
            }
          }
    },
    BarScan: {
        screen: BarScan,
        navigationOptions: {
            title: 'Scan barcode',
            headerShown: false,
        }
    },
    History: {
        screen: History,
        navigationOptions: {
            title: 'Scan history',
        }
    },

    ShoppingList: {
        screen: ShoppingList,
        navigationOptions: {
            title: 'Shopping list',
        }
    },
    singleProduct: {
        screen: singleProduct,
        navigationOptions: {
            title: 'Product details',
        }
    }
};



// home stack navigator screens
const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#242223',
        headerStyle: { backgroundColor: '#f5bd31' }
    }
});

export default createAppContainer(HomeStack);