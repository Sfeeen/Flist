import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Alert, Button, TextInput, FlatList, Image, ToastAndroid} from 'react-native';
import {globalStyles} from "../styles/global";
import {NavigationEvents} from "react-navigation";
import { Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server_endpoints } from '../assets/connectionValues';
import NetInfo from '@react-native-community/netinfo';
import {LogBox} from "react-native";

LogBox.ignoreLogs([
"ViewPropTypes will be removed",
"ColorPropType will be removed",
])

export default function singleProduct({navigation}) {
    const [productData, setProductData] = useState(undefined);

    const onFocusScreen = async () => {
        console.log("on focus screen")
        var product_data = navigation.getParam('product_data');
        console.log("product data")
        console.log(product_data)
        console.log("end product data")
        setProductData(product_data)
    }

    function Product() {

        console.log("rendering product")
        console.log(productData)
       if(productData){
           return (
            <View>
                <View style={styles.container}>
                    <Text style={styles.label}>Product name</Text>
                    <Text>{productData.off_data.product_name}</Text>
                </View> 
                <View style={styles.container}>
                    <Text style={styles.label}>Product code</Text>
                    <Text>{productData.product_code}</Text>
                </View> 
                <View style={styles.container}>
                    <Text style={styles.label}>Status</Text>
                    <Text>{productData.status}</Text>
                </View> 
                <View style={styles.container}>
                    <Text style={styles.label}>Time added</Text>
                    <Text>{productData.time_added}</Text>
                </View> 
                 <View style={styles.container}>
                    <Text style={styles.label}>added by user</Text>
                    <Text>{productData.user}</Text>
                </View> 
                <View style={styles.container}>
                    <Text style={styles.label}>Product comment</Text>
                    <Text>{productData.product_comment}</Text>
                </View> 
                <View style={styles.container}>
                    <Text style={styles.label}>Added by device id</Text>
                    <Text>{productData.device_id}</Text>
                </View> 
                <View style={styles.container}>
                    <Text style={styles.label}>Product details</Text>
                    <Text>{String(productData.off_data)}</Text>
                </View> 
            </View>
           );
       } else {
           return (
            <View>
            <Text>No product data...</Text>
           </View>
           );
       }
   }


    return (
        <View>
            <NavigationEvents
                onWillFocus={onFocusScreen}
            />
            <Product></Product>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,

    },
    label: {
        fontWeight: 'bold',
        textTransform:'uppercase'
      },
    
  });