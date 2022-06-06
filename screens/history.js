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

export default function History({navigation}) {
    const [scans, setScans] = useState([]);

    function Item({data}) {
        return (
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
        );
    }

    const getStoredHistory = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('HISTORY')
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            Alert.alert("error asyncstorage history rtr")
            return []
        }
      }

      const fetch_history = async () => {
        console.log("fetch history")
        var state = await NetInfo.fetch()
      
        if(!state.isConnected || !state.isInternetReachable){
            Alert.alert("Error: you don't seem to be connected to the internet!");
            return
        } else {
          let response = await fetch(server_endpoints.get_product_history);
        
          if (response.ok) {
            let restext = await response.json();
            console.log(restext)
            setScans(restext)
            ToastAndroid.show("Fetched history!", ToastAndroid.LONG);
          } else {
            Alert.alert("Error: server did not respond normally, status: " + response.status);
          }
        }
      }

    async function loadData() {
        // let his = await getStoredHistory()
        // his = [
        //     {
        //         product_code: "product code",
        //         product_comment: "twee stuks",
        //         user: "sven",
        //         deviceid: "devid",
        //         time_added: "9 uur"
        //     }
        // ]
        // console.log(his)
        // setScans(his.reverse())
        fetch_history()
    }

    return (
        <View>

            <NavigationEvents
                onWillFocus={loadData}
            />

            <FlatList
                data={scans}
                renderItem={({item}) => <Item data={item}/>}
                keyExtractor={item => item.time_added}
            />


        </View>
    );
}