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
} from "react-native";
import HideWithKeyboard from "react-native-hide-with-keyboard";

import * as Animatable from "react-native-animatable";
import colorCodes from "../../themes/colorCodes";
import fonts from "../../themes/fonts";
import WhiteButton from "../../components/WhiteButton";
import {
  createSimpleToast,
  getUserData,
  storeUserData,
} from "../../utils/CommanServices";
var loginBg = require("../../../assets/imgs/loginBg.png");
import { httpCall, httpGet } from "../../utils/RestApi";
import Loader from "../../components/Loader";
import { apiName } from "../../../Config";
import { Base64 } from "js-base64";
//import { AuthContext } from "../../appRouting/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SmsRetriever from "react-native-sms-retriever";
import Toast from "react-native-simple-toast";
import { w, h, f } from "../../theme/responsive";
import { CodeField, Cursor } from "react-native-confirmation-code-field";
import Events from "../../utils/event";
const OTPScreen = (props) => {
  //const { signIn } = React.useContext(AuthContext);
  const [otpCode, setOtpCode] = useState("");
  const [showLoader, setLoader] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showChangeNo, setChangeNo] = useState(false);
  const interval = useRef(null);
  const { DeviceId, Mobile, ISDCode, Email, Version, Name, notificationid } =
    props.route.params?.data ? props.route.params.data : [];
  useEffect(() => {
    console.log("props:.", props.route.params);
    if (timer === 30) {
      startTimer();
    }
    console.log("Use effect");
    if (timer < 1) {
      setChangeNo(true);
      clearTimeout(interval.current);
    }
    //  onSmsListenerPressed();
  }, [timer === 1]);

  const onSmsListenerPressed = async () => {
    console.log("onSmsListenerPressed");

    // let msg =
    //   'EazyPark: Thank you for using our service. Your login OTP is 7651. Your OTP will be valid for next 5 minutes. Please do not share this OTP. Message_ID?=?8ciDhudBp4z';
    // const otp = /(\d{4})/g.exec(msg)[1];
    // console.log(otp);
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      console.log("registered", registered);
      if (registered) {
        SmsRetriever.addSmsListener((event) => {
          if (event && event.message) {
            console.log(event.message);
            const otp = /(\d{4})/g.exec(event.message)[1];
            console.log(otp);
            setOtpCode(otp);
          }
          SmsRetriever.removeSmsListener();
        });
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  const submit = () => {
    if (otpCode != "" && otpCode != null && otpCode.length == 4) {
      setLoader(true);
      var req = {
        DeviceId: DeviceId,
        Version: Version,
        OTP: otpCode,
      };

      console.log("validateOtp request params", req);
      httpCall(apiName["validateOtp"], req).then(
        (data) => {
          console.log("reponse of validateOtp", data);
          if (data.respCode == 1) {
            login(data.userId, data.refCode, data.name);
          } else {
            Toast.show("Invalid OTP");
            //createSimpleToast('Invalid OTP', 'failed');
            setLoader(false);
          }
        },
        (error) => {
          Toast.show("*something went wrong please try again later");
          // createSimpleToast(
          //   '*something went wrong please try again later',
          //   'failed',
          // );
          setLoader(false);
        }
      );
    } else {
      Toast.show("please enter valid 4 digit otp.");
      // createSimpleToast('please enter valid 4 digit otp.', 'failed');
    }
  };

  const login = (userId, refCode, name) => {
    var req = {
      UserId: userId,
      DeviceId: DeviceId,
      notificationid: notificationid,
    };
    console.log("validateOtp request params", req);
    httpCall(apiName["login"], req).then((response) => {
      if (response.respCode == 1) {
        console.log("reponse of validateOtp", response);
        getVehicleList(userId);
        var temp = Base64.encode(userId);
        console.log("login Validate OTP:>", response);
        getUserData("userData").then((res) => {
          req["isLogin"] = "true";
          req["UserId"] = temp;
          req["RefCode"] = refCode;
          req["name"] = name;
          storeUserData("userData", { ...res, ...req });

          Events.trigger("loginTrue");
        });
      } else {
        setLoader(false);
        Toast.show("Error Occured :" + response["message"]);
        // createSimpleToast("Error Occured :" + response["message"], "fail");
      }
    });
  };

  const getVehicleList = (userId) => {
    httpGet(apiName["getVehicle"] + userId).then((response) => {
      if (response.respCode == 1) {
        if (response["details"].length > 0) {
          createSimpleToast("Register Vehicle Found", "success");
          getUserData("userData").then((res) => {
            res["isVehicleRegistered"] = "yes";
            res["defaultVehicle"] = response["details"][0].vehRegNumber;
            storeUserData("userData", res);
          });
          // Go To Dashboard
          var foundUser = { userId: userId, isLogin: true };
          //signIn(foundUser);
          setLoader(false);
          // props.navigation.reset({
          //     index: 0,
          //     routes: [{ name: 'Dashboard' }],
          // });
        } else {
          // Go To Add Vehicle
          setLoader(false);
          createSimpleToast("Please add vehicle to continue", "success");
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Add Vehicle" }],
          });
        }
      } else {
        setLoader(false);
      }
    });
  };

  const resendOtp = () => {
    setLoader(true);
    var req = {
      Email: Email,
      ISDCode: "+" + ISDCode,
      Mobile: Mobile,
      DeviceId: DeviceId,
      Version: Version,
      Name: Name,
    };
    httpCall(apiName["createOtp"], req).then(
      (data) => {
        if (data.respCode == 1) {
          createSimpleToast("Otp Resent", "success");
          startTimer();
          setLoader(false);
        } else {
          createSimpleToast(
            "*something went wrong please try again later",
            "failed"
          );
          setLoader(false);
        }
      },
      (error) => {
        createSimpleToast(
          "*something went wrong please try again later",
          "failed"
        );
        setLoader(false);
      }
    );
  };

  const startTimer = () => {
    setTimer(30);
    interval.current = setInterval(
      () => setTimer((prevCount) => prevCount - 1),
      1000
    );
  };

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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View>
            <Text style={styles.loginLabel}>
              We have sent an OTP to verify your mobile number. Please provide
              the OTP.
            </Text>
            <CodeField
              //ref={ref}
              {...props}
              returnKeyType={"done"}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={otpCode}
              onChangeText={(value) => {
                setOtpCode(value);
              }}
              blurOnSubmit={true}
              cellCount={4}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[
                    styles.cell,
                    isFocused && styles.focusCell,
                    symbol && styles.filledCell,
                  ]}
                  //onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
            {/* <OTPInputView
              style={{ fontFamily: fonts.semiBold, height: 50, marginTop: 20 }}
              pinCount={4}
              code={otpCode}
              onCodeChanged={(code) => {
                setOtpCode(code);
              }}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code) => {
                // console.log(`Code is ${code}, you are good to go!`);
              }}
            /> */}
          </View>

          <View style={{ marginTop: 5, marginBottom: 20 }}>
            {timer > 1 ? (
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 14,
                    paddingLeft: 30,
                    paddingRight: 30,
                    color: "#FFFFFF",
                    textAlign: "center",
                    width: "100%",
                    fontFamily: "Segoe_UI_Regular",
                  }}
                >
                  Did not receive OTP?
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    paddingLeft: 30,
                    paddingRight: 30,
                    color: "#FFFFFF",
                    textAlign: "center",
                    width: "100%",
                    fontFamily: "Segoe_UI_Regular",
                  }}
                >
                  Resend OTP in {timer} Sec remaining
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.tcBtn} onPress={resendOtp}>
                <Text style={styles.tcText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          <WhiteButton name="Confirm" buttonHandle={() => submit()} />
          {showChangeNo ? (
            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              style={[styles.tcBtn, { paddingTop: 10 }]}
            >
              <Text style={styles.tcText}>Change mobile number</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </Animatable.View>
    </SafeAreaView>
  );
};

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
  loginLabel: {
    marginTop: 30,
    paddingBottom: 5,
    color: colorCodes.colorWhite,
    textAlign: "center",
    fontFamily: fonts.regular,
  },

  tcBtn: { marginTop: 15, marginBottom: 10 },
  tcText: {
    fontFamily: fonts.regular,
    color: colorCodes.colorWhite,
    textAlign: "center",
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 0.8,
    borderBottomWidth: 1,
    borderRadius: 4,
    // backgroundColor: "#FFF",
    color: colorCodes.colorWhite,
    fontSize: 15,
  },

  underlineStyleHighLighted: {
    borderColor: "#FFF",
    color: colorCodes.colorWhite,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: w(12),
    height: w(12),
    lineHeight: w(12),
    borderRadius: 5,
    fontSize: f(1.6),
    fontFamily: fonts.semiBold,
    borderWidth: 1,
    color: colorCodes.colorWhite,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colorCodes.colorWhite,
    backgroundColor: colorCodes.primaryColor,
    textAlign: "center",
    alignSelf: "center",
  },
  focusCell: {
    borderColor: colorCodes.colorWhite,
    backgroundColor: colorCodes.primaryColor,
  },
  filledCell: {
    backgroundColor: colorCodes.primaryColor,
  },
});

export default OTPScreen;
