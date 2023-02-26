import React, { Component, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
  PermissionsAndroid,
} from "react-native";
import Share from "react-native-share";
import RNFS from "react-native-fs";
var location = require("../../../assets/imgs/location.png");
import Carousel from "react-native-snap-carousel";
var bg = require("../../../assets/splash.png");
import colorCodes from "../../themes/colorCodes";
import LinearGradient from "react-native-linear-gradient";
import fonts from "../../themes/fonts";
import RNFetchBlob from "rn-fetch-blob";
var success = require("../../../assets/imgs/success.png");
var download = require("../../../assets/imgs/download.png");
var edit = require("../../../assets/imgs/edit.png");
var sharee = require("../../../assets/imgs/share.png");
var home = require("../../../assets/imgs/home.png");
import ImageView from "react-native-image-viewing";
import QRCode from "react-native-qrcode-svg";
var backbutton = require("../../../assets/imgs/backbutton.png");
var Sccoter_big = require("../../../assets/imgs/Sccoter_big.png");
var rickshaw_big = require("../../../assets/imgs/rickshaw_big.png");
var carVector = require("../../../assets/imgs/carVector.png");
import CommanServices from "../../utils/comman";
import { h, w } from "../../theme/responsive";
var commanService = new CommanServices();
export default class BookingConfirmation extends Component {
  constructor(props) {
    super(props);
    console.log(JSON.stringify(this.props.route.params.data));
    this.state = {
      parkingDetails: this.props.route.params.data,
      vechicleNo: "",
      isShowImages: false,
      startTime: this.props.route.params.startTime,
      endTime: this.props.route.params.endTime,
      bookingDate: this.props.route.params.bookingDate.title,
      qrCode: this.props.route.params.bookingID,
      vehicleType: null,
      bookingID: this.props.route.params.bookingID,
      isGuest: false,
      pnr: this.props.route.params.pnr,
    };
    if (this.props.route.params.data == undefined) {
      console.log("here");
    }
  }

  componentDidMount() {
    this.getUserData();
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    this.props.navigation.navigate("Home");
    return true;
  };

  setIsVisible() {
    this.setState({ isShowImages: true });
  }

  getUserData() {
    commanService.getData("userData").then((res) => {
      console.log(res);
      var a = res;
      if (res["isGuestVehicleRegister"] == "yes") {
        this.setState({
          vechicleNo: res["defaultGuestVehicle"],
          vehicleType: res["guestVehicleType"],
          isGuest: true,
        });
        res["isGuestVehicleRegister"] = "no";
        commanService.storeData("userData", res);
      } else {
        this.setState({
          vechicleNo: res["defaultVehicle"],
          vehicleType: res["vehicleType"],
          isGuest: false,
        });
      }
    });
  }

  continue() {
    // alert("Book Parking")
    this.props.navigation.navigate("Home", {
      data: this.state.parkingDetails,
    });
  }

  shareScreenshot = async (
    parkingName,
    VehicleNo,
    parkingAddress,
    qrCode,
    pnr
  ) => {
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

  edit() {
    var _this = this;
    Alert.alert(
      "Please Confirm!",
      "Do you want to edit booking?", // You will be allowed to edit this booking only once.
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Edit",
          onPress: () => {
            _this.props.navigation.replace("BookingDetails", {
              data: _this.state.parkingDetails,
              bookingID: _this.state.bookingID,
            });
          },
        },
      ],
      { cancelable: false }
    );
  }

  checkPermission = async () => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === "ios") {
      this.downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "App needs access to your storage to download Photos",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log("Storage Permission Granted.");
          this.handleSaveQRCode();
        } else {
          // If permission denied then show alert
          // alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  downloadImage = () => {
    let date = new Date();
    let image_URL = this.state.qrCode;
    const dirs = RNFetchBlob.fs.dirs;
    console.log(dirs);
    var path = dirs.SDCardDir + "/eazyPark-Bookings/" + date + ".jpg";
    RNFetchBlob.fs.writeFile(path, image_URL, "base64").then((res) => {
      console.log("File : ", res);
      commanService.createSimpleToast("Image Download", "success");
      this.setIsVisible();
    });
  };

  handleSaveQRCode = async () => {
    try {
      const path = RNFS.DocumentDirectoryPath + "/qrcode.png";
      const svg = await new QRCode().toDataURL();
      await RNFS.writeFile(path, svg, "base64");
      // setFilePath(path);
      console.log("QR code saved to:", path);
    } catch (err) {
      console.error(err);
    }
  };

  getExtention = (filename) => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: colorCodes.colorWhite }}>
        <StatusBar
          backgroundColor={colorCodes.colorWhite}
          barStyle={"dark-content"}
          translucent={false}
        />
        <View>
          {/* <ImageView
            images={[{uri: 'data:image/png;base64,' + this.state.qrCode}]}
            imageIndex={0}
            visible={this.state.isShowImages}
            onRequestClose={() => this.setState({isShowImages: false})}
          /> */}

          {this.state.isShowImages ? (
            <View style={styles.qrCodeOverlay}>
              <View
                style={{
                  width: "100%",
                  height: h(10),
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingRight: 10,
                  position: "absolute",
                  top: 5,
                  marginRight: w(10),
                }}
              >
                <Text
                  onPress={() => {
                    this.setState({ isShowImages: false });
                  }}
                  style={{ color: "#FFFFFF", fontSize: 25 }}
                >
                  X
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  height: h(50),
                  width: w(100),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <QRCode
                  value={this.state.qrCode}
                  logo={{ uri: "data:image/png;base64," + this.state.qrCode }}
                  logoSize={w(90)}
                  size={w(90)}
                  logoBackgroundColor="transparent"
                />
              </View>
            </View>
          ) : null}
          <ScrollView style={{ height: "100%" }}>
            <View
              style={{
                shadowColor: "#00000057",
                borderColor: "#00000057",
                // borderTopRightRadius: 5,
                borderTopLeftRadius: 5,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
                elevation: 10,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 1,
                backgroundColor: colorCodes.colorWhite,
                paddingBottom: 20,
                // paddingLeft: 20,
              }}
            >
              <View style={[styles.header, { alignItems: "center" }]}>
                <View
                  style={[styles.headerTitleWrapper, { alignItems: "center" }]}
                >
                  {/* <TouchableOpacity style={styles.backBtn} onPress={() => this.props.navigation.goBack()}>
                                        <Image
                                            onPress={() => this.select(index, item)}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                position: 'absolute',

                                            }}
                                            source={backbutton} />
                                    </TouchableOpacity> */}
                  <Text
                    style={[
                      styles.headerTitleText,
                      { width: "100%", textAlign: "center" },
                    ]}
                  >
                    {"Booking Confirmation"}
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: -30 }}>
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={success}
                    style={{
                      width: 150,
                      height: 150,
                      resizeMode: "contain",
                      zIndex: 300,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      marginTop: -20,
                      textTransform: "uppercase",
                      textAlign: "center",
                      color: colorCodes.textColor,
                    }}
                  >
                    Your Booking is Confirmed
                  </Text>
                </View>
                <View
                  style={{ paddingLeft: 20, paddingRight: 20, marginTop: 15 }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "#DFE9F3",
                      borderWidth: 1,
                      borderColor: "#A3BCD5",
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    }}
                  >
                    <Image
                      source={
                        this.state.vehicleType == 1
                          ? Sccoter_big
                          : this.state.vehicleType == 2
                          ? carVector
                          : rickshaw_big
                      }
                      style={{
                        width: 150,
                        height: 150,
                        // position: 'absolute',
                        resizeMode: "contain",
                        marginTop: -20,
                        // top: -40,
                        // right: 30,
                      }}
                    />
                    <View
                      style={{
                        marginTop: -30,
                        paddingBottom: 15,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontFamily: fonts.semiBold }}>
                        {"Vehicle No."}
                      </Text>
                      <Text style={{ fontFamily: fonts.regular }}>
                        {this.state.vechicleNo}
                      </Text>
                    </View>
                  </View>
                  {/* <View style={{
                                        borderBottomWidth: 0.5, borderColor: '#00000057', paddingBottom: 10, marginRight: 30,
                                    }}></View> */}
                </View>
                <View
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    paddingTop: 10,
                    paddingBottom: 10,
                    alignItems: "center",
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    borderColor: "#D2D7DC",
                  }}
                >
                  {/* <Text style={[global.appName, { paddingLeft: 20, fontSize: 12, fontFamily: fonts.regular, color: '#707070', paddingTop: 10 }]}>Location</Text> */}
                  <Text
                    style={[
                      global.appName,
                      { fontSize: 14, fontFamily: fonts.semiBold },
                    ]}
                  >
                    {this.state.parkingDetails.name}
                  </Text>
                </View>

                <View
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 0,
                    paddingBottom: 10,
                    alignItems: "center",
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    borderColor: "#D2D7DC",
                  }}
                >
                  <Text
                    style={[
                      global.appName,
                      {
                        fontSize: 14,
                        fontFamily: fonts.regular,
                        color: "#373737",
                      },
                    ]}
                  >
                    Booking Date and Time
                  </Text>
                  <Text
                    style={[
                      global.appName,
                      {
                        fontSize: 12,
                        fontFamily: fonts.regular,
                        paddingTop: 5,
                      },
                    ]}
                  >
                    {this.state.bookingDate +
                      ", " +
                      this.state.startTime +
                      " to " +
                      this.state.endTime}
                  </Text>
                </View>
                <View
                  style={{
                    overflow: "hidden",
                    width: 15,
                    height: 30,
                    position: "absolute",
                    left: 20,
                    top: 418,
                    borderTopLeftRadius: 150,
                    borderBottomLeftRadius: 150,
                    borderRightWidth: 0,
                    transform: [{ rotate: "180deg" }],
                    borderWidth: 1,
                    borderColor: "#D2D7DC",
                  }}
                >
                  <Image source={null} />
                </View>
                <View
                  style={{ marginLeft: 30, marginRight: 30, marginTop: 13 }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginTop: -10,
                    }}
                  >
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                  </View>
                </View>
                <View
                  style={{
                    overflow: "hidden",
                    width: 15,
                    height: 30,
                    position: "absolute",
                    right: 20,
                    top: 418,
                    borderTopLeftRadius: 150,
                    borderBottomLeftRadius: 150,
                    borderRightWidth: 0,
                    borderWidth: 1,
                    borderColor: "#D2D7DC",
                  }}
                >
                  <Image source={null} />
                </View>
                <View
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 7,
                    paddingBottom: 10,
                    alignItems: "center",
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    borderColor: "#D2D7DC",
                  }}
                >
                  <TouchableOpacity onPress={() => this.setIsVisible()}>
                    <QRCode
                      value={this.state.qrCode}
                      logo={{
                        uri: "data:image/png;base64," + this.state.qrCode,
                      }}
                      logoSize={100}
                      size={100}
                      logoBackgroundColor="transparent"
                    />
                    {/* <Image
                      source={{
                        uri: 'data:image/png;base64,' + this.state.qrCode,
                      }}
                      style={{
                        width: 100,
                        height: 100,
                        resizeMode: 'contain',
                        zIndex: 300,
                      }}
                    /> */}
                  </TouchableOpacity>
                  <Text
                    style={[
                      global.appName,
                      {
                        fontSize: 12,
                        fontFamily: fonts.regular,
                        paddingTop: 5,
                        color: "#707070",
                      },
                    ]}
                  >
                    {"Touch this QR to enlarge & show at entry & exit gates"}
                  </Text>
                </View>
                <View
                  style={{
                    overflow: "hidden",
                    width: 15,
                    height: 30,
                    position: "absolute",
                    left: 20,
                    top: 578,
                    borderTopLeftRadius: 150,
                    borderBottomLeftRadius: 150,
                    borderRightWidth: 0,
                    transform: [{ rotate: "180deg" }],
                    borderWidth: 1,
                    borderColor: "#D2D7DC",
                  }}
                >
                  <Image source={null} />
                </View>
                <View
                  style={{ marginLeft: 30, marginRight: 30, marginTop: 13 }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginTop: -10,
                    }}
                  >
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                    <Text>-</Text>
                  </View>
                </View>
                <View
                  style={{
                    overflow: "hidden",
                    width: 15,
                    height: 30,
                    position: "absolute",
                    right: 20,
                    top: 578,
                    borderTopLeftRadius: 150,
                    borderBottomLeftRadius: 150,
                    borderRightWidth: 0,
                    borderWidth: 1,
                    borderColor: "#D2D7DC",
                  }}
                >
                  <Image source={null} />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 7,
                    paddingBottom: 10,
                    alignItems: "center",
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    borderColor: "#D2D7DC",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.continue();
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={home}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: "contain",
                          zIndex: 300,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          paddingLeft: 5,
                          color: colorCodes.textColor,
                          marginTop: 4,
                        }}
                      >
                        Home
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.shareScreenshot(
                        this.state.parkingDetails.name,
                        this.state.vechicleNo,
                        this.state.parkingDetails.address,
                        this.state.qrCode,
                        this.state.pnr
                      );
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={sharee}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: "contain",
                          zIndex: 300,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          paddingLeft: 5,
                          color: colorCodes.textColor,
                          marginTop: 4,
                        }}
                      >
                        Share
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.edit()}>
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={edit}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: "contain",
                          zIndex: 300,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          paddingLeft: 5,
                          color: colorCodes.textColor,
                          marginTop: 4,
                        }}
                      >
                        Edit
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.checkPermission()}>
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={download}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: "contain",
                          zIndex: 300,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          paddingLeft: 5,
                          color: colorCodes.textColor,
                          marginTop: 4,
                        }}
                      >
                        Download
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* <View style={{ padding: 20 }}>
                            <TouchableOpacity style={{
                                borderTopRightRadius: 5,
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5,
                                borderBottomRightRadius: 5,
                                borderColor: '#A3BCD5',
                                borderWidth: 1
                            }}
                                onPress={() => { this.bookParking(); }}
                            >
                                <Text style={{ fontSize: 14, textTransform: 'uppercase', textAlign: 'center', padding: 10, color: '#01313C', fontFamily: 'Segoe_UI_Regular', fontWeight: '600' }} onPress={() => { this.continue(); }} >BACK TO HOME</Text>

                            </TouchableOpacity>
                        </View> */}
          </ScrollView>
          {/* <View style={{
                        flexDirection: 'row',
                        justifyContent: "center",
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: '100%',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}>
                        <LinearGradient useAngle={true}
                            onPress={() => { this.bookParking(); }}
                            angle={260} colors={['#9C28E9', '#3240B1']} style={{
                                alignItems: "center",
                                backgroundColor: "transparent",
                                width: '100%',
                                zIndex: 20
                                // borderTopRightRadius: 5,
                                // borderTopLeftRadius: 5,
                                // borderBottomLeftRadius: 5,
                                // borderBottomRightRadius: 5
                            }} >
                            <TouchableOpacity
                                onPress={() => { this.bookParking(); }}
                            >
                                <Text style={{ fontSize: 14, textTransform: 'uppercase', padding: 15, height: 50, textAlign: 'center', color: '#FFFFFF', fontFamily: 'Segoe_UI_Regular', fontWeight: '600' }} onPress={() => { this.continue(); }} >BACK TO HOME</Text>

                            </TouchableOpacity>
                        </LinearGradient>
                    </View> */}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  gradientView: {
    backgroundColor: "white",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    width: "100%",
    // height: 50,
    padding: 0,
    marginTop: 10,
    alignItems: "center",
    alignContent: "center",
  },
  cardMainView: {
    // height: '100%',
    top: 10,
    padding: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    width: "100%",
  },
  imgView: { width: 50, height: 50 },
  imgIcons: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    position: "absolute",
    marginTop: 10,
    marginLeft: 25,
  },
  vehicleText: {
    textAlign: "center",
    fontFamily: "Segoe_UI_Regular",
    fontSize: 16,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  TopView: { padding: 20, backgroundColor: colorCodes.colorWhite },
  cusineItem: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderColor: "#707070",
    borderWidth: 1,
    alignSelf: "stretch",
    textAlign: "center",
    borderRadius: 10,
    marginRight: 10,
    marginTop: 15,
    fontFamily: fonts.regular,
  },
  cusineItemWrapper: {
    flexDirection: "row",
    marginBottom: 20,
  },
  cusineItemText: {
    fontSize: 12,
    color: "#707070",
    alignSelf: "stretch",
    textAlign: "center",
  },
  infoItemsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoItemIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  infoItemText: {
    fontSize: 12,
    color: "#707070",
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#707070",
    opacity: 0.4,
    flex: 1,
    zIndex: 0,
  },
  backIcon: {
    fontSize: 18,
    lineHeight: 18,
  },
  qrCodeOverlay: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    alignContent: "center",
    backgroundColor: "#000000",
    width: w(100),
    height: "100%",
    position: "absolute",
    zIndex: 2,
  },
  cuisineBlock: {
    width: "100%",
    alignSelf: "stretch",
    textAlign: "center",
  },
  redText: {
    color: "#f55151",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 5,
  },
  callIcon: {
    fontSize: 16,
    lineHeight: 16,
    backgroundColor: "red",
    width: 20,
  },
  slideCatTitle: {
    fontSize: 12,
    marginTop: 10,
    color: "#000",
    textAlign: "left",
  },
  header: {
    backgroundColor: colorCodes.colorWhite,
    height: 55,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colorCodes.titleColor,
  },
  backBtn: {
    width: 20,
    height: 20,
    marginTop: 2,
    marginRight: 10,
  },
  backBtnIcon: {
    fontSize: 20,
    lineHeight: 20,
    color: colorCodes.backButtonColor,
  },
  loginCardView: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: "100%",
    padding: 0,
    height: "100%",
  },
  loginLabel: {
    paddingBottom: 5,
    color: "#01313C",
    textAlign: "left",
    width: 250,
    fontFamily: fonts.regular,
    fontWeight: "600",
  },
  emailInput: {
    height: 50,
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colorCodes.black,
    backgroundColor: "#FFF",
    paddingLeft: 20,
    textTransform: "lowercase",
    width: "100%",
    borderColor: "#A3BCD5",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});
