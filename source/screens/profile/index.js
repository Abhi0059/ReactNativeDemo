import React, { Component, createRef } from "react";
import colorCodes from "../../themes/colorCodes";
import fonts from "../../themes/fonts";
import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  BackHandler,
  ActivityIndicator,
  NativeModules,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Base64 } from "js-base64";
import global from "../../themes/global";
import { httpCall } from "../../utils/RestApi";
import { apiName } from "../../../Config";
var backbutton = require("../../../assets/imgs/whitebackbutton.png");
var profileImg = require("../../../assets/imgs/profile.png");
var medal_blue = require("../../../assets/imgs/medal_blue.png");
var camera = require("../../../assets/imgs/camera.png");
var gallery = require("../../../assets/imgs/gallery.png");
var pen = require("../../../assets/imgs/pen.png");
var resolve = require("../../../assets/imgs/resolve.png");
var profileBg = require("../../../assets/imgs/profileBg.png");
var location = require("../../../assets/imgs/location_white.png");

import HideWithKeyboard from "react-native-hide-with-keyboard";
import CommanServices from "../../utils/comman";
var commanService = new CommanServices();
const actionSheetRef = createRef();
import ActionSheet from "react-native-actions-sheet";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      phoneNo: "",
      name: "",
      city: "",
      userImg: "",
      showLoader: false,
    };
    this.getUserData();
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    console.log(this.props);
    this.getUserProfileData();
  }

  onBackPress = () => {
    this.props.navigation.navigate("Home");
    return true;
  };

  getUserData() {
    commanService.getData("userData").then((res) => {
      console.log(res);
      var a = res;
      this.setState({
        email: res["Email"],
        phoneNo: res["Mobile"],
        name: res["Name"],
        city: res["city"],
        userImg: res["userImg"],
      });
      console.log(res["userImg"]);
    });
  }

  // logout() {
  //   var _this = this;
  //   Alert.alert(
  //     'Please Confirm!',
  //     'Do you really want to logout?',
  //     [
  //       {
  //         text: 'No',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Logout',
  //         onPress: () => {
  //           commanService.deleteData('userData');
  //           commanService.storeData('userData', {isIntroPage: false});
  //           commanService.createSimpleToast('Logout Successful', 'success');
  //           NativeModules.DevSettings.reload();
  //         },
  //       },
  //     ],
  //     {cancelable: false},
  //   );
  // }

  handleName = (text) => {
    // let reg = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    // if (reg.test(text) === false) {
    //     this.setState({ showEmailErr: true })
    // }
    // else {
    // this.setState({ showEmailErr: false })
    this.setState({ name: text });
    commanService.getData("userData").then((res) => {
      var a = res;
      a["name"] = text;
      commanService.storeData("userData", a);
    });
    // }
  };

  getUserProfileData = () => {
    this.setState({ showLoader: true });
    commanService.getData("userData").then((data) => {
      let req = {
        userId: Base64.decode(data.UserId),
      };
      req = { ...req };
      console.log("toastMessage", req);

      httpCall(apiName.getUserProfile, req).then((res) => {
        console.log("getUserProfileData", res);
        if (res.respCode) {
          const { data } = res;
          const { mobile, name, emailId, city } = data;
          console.log(res);
          this.setState({
            phoneNo: mobile,
            email: emailId,
            name: name,
            city: city,
            userImg: "",
            showLoader: false,
          });
        } else {
          this.setState({ showLoader: false });
          alert(res.message);
        }
      });
    });
  };

  setUserProfileData = () => {
    const { email, phoneNo, name, city, userImg } = this.state;
    commanService.getData("userData").then((data) => {
      let req = {
        userId: Base64.decode(data.UserId),
        name: name,
        emailid: email,
        city: city,
      };
      req = { ...req };
      console.log("toastMessage", req);
      this.setState({ showLoader: true });
      httpCall(apiName.setUserProfile, req).then((res) => {
        console.log("setUserProfileData", res);
        if (res.respCode) {
          const { data } = res;
          const { mobile, name, emailId } = data;
          console.log(res);
          this.setState({
            phoneNo: mobile,
            name: name,
            email: emailId,
            showLoader: false,
          });
          alert("Data submitted successfully");
        } else {
          this.setState({ showLoader: false });
          alert(res.message);
        }
      });
    });
  };

  handleCity = (text) => {
    this.setState({ city: text });
    commanService.getData("userData").then((res) => {
      var a = res;
      a["city"] = text;
      commanService.storeData("userData", a);
    });
    // }
  };

  handleEmail = (text) => {
    this.setState({ email: text });
  };

  showActionSheet() {
    actionSheetRef.current?.setModalVisible();
  }

  openCamera() {
    actionSheetRef.current?.hide();
    commanService.launchCamera(this.props);
  }

  openGallery() {
    actionSheetRef.current?.hide();
    commanService.launchImageLibrary(this.props);
  }

  render() {
    let actionSheet;

    return (
      <SafeAreaView style={{ backgroundColor: colorCodes.colorWhite }}>
        {this.state.showLoader ? (
          <View style={global.loaderStyle}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : null}
        <StatusBar
          backgroundColor={colorCodes.colorWhite}
          barStyle={"dark-content"}
          translucent={false}
        />
        <View>
          <ScrollView style={{ height: "100%" }}>
            <View>
              <View style={styles.header}>
                <View
                  style={styles.headerTitleWrapper}
                  onPress={() => this.props.navigation.replace("Home")}
                >
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => this.props.navigation.replace("Home")}
                  >
                    <Image
                      onPress={() => this.select(index, item)}
                      style={{
                        width: 25,
                        height: 25,
                        position: "absolute",
                      }}
                      source={backbutton}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.headerTitleText,
                      { zIndex: 100, marginTop: 7, paddingLeft: 15 },
                    ]}
                    onPress={() => this.props.navigation.replace("Home")}
                  >
                    {"Profile"}
                  </Text>
                </View>
                <Image
                  onPress={() => this.select(index, item)}
                  style={{
                    width: "100%",
                    height: 310,
                    top: -110,
                    right: 0,
                    position: "absolute",
                  }}
                  source={profileBg}
                />
                <View style={{ width: "100%", alignItems: "center" }}>
                  <Image
                    style={{
                      width: 27,
                      height: 35,
                      zIndex: 100,
                      left: 205,
                      top: 55,
                      position: "absolute",
                    }}
                    source={medal_blue}
                  />
                  <View
                    // useAngle={true}
                    //   angle={260} colors={['#9C28E9', '#3240B1']}
                    style={{
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                      marginTop: -30,
                      marginBottom: 40,
                      zIndex: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={{ marginTop: 80, alignItems: "center" }}
                      onPress={() => this.showActionSheet()}
                    >
                      {this.state.userImg == undefined ||
                      this.state.userImg == "" ? (
                        <Image
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 150 / 2,
                            overflow: "hidden",
                            borderWidth: 0.1,
                          }}
                          source={profileImg}
                        />
                      ) : (
                        <Image
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 150 / 2,
                            overflow: "hidden",
                            borderWidth: 0.1,
                          }}
                          source={{ uri: this.state.userImg }}
                        />
                      )}

                      {this.state.name != "" ? (
                        <Text
                          style={{
                            marginTop: 5,
                            fontFamily: fonts.semiBold,
                            fontSize: 16,
                            color: colorCodes.colorWhite,
                          }}
                        >
                          {this.state.name}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            marginTop: 5,
                            fontFamily: fonts.semiBold,
                            fontSize: 16,
                            color: colorCodes.colorWhite,
                          }}
                        >
                          {this.state.email}
                        </Text>
                      )}
                      {this.state.city != "" ? (
                        <View style={{ flexDirection: "row" }}>
                          <Image
                            onPress={() => this.select(index, item)}
                            style={{
                              width: 15,
                              height: 15,
                              left: -15,
                              position: "absolute",
                            }}
                            source={location}
                          />
                          <Text
                            style={{
                              fontFamily: fonts.regular,
                              fontSize: 12,
                              color: colorCodes.colorWhite,
                            }}
                          >
                            {this.state.city}
                          </Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View
                style={{
                  color: "#04093F",
                  marginBottom: 40,
                  flexDirection: "row",
                  textAlign: "left",
                  paddingLeft: 20,
                  fontSize: 15,
                  marginRight: 10,
                  marginTop: 5,
                }}
              >
                <View style={styles.loginCardView}>
                  {/* <View style={styles.cardView}>
                    <Text style={styles.loginLabel}>Email ID</Text>
                    <TextInput
                      ref={(input) => { this.secondTextInput = input; }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[styles.emailInput, {backgroundColor:'#ddd'}]}
                      onChangeText={this.handleEmail}
                      value={this.state.email}
                      editable={false}
                    />
                  </View> */}
                  <View style={styles.cardView}>
                    <Text style={styles.loginLabel}>Contact Number</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        { backgroundColor: "#ddd" },
                      ]}
                    >
                      <Text
                        style={[styles.prefix, { backgroundColor: "#ddd" }]}
                      >
                        +91
                      </Text>
                      <TextInput
                        keyboardType="number-pad"
                        style={[styles.loginInput, { backgroundColor: "#ddd" }]}
                        onChangeText={this.handleMobileNo}
                        maxLength={10}
                        value={this.state.phoneNo}
                        editable={false}
                      />
                    </View>
                  </View>
                  <View style={styles.cardView}>
                    <Text style={styles.loginLabel}>Name</Text>
                    <View style={{ flexDirection: "row" }}>
                      <TextInput
                        ref={(input) => {
                          this.secondTextInput = input;
                        }}
                        keyboardType="default"
                        autoCapitalize="words"
                        placeholder="Enter name here"
                        style={styles.emailInput}
                        onChangeText={this.handleName}
                        value={this.state.name}
                        editable={true}
                      />
                      {/* {this.state.name != '' ? (
                        <TouchableOpacity
                          // onPress={() => this.clearText()}
                          style={{
                            zIndex: 300,
                            position: 'absolute',
                            right: 45,
                            top: 15,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                              resizeMode: 'contain',
                            }}
                            source={pen}
                          />
                        </TouchableOpacity>
                      ) : (
                        <Image
                          style={{
                            width: 15,
                            height: 15,
                            position: 'absolute',
                            right: 45,
                            top: 15,
                            resizeMode: 'contain',
                          }}
                          source={pen}
                        />
                      )} */}
                    </View>
                  </View>
                  <View style={[styles.cardView]}>
                    <Text style={styles.loginLabel}>City</Text>
                    <View style={{ flexDirection: "row" }}>
                      <TextInput
                        ref={(input) => {
                          this.secondTextInput = input;
                        }}
                        keyboardType="default"
                        autoCapitalize="words"
                        placeholder="Enter City here"
                        style={styles.emailInput}
                        onChangeText={this.handleCity}
                        value={this.state.city}
                        editable={true}
                      />
                      {/* {this.state.city != '' ? (
                        <TouchableOpacity
                          //onPress={() => this.clearText()}
                          style={{
                            zIndex: 300,
                            position: 'absolute',
                            right: 45,
                            top: 15,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                              resizeMode: 'contain',
                            }}
                            source={pen}
                          />
                        </TouchableOpacity>
                      ) : (
                        <Image
                          style={{
                            width: 30,
                            height: 30,
                            position: 'absolute',
                            right: 40,
                            top: 7,
                            resizeMode: 'contain',
                          }}
                          source={resolve}
                        />
                      )} */}
                    </View>
                  </View>
                  <View style={[styles.cardView, { marginBottom: 30 }]}>
                    <Text style={styles.loginLabel}>Email Id</Text>
                    <View style={{ flexDirection: "row" }}>
                      <TextInput
                        ref={(input) => {
                          this.secondTextInput = input;
                        }}
                        keyboardType="default"
                        autoCapitalize="words"
                        placeholder="Enter Email Id here"
                        style={styles.emailInput}
                        onChangeText={this.handleEmail}
                        value={this.state.email}
                        editable={true}
                      />
                      {/* {this.state.city != '' ? (
                        <TouchableOpacity
                          //onPress={() => this.clearText()}
                          style={{
                            zIndex: 300,
                            position: 'absolute',
                            right: 45,
                            top: 15,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                              resizeMode: 'contain',
                            }}
                            source={pen}
                          />
                        </TouchableOpacity>
                      ) : (
                        <Image
                          style={{
                            width: 30,
                            height: 30,
                            position: 'absolute',
                            right: 40,
                            top: 7,
                            resizeMode: 'contain',
                          }}
                          source={resolve}
                        />
                      )} */}
                    </View>
                  </View>
                  <ActionSheet ref={actionSheetRef}>
                    <View style={{ flexDirection: "column" }}>
                      <View style={styles.menuView}>
                        <Image style={styles.menuIcon} source={camera} />
                        <Text
                          style={styles.menuText}
                          onPress={() => this.openCamera("profile")}
                        >
                          Upload From Camera
                        </Text>
                        <Image
                          style={styles.menuIconBack}
                          source={backbutton}
                        />
                      </View>
                      <View style={styles.menuView}>
                        <Image style={styles.menuIcon} source={gallery} />
                        <Text
                          style={styles.menuText}
                          onPress={() => this.openGallery("profile")}
                        >
                          Upload From Gallery
                        </Text>
                        <Image
                          style={styles.menuIconBack}
                          source={backbutton}
                        />
                      </View>
                    </View>
                  </ActionSheet>
                  {/* <View style={{ paddingTop: 5, paddingBottom: 50,marginLeft:-5}}>
                    <TouchableOpacity style={{
                      borderWidth: 1,
                      flexDirection: 'row',
                      elevation: 5,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.8,
                      shadowRadius: 1,
                      shadowColor: "#00000029",
                      borderColor: '#00000029',
                      borderTopRightRadius: 5,
                      borderTopLeftRadius: 5,
                      borderBottomRightRadius: 5,
                      height: 60,
                      // width: 180,
                      marginLeft: 10,
                      backgroundColor: '#FFF',
                      borderBottomLeftRadius: 5, marginTop: 5, alignItems: 'center', alignContent: 'center',
                    }}
                    // onPress={() => this.goToDetails(item)}
                    >
                      <View style={{ paddingLeft: 10 }}>
                        <Image
                          style={{
                            width: 30,
                            height: 30, resizeMode: 'contain',
                          }}
                          source={money}
                        />
                      </View>
                      <Text style={{ padding: 10, fontFamily: 'Segoe_UI_Bold', fontSize: 14, color: '#01313C', marginTop: -3, paddingLeft: 30 }}>Refer and Earn</Text>
                      <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 190 }}>
                        <Image
                          style={{
                            width: 30,
                            height: 30, resizeMode: 'contain',
                            transform: [{ rotate: '180deg' }],
                          }}
                          source={greybackbutton}
                        />
                      </View>
                    </TouchableOpacity>
                    <View style={{ marginTop: 5 }}>
                      <TouchableOpacity style={{
                        borderWidth: 1,
                        flexDirection: 'row',
                        elevation: 5,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.8,
                        shadowRadius: 1,
                        shadowColor: "#00000029",
                        borderColor: '#00000029',
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        height: 60,
                        // width: 180,
                        marginLeft: 10,
                        backgroundColor: '#FFF',
                        borderBottomLeftRadius: 5, marginTop: 5, alignItems: 'center', alignContent: 'center',
                      }}
                      // onPress={() => this.goToDetails(item)}
                      >
                        <View style={{ paddingLeft: 10 }}>
                          <Image
                            style={{
                              width: 30,
                              height: 30, resizeMode: 'contain',
                            }}
                            source={rateUs}
                          />
                        </View>
                        <Text style={{ padding: 10, fontFamily: 'Segoe_UI_Bold', fontSize: 14, color: '#01313C', marginTop: -3, paddingLeft: 30 }}>Rate Us</Text>
                        <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 140 }}>
                          <Image
                            style={{
                              width: 30,
                              height: 30, resizeMode: 'contain',
                              transform: [{ rotate: '180deg' }],
                            }}
                            source={greybackbutton}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View> */}
                </View>
              </View>
            </View>
          </ScrollView>
          <HideWithKeyboard>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center",
                width: "100%",
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <LinearGradient
                useAngle={true}
                onPress={() => {
                  this.logout();
                }}
                angle={260}
                colors={["#9C28E9", "#3240B1"]}
                style={{
                  alignItems: "center",
                  backgroundColor: "transparent",
                  width: "100%",
                  zIndex: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setUserProfileData();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      textTransform: "uppercase",
                      padding: 15,
                      height: 50,
                      textAlign: "center",
                      color: "#FFFFFF",
                      fontFamily: "Segoe_UI_Regular",
                      fontWeight: "600",
                    }}
                    onPress={() => {
                      this.setUserProfileData();
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </HideWithKeyboard>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  menuView: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 0.5,
    marginRight: 15,
    justifyContent: "space-between",
    borderBottomColor: "#00000029",
  },
  menuText: {
    color: "#01313C",
    fontFamily: "Segoe_UI_Regular",
    marginTop: 5,
    width: "60%",
  },
  menuIcon: {
    width: 25,
    height: 25,
  },
  menuIconBack: {
    width: 20,
    height: 20,
    transform: [{ rotate: "180deg" }],
    alignSelf: "flex-end",
  },
  gradientView: {
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    width: 100,
    height: 50,
    padding: 0,
    marginTop: 20,
    alignItems: "center",
    alignContent: "center",
  },
  cardMainView: {
    height: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
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
    height: 200,
    alignItems: "flex-start",
    justifyContent: "center",
    // paddingHorizontal: 20
  },
  headerTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    top: 40,
    left: 10,
  },
  headerTitleText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colorCodes.colorWhite,
  },
  backBtn: {
    width: 20,
    height: 20,
    marginTop: 2,
    marginRight: 10,
    zIndex: 100,
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
    paddingTop: 25,
    paddingLeft: 35,
    paddingBottom: 5,
    color: "#01313C",
    textAlign: "left",
    width: 250,
    fontFamily: fonts.regular,
    fontWeight: "600",
  },
  loginInput: {
    width: "80%",
    fontFamily: fonts.regular,
    height: 40,
    lineHeight: 22,
    fontSize: 17,
    color: colorCodes.black,
    backgroundColor: "#D8F6F2",
    paddingLeft: 15,
    borderColor: "#A3BCD5",
    borderWidth: 1,
    borderRadius: 5,
    borderLeftWidth: 0,
  },
  emailInput: {
    height: 43,
    paddingLeft: 15,
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colorCodes.black,
    backgroundColor: "#D8F6F2",
    marginLeft: 30,
    width: "80%",
    borderColor: "#A3BCD5",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  emailErrText: { marginTop: -30 },
  inputContainer: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8F6F2",
    marginHorizontal: 10,
    borderRadius: 5,
    borderColor: colorCodes.colorWhite,
    width: "80%",
    marginLeft: 30,
    height: 40,
    marginBottom: 20,
    borderColor: "#A3BCD5",
    borderWidth: 1,
    borderRadius: 5,
  },
  prefix: {
    paddingHorizontal: 10,
    color: colorCodes.black,
    fontFamily: fonts.regular,
    fontSize: 18,
    borderRightWidth: 1,
    borderColor: "#A3BCD5",
    backgroundColor: "#D8F6F2",
  },
  cardView: {
    marginTop: 7,
    // elevation: 1,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 1,
    // shadowColor: "#00000057",
    borderWidth: 0.5,
    borderColor: "#00000057",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});

// export default Profile;
