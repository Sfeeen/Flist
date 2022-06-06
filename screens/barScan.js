import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import {NavigationEvents} from "react-navigation";
import { server_endpoints } from '../assets/connectionValues';
import NetInfo from '@react-native-community/netinfo';
import Dialog from "react-native-dialog";
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import {LogBox} from "react-native";

LogBox.ignoreLogs([
"ViewPropTypes will be removed",
"ColorPropType will be removed",
])

export default function App({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [myCamera, setCamera] = useState(false);
  const [torch, setTorch] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [productname, setProductname] = useState("");
  const [productCode, setProductCode] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [barcodescanning, setbarcodescanning] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const toggleTorch = () => setTorch(previousState => !previousState);

  const try_to_find_product = async (type, data) => {
    console.log("try_to_find_product");
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
    console.log(server_endpoints.get_product + product_code)
    let response = await fetch(server_endpoints.get_product + product_code);

    if (response.ok) {
      let restext = await response.json();
      // console.log(restext)
      setProductname(restext.product_name)
      setProductCode(product_code)
      console.log("setting product name: " +  restext.product_name)
      setDialogVisible(true)

    } else {
      Alert.alert("Error: server did not respond normally, status: " + response.status);
    }

}

const add_product_to_basket = async (product_code, product_comment) => {
  var state = await NetInfo.fetch()

  if(!state.isConnected || !state.isInternetReachable){
      Alert.alert("Error: you don't seem to be connected to the internet!");
      return
  } else {

    var data = new FormData();


    var device_name = Device.deviceName;

      
    var android_id = Application.androidId;

    console.log("adding product to basket: " + product_code + " " + product_comment + " " + device_name + " " + android_id)

    data.append('product_code', product_code);
    data.append('product_comment', product_comment);
    data.append('device_name', device_name);
    data.append('android_id', android_id);

    let response = await fetch(server_endpoints.add_product_to_basket, {
        method: 'post',
        body: data,
        headers: {
            'Connection': 'keep-alive',
        },
    });
  
    if (response.ok) {
      let restext = await response.json();
      // console.log(restext)
      ToastAndroid.show("Product: " + restext.off_data.product_name + " added to shoppinglist!", ToastAndroid.LONG);
    } else {
      Alert.alert("Error: server did not respond normally, status: " + response.status);
    }
  }
}

  const handleCancel = async () => {
    setbarcodescanning(true)
    setDialogVisible(false)
    console.log("adding canceled ...")
  }

  const handleSave = async () => {
    setbarcodescanning(true)
    setDialogVisible(false)
    add_product_to_basket(productCode, inputVal)
    // ToastAndroid.show("Input: " + inputVal, ToastAndroid.LONG);
  }

  const handleBarCodeScanned = ({type, data}) => {
    console.log(`Bar code with t ype ${type} and data ${data} has been scanned!`);
    if(barcodescanning){
      setbarcodescanning(false)
      

      // navigation.goBack();
      // navigation.state.params.rfcc(type, data)
      try_to_find_product(type, data)
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>

      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>{productname}</Dialog.Title>
        <Dialog.Input value={inputVal} style={{color:"#292c2e"}}
          autoCapitalize="characters"
          maxLength={6}
          onChangeText={text => setInputVal(text)}/>
        <Dialog.Description>
            Product comment:
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Add to shoppinglist" onPress={handleSave} />
      </Dialog.Container>

      <Camera 
        style={styles.camera} 
        type={Camera.Constants.Type.back}
        ratio={"16:9"}   
        autoFocus={Camera.Constants.AutoFocus.on}
        ref={ref => {setCamera(ref);}}
        flashMode={torch  ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        onBarCodeScanned={handleBarCodeScanned}
        key={barcodescanning} //Fix so you can scan multiple barcodes
      >
                              
      <View style={{marginLeft: 20, marginTop: 50}}>
        <TouchableOpacity onPress={() => toggleTorch()}>
          <Text style={styles.toggle_button}>{torch  ? <MaterialIcons name="flash-on" size={30} color="black" />: <MaterialIcons name="flash-off" size={30} color="black" />} </Text>
        </TouchableOpacity>
      </View>

      <View style={{marginLeft: 20, marginTop: 50}}>
        <TouchableOpacity>
          <Text style={styles.toggle_button}>{barcodescanning  ? <MaterialIcons name="qr-code-scanner" size={30} color="black" />: <MaterialIcons name="stop" size={30} color="black" />} </Text>
        </TouchableOpacity>
      </View>

      </Camera>
    </View>
  );

  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },

});

