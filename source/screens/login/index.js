import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Platform,
  ToastAndroid,
  Switch,
} from "react-native";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import * as Animatable from "react-native-animatable";
import colorCodes from "../../themes/colorCodes";
import fonts from "../../themes/fonts";
import WhiteButton from "../../components/WhiteButton";
import InfoModal from "../../components/InfoModal";
import { apiVersion, apiName } from "../../../Config";
import DeviceInfo from "react-native-device-info";
import {
  createSimpleToast,
  getUserData,
  storeUserData,
} from "../../utils/CommanServices";
import {
  getHash,
  startOtpListener,
  useOtpVerify,
} from "react-native-otp-verify";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import { httpCall } from "../../utils/RestApi";
import Loader from "../../components/Loader";
import messaging from "@react-native-firebase/messaging";

import { f, h, w } from "../../theme/responsive";
import Toast from "react-native-simple-toast";

var loginBg = require("../../../assets/imgs/loginBg.png");
const countryCodeMaster = [
  { id: 1, code: "91 ", country: "India" },
  { id: 2, code: "88", country: "Bangladesh" },
];

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countryList: [
        { id: 1, code: "91 ", country: "India" },
        { id: 2, code: "88", country: "Bangladesh" },
      ],
      countryCode: "91",
      showModal: false,
      mobileNo: "",
      appVersion: "",
      Name: "",
      email: "",
      notificationid: "",
      referID: "",
      showLoader: false,
      deviceId: "",
      hashId: "",
      isEnabled: false,
      emailID: "",
    };
  }

  componentDidMount() {
    this.getDeviceId();
    this.getNotificationToken();
    this.getHashKey();
  }

  getHashKey = () => {
    getHash()
      .then((hash) => {
        console.log("hashKey", hash);
        this.setState({
          hashId: hash.length ? hash[0] : "4F2x8FmdMdQ",
        });
      })
      .catch(console.log);
  };
  getDeviceId = async () => {
    DeviceInfo.getAndroidId().then((androidId) => {
      this.setState({
        deviceId: androidId,
      });
    });
  };

  getNotificationToken = async () => {
    console.log("getNotificationToken");
    await messaging()
      .getToken()
      .then((res) => {
        console.log("messaging", res);
        this.setState({
          notificationid: res,
        });
      });
  };
  submit = () => {
    console.log("submit");
    const {
      isEnabled,
      emailID,
      mobileNo,
      countryCode,
      deviceId,
      Name,
      hashId,
      notificationid,
      appVersion,
    } = this.state;
    const { navigation } = this.props;
    const regs = /^[0]?[6789]\d{9}$/;
    const reg =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (isEnabled && !emailID && !mobileNo) {
      Toast.show("please enter email");
    } else if (!isEnabled && !emailID && !mobileNo) {
      Toast.show("please enter mobile no");
    } else if (emailID && reg.test(emailID) === false) {
      Toast.show("please enter valid email id");
      return false;
    } else if (mobileNo && regs.test(mobileNo) === false) {
      Toast.show("please enter valid 10 digit number");
      return false;
    } else {
      this.setState({
        showLoader: true,
      });

      var req = {
        Email: emailID,
        ISDCode: "+" + countryCode,
        Mobile: mobileNo,
        DeviceId: deviceId,
        Version: apiVersion,
        Name: Name,
        AppId: hashId,
      };
      console.log("notificationid", notificationid, " appVersion ", appVersion);
      console.log("createOtp request params", req);
      httpCall(apiName["createOtp"], req).then(
        (data) => {
          if (data.respCode == 1) {
            console.log("response of createOtp", data);
            Toast.show("Otp Sent");
            getUserData("userData").then((res) => {
              req["notificationid"] = notificationid;
              req["appVersion"] = appVersion;
              storeUserData("userData", { ...res, ...req });
            });
            navigation.navigate("OTPScreen", { data: req });
            this.setState({
              showLoader: false,
            });
          } else {
            Toast.show("*something went wrong please try again later");
            this.setState({
              showLoader: false,
            });
          }
        },
        (error) => {
          Toast.show("*something went wrong please try again later");

          this.setState({
            showLoader: false,
          });
        }
      );
    }
  };
  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  handleMobileNo = (text) => {
    const reg = /^[0]?[6789]\d{9}$/;
    if (reg.test(text) === false) {
      this.setState({
        mobileNo: text.replace(/\s/g, ""),
      });
    } else {
      if (text.length == 10) {
        Keyboard.dismiss();
        this.setState({
          mobileNo: text.replace(/\s/g, ""),
        });
      }
    }
  };

  handleEmail = (text) => {
    this.setState({
      emailID: text,
    });
  };

  handleName = (text) => {
    this.setState({
      Name: text,
    });
  };
  handleRefer = (text) => {
    this.setState({
      referID: text,
    });
  };

  render() {
    const {
      showLoader,
      countryList,
      countryCode,
      showModal,
      mobileNo,

      Name,
      email,

      isEnabled,
      emailID,
    } = this.state;
    return (
      <SafeAreaView style={styles.main}>
        {showLoader ? <Loader /> : null}
        <HideWithKeyboard style={styles.topView}>
          <View style={styles.topView}>
            <View style={styles.headingView}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Animatable.Text animation="bounceIn" style={styles.appName}>
                EazyPark™
              </Animatable.Text>
              <Text style={styles.appTitle}>
                The smartest way to manage your parking space{" "}
              </Text>
            </View>
            <View style={styles.imgView}>
              <Animatable.Image
                animation="zoomIn"
                style={styles.imgStyle}
                source={loginBg}
              />
            </View>
          </View>
        </HideWithKeyboard>

        <Animatable.View animation="slideInUp" style={styles.contentView}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ marginTop: h(5) }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: h(4),
                  width: "90%",
                }}
              >
                <Text style={styles.loginLabel}>{"Mobile Number"}</Text>
                {/* <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
                <Text style={styles.emailLabel}>{'Email'}</Text> */}
              </View>
              {isEnabled ? (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.loginInput}
                    onChangeText={handleEmail}
                    // value={emailID}
                  />
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <Menu>
                    <MenuTrigger>
                      <Text style={[styles.prefix]}>+{countryCode}</Text>
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ marginLeft: 40 }}>
                      <FlatList
                        data={countryList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <MenuOption
                            onSelect={() => {
                              this.setState({
                                countryCode: item.code,
                              });
                            }}
                          >
                            <View
                              style={{
                                padding: 10,
                                fontFamily: fonts.regular,
                                borderBottomWidth: 0.5,
                                borderColor: "#00000029",
                              }}
                            >
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  style={{
                                    fontFamily: fonts.regular,
                                    paddingLeft: 5,
                                    color: colorCodes.textColor,
                                    marginTop: 2,
                                    paddingRight: 10,
                                  }}
                                >
                                  +{item.code}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: fonts.regular,
                                    paddingLeft: 15,
                                    color: colorCodes.textColor,
                                    marginTop: 2,
                                    borderLeftWidth: 0.5,
                                    borderColor: "#ddd",
                                  }}
                                >
                                  {item.country}
                                </Text>
                              </View>
                            </View>
                          </MenuOption>
                        )}
                      />
                    </MenuOptions>
                  </Menu>
                  <TextInput
                    keyboardType="number-pad"
                    style={styles.loginInput}
                    onChangeText={(value) => {
                      console.log("first", value);
                      this.handleMobileNo(value);
                    }}
                    maxLength={10}
                    // value={value}
                  />
                </View>
              )}
            </View>

            {/* <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.loginLabel, {marginTop: 15}]}>
                  Referral code
                </Text>
                <Text
                  style={[
                    styles.loginLabel,
                    {
                      marginTop: 23,
                      fontSize: 8,
                      marginLeft: 3,
                      fontFamily: fonts.regular,
                    },
                  ]}>
                  (optional)
                </Text>
              </View>
              <TextInput
                ref={inputRef}
                keyboardType="default"
                autoCapitalize="none"
                value={referID}
                style={styles.emailInput}
                onChangeText={handleRefer}
                onBlur={handleNameOnBlur}
              />
            </View> */}
            <WhiteButton name="Register" buttonHandle={() => this.submit()} />

            <TouchableOpacity
              style={styles.tcBtn}
              onPress={() =>
                this.setState({
                  showModal: true,
                })
              }
            >
              <Text style={styles.tcText}>Terms and Condition</Text>
              {showModal ? (
                <InfoModal
                  visible={showModal}
                  closed={() => {
                    this.closeModal();
                  }}
                />
              ) : null}
            </TouchableOpacity>
          </ScrollView>
        </Animatable.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  topView: { flex: 2, justifyContent: "center", alignItems: "center" },
  headingView: { flex: 1, padding: 25, paddingLeft: 30 },
  imgView: { flex: 1, flexDirection: "column-reverse" },
  contentView: {
    flex: 2.3,
    borderTopRightRadius: 15,
    paddingLeft: 35,
    paddingRight: 35,
    borderTopLeftRadius: 15,
    backgroundColor: colorCodes.primaryColor,
    justifyContent: "space-between",
  },
  imgStyle: {
    width: 380,
    height: 380,
    resizeMode: "contain",
    position: "relative",
    bottom: 30,
  },
  welcomeText: {
    color: colorCodes.titleColor,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  appName: {
    color: colorCodes.textColor,
    fontFamily: fonts.bold,
    fontSize: 30,
  },
  appTitle: {
    color: colorCodes.titleColor,
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 5,
  },
  loginInput: {
    fontFamily: fonts.semiBold,
    height: 50,
    lineHeight: 22,
    fontSize: 18,
    color: colorCodes.colorWhite,
    width: "80%",
    marginLeft: 10,
  },
  inputContainer: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    borderColor: "#ffffff40",
    marginTop: 2,
    height: 50,
  },
  prefix: {
    paddingHorizontal: 10,
    color: colorCodes.colorWhite,
    fontFamily: fonts.semiBold,
    fontSize: 18,
    borderRightWidth: 0.5,
    borderColor: "#ffffff40",
  },
  loginLabel: {
    color: colorCodes.colorWhite,
    textAlign: "left",
    fontFamily: fonts.semiBold,
  },
  emailLabel: {
    color: colorCodes.colorWhite,
    textAlign: "left",
    marginLeft: 5,
    fontFamily: fonts.semiBold,
  },
  emailInput: {
    marginTop: 5,
    height: 50,
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 22,
    color: colorCodes.colorWhite,
    borderColor: "#ffffff40",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 30,
    paddingLeft: 10,
  },
  tcBtn: { marginTop: 15, marginBottom: 10 },
  tcText: {
    fontFamily: fonts.regular,
    color: colorCodes.colorWhite,
    textAlign: "center",
  },
  switchs: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});

export default Login;
