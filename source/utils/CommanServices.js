import React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import { PermissionsAndroid, Platform } from "react-native";
// var ImagePicker = require('react-native-image-picker');
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from "react-native-image-picker";
import RNFS from "react-native-fs";
export const createSimpleToast = (msg, type) => {
  // var toastStyle = {
  //   backgroundColor: type == "success" ? "#0FD14B" : "#ff3333",
  //   height: 100,
  //   color: "#ffffff",
  //   fontSize: 13,
  //   lineHeight: 10,
  //   lines: 10,
  //   borderRadius: 15,
  //   fontFamily: fonts.semiBold,
  //   paddingLeft: 20,
  //   paddingRight: 20,
  //   yOffset: 10,
  //   xOffset: 0
  // };
  // Toast.show(msg, Toast.LONG, Toast.TOP, toastStyle);
};

export const storeUserData = async (key, value) => {
  console.log(value);
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);

    // saving error
  }
};

export const getUserData = async (key) => {
  console.log(key);
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
    // error reading value
  }
};

export const deleteData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.removeItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const checkForGps = () => {
  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
    interval: 10000,
    fastInterval: 5000,
  })
    .then((data) => {
      // this.getCurrentLocation();
      console.log("checkForGps", data);
      return data;
    })
    .catch((err) => {
      console.log("Msg", err);
      setTimeout(() => {
        createSimpleToast(
          "Cannot locate your current location. Please try Find parking or turn your gps on",
          "fail"
        );
      }, 2000);
    });
};

export const launch_Camera = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "App Camera Permission",
        message: "App needs access to your camera ",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    console.log(granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Camera permission given");
      let options = {
        storageOptions: {
          skipBackup: true,
          path: "images",
          quality: 0.3,
        },
      };
      return ImagePicker.launchCamera(options, (res) => {
        if (res.didCancel) {
          console.log("User cancelled image picker");
        } else if (res.error) {
          console.log("ImagePicker Error: ", res.error);
        } else if (res.customButton) {
          console.log("User tapped custom button: ", res.customButton);
          alert(res.customButton);
        } else {
          console.log("Response", res.assets[0]);
        }
      });
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

export const launch_Image_Library = async () => {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  };
  return ImagePicker.launchImageLibrary(options, (response) => {
    console.log("Response = ", response);

    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.error) {
      console.log("ImagePicker Error: ", response.error);
    } else if (response.customButton) {
      console.log("User tapped custom button: ", response.customButton);
      alert(response.customButton);
    } else {
      console.log("Response", response.assets[0]);
    }
  });
};

export function getBase64(uri) {
  return RNFS.readFile(uri, "base64");
}
