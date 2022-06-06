import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Alert, Button, TextInput, FlatList, Image, ToastAndroid, TouchableOpacity} from 'react-native';
import {globalStyles} from "../styles/global";
import {NavigationEvents} from "react-navigation";
import { Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server_endpoints } from '../assets/connectionValues';
import NetInfo from '@react-native-community/netinfo';
import {LogBox} from "react-native";


LogBox.ignoreLogs([
"ViewPropTypes will be removed",
"ColorPropType will be removed",
])

export default function ShoppingList({navigation}) {
    const [scans, setScans] = useState([]);
    const [selected, setSelected] = useState([]);

    const check_product_details = (product_data) => {
        navigation.navigate('singleProduct', {product_data: product_data});
    }

    function Item({data}) {

 
         var selectedIds = [...selected] // clone state
        if(!selectedIds.includes(parseInt(data.time_added))){
            return (
                <TouchableOpacity onPress={() => toggleSelected(data.time_added)}>
                    <View style={globalStyles.historyBox}>
                        <View style={globalStyles.historyRow}>
                            <View>
                                <Text style={globalStyles.bold}>{data.off_data.product_name}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{marginRight: 10}}><MaterialCommunityIcons name="barcode-scan" size={15} color="black" /></View>
                                    <Text>{data.product_code}</Text>
                                </View>
                                
                                <Text><Text>Added by: </Text>{data.user}</Text>
                                <Text style={globalStyles.italic}>{data.product_comment}</Text>
                                <TouchableOpacity onPress={() => check_product_details(data)}>
                                    <Feather name="info" size={24} color="black" />
                                </TouchableOpacity>
                                
                            </View>
                            <Image
                                style={globalStyles.tinyLogo}
                                resizeMode={'center'}
                                source={{
                                uri: data.off_data.image_url
                                }}
                            />
                        </View>

                    </View>
                </TouchableOpacity>
            );
        } else {
            console.log("heerre")
            return (
                <TouchableOpacity onPress={() => toggleSelected(data.time_added)}>
                    <View style={globalStyles.historyBoxError}>
                        <View style={globalStyles.historyRow}>
                            <View>
                                <Text style={globalStyles.bold}>{data.off_data.product_name}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{marginRight: 10}}><MaterialCommunityIcons name="barcode-scan" size={15} color="black" /></View>
                                    <Text>{data.product_code}</Text>
                                </View>
                                
                                <Text><Text>Added by: </Text>{data.user}</Text>
                                <Text style={globalStyles.italic}>{data.product_comment}</Text>
                            </View>
                            <Image
                                style={globalStyles.tinyLogo}
                                resizeMode={'center'}
                                source={{
                                uri: data.off_data.image_url
                                }}
                            />
                        </View>

                    </View>
                </TouchableOpacity>
            );
        }
    }

    const toggleSelected = (id) => {
        var selectedIds = [...selected] // clone state
        var id = parseInt(id)
     
        if(selected.includes(id))
          selectedIds = selectedIds.filter(_id => _id !== id)
        else 
          selectedIds.push(id)
     
        setSelected(selectedIds)
     }

     const storeDataStorage = async (value) => {
        try {
        const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('shopping_list', jsonValue)
        } catch (e) {
            console.log("Error" + e)
        }
      }

      const loadDataStorage = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('shopping_list')
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            console.log("Error" + e)
        }
      }

      const makeCancelable = (promise) => {
        let hasCanceled_ = false;
      
        const wrappedPromise = new Promise((resolve, reject) => {
          promise.then(
            val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
            error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
          );
        });
      
        return {
          promise: wrappedPromise,
          cancel() {
            hasCanceled_ = true;
          },
        };
      };

      const cancelablePromise = makeCancelable(
        fetch(server_endpoints.get_shopping_list)
      );

      const fetch_history = async () => {
        console.log("fetch history")
        var state = await NetInfo.fetch()
      
        if(!state.isConnected || !state.isInternetReachable){
            Alert.alert("Error: you don't seem to be connected to the internet!");
            return
        } else {
            try {
                let response = await cancelablePromise.promise
            } catch({isCanceled, ...error}){
                console.log('isCanceled', isCanceled)
            }

            cancelablePromise.promise
            .then((response) => {
                if (response.ok) {
                    response.json().then((restext) => {
                        // console.log(restext)
                        setScans(restext)
                        storeDataStorage(restext)
                        ToastAndroid.show("Updated from server!", ToastAndroid.LONG);
                    });
                } else {
                    Alert.alert("Error: server did not respond normally, status: " + response.status);
                }


            })
            .catch(({isCanceled, ...error}) => console.log('isCanceled', isCanceled));
          
            
        

        //   if (response.ok) {
        //     let restext = await response.json();
        //     console.log(restext)
        //     setScans(restext)
        //     storeDataStorage(restext)
        //     ToastAndroid.show("Fetched history!", ToastAndroid.LONG);
        //   } else {
        //     Alert.alert("Error: server did not respond normally, status: " + response.status);
        //   }
        }
      }

    async function loadData() {

        let jsondata = await loadDataStorage()
        //console.log(jsondata)
        if(jsondata){
            console.log("showing cached")
            setScans(jsondata)
        } 

        fetch_history()
    }

    const deleteSelected = async () => {
        console.log("delete selected!")

        var data = new FormData();

        data.append('delete_ids', JSON.stringify(selected));
    
        let response = await fetch(server_endpoints.delete_list, {
            method: 'post',
            body: data,
            headers: {
                'Connection': 'keep-alive',
            },
        });

        if (response.ok) {
            let restext = await response.json();
            setScans(restext)
            storeDataStorage(restext)
            ToastAndroid.show("Item(s) successfully deleted!", ToastAndroid.LONG);
          } else {
            Alert.alert("Error: server did not respond normally, status: " + response.status);
        }
    };


    return (
        <View>
            <NavigationEvents
                onWillFocus={loadData}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10}}>
                {/* <View style={{marginVertical: 20}}><Button title="Delete selected"  onPress={deleteSelected}/></View> */}
                <TouchableOpacity onPress={deleteSelected} style={{ borderWidth:1, borderStyle: 'dashed', borderColor:'black',borderRadius: 5, padding: 10}}>
                    <Text style={{fontSize: 30,}}>DELETE ITEMS  <AntDesign name="delete" size={30} color="black" /></Text>
                </TouchableOpacity>
                
            </View>

            <View style={{flex: 0, marginBottom: 150}}>
                <FlatList
                
                    data={scans}
                    extraData={selected}
                    renderItem={({item}) => <Item data={item}/>}
                    keyExtractor={item => item.time_added}
                />
            </View>

        </View>
    );
}

