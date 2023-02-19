import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid, Platform } from "react-native";
var ImagePicker = require("react-native-image-picker");
import Share from "react-native-share";
//import { captureScreen } from "react-native-view-shot";
var RNFS = require("react-native-fs");
import fonts from "../themes/fonts";
export default class CommanServices {
  constructor() {
    this.state = {
      filepath: {
        data: "",
        uri: "",
      },
      fileData: "",
      fileUri: "",
    };
  }

  createSimpleToast(msg, type) {
    // var styleee={
    //   backgroundColor: type=="success"? "#0FD14B": "#ff3333",
    //   height: 100,
    //   color: "#ffffff",
    //   fontSize: 13,
    //   lineHeight: 10,
    //   lines: 10,
    //   borderRadius: 15,
    //   fontFamily: fonts.semiBold,
    //   paddingLeft:20,
    //   paddingRight:20,
    //   yOffset: 10,
    //   xOffset:0
    // };
    // Toast.show(msg,Toast.LONG,Toast.TOP,styleee);
  }

  async storeData(key, value) {
    console.log(value);
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  }

  getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  deleteData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.removeItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  // async encryptCode (key,value){
  //   console.log(value)
  //  try {
  //   var temp = Base64.encode(value);
  //    const jsonValue = JSON.stringify(temp)
  //    await AsyncStorage.setItem(key, jsonValue)
  //  } catch (e) {
  //    // saving error
  //  }

  //  decryptCode = async (key) => {
  //   try {
  //     var temp2 = Base64.decode(this.state.update_data);
  //     const jsonValue = await AsyncStorage.getItem(key)
  //     return jsonValue != null ? JSON.parse(jsonValue) : null;
  //   } catch(e) {
  //     // error reading value
  //   }
  // }

  //  }

  launchCamera = async (props) => {
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
          },
        };
        ImagePicker.launchCamera(options, (response) => {
          console.log("Response = ", response);

          if (response.didCancel) {
            console.log("User cancelled image picker");
          } else if (response.error) {
            console.log("ImagePicker Error: ", response.error);
          } else if (response.customButton) {
            console.log("User tapped custom button: ", response.customButton);
            alert(response.customButton);
          } else {
            const source = { uri: response.uri };
            console.log("response", JSON.stringify(response));
            var _this = this;
            _this.getData("userData").then((res) => {
              var a = res;
              a["userImg"] = response.uri;
              _this.storeData("userData", a);
            });
            setTimeout(() => {
              props.navigation.replace("Profile");
            }, 500);
            // this.setState({
            //   filePath: response,
            //   fileData: response.data,
            //   fileUri: response.uri
            // });
          }
        });
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  launchImageLibrary = async (props) => {
    console.log(JSON.stringify(props));
    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log("response", JSON.stringify(response));
        var _this = this;
        _this.getData("userData").then((res) => {
          var a = res;
          a["userImg"] = response.uri;
          _this.storeData("userData", a);
          this.createSimpleToast("Profile Updated", "success");
        });
        setTimeout(() => {
          props.navigation.replace("Profile");
        }, 500);
        // this.setState({
        //   filePath: response,
        //   fileData: response.data,
        //   fileUri: response.uri
        // });
      }
    });
  };

  share(title, msg, code) {
    const options = {
      title,
      subject: title,
      message: msg,
      url: `https://play.google.com/store/apps/details?id=com.incubermax.eazypark&referrer=${code}`,
    };
    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }

  shareScreenshot = async (
    parkingName,
    VehicleNo,
    parkingAddress,
    qrCode,
    pnr
  ) => {
    // var imgURL = ''
    // captureScreen({
    //   // Either png or jpg (or webm Android Only), Defaults: png
    //   format: 'png',
    //   // Quality 0.0 - 1.0 (only available for jpg)
    //   quality: 0.8,
    // }).then(
    //   //callback function to get the result URL of the screnshot
    //   (uri) => {
    //     // setSavedImagePath(uri);
    //     // setImageURI(uri);
    //     imgURL = qrCode
    //     console.log("CaptureScreenSHot:>>", uri)

    //     RNFS.readFile(uri, 'base64')
    //       .then(res => {
    //         console.log(res);
    // var url = "www.google.com";
    var title = "Your Parking slot is Ready ";
    var message =
      "Your Parking slot is Ready at " +
      parkingName +
      "," +
      parkingAddress +
      " for PNR No. " +
      pnr +
      ". for Vehicle No:" +
      VehicleNo;
    var icon = "data:<data_type>/<file_extension>;base64,<base64_data>";
    const options = {
      title,
      subject: title,
      message: message,
      url: "data:image/png;base64," + qrCode,
    };
    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
    // },
    //   (error) => console.error('Oops, Something Went Wrong', error),
    // );
    // });
  };
}
