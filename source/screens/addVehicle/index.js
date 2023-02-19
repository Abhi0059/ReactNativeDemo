import React, { Component } from "react";
import {
  BackHandler,
  SafeAreaView,
  Image,
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import LinearGradient from "react-native-linear-gradient";
import global from "../../themes/global";
import colorCodes from "../../themes/colorCodes";
import fonts from "../../themes/fonts";
import DeviceInfo from "react-native-device-info";
import CommanServices from "../../utils/comman";
import { apiName } from "../../../Config";
import { Base64 } from "js-base64";
import RNPickerSelect from "react-native-picker-select";
import RNMinimizeApp from "react-native-minimize";
import RestApi from "../../utils/restapii";
import Popover from "react-native-popover-view";
var restApi = new RestApi();
var commanService = new CommanServices();
var backbutton = require("../../../assets/imgs/backbutton.png");
var carIcon = require("../../../assets/imgs/car.png");
var bikeIcon = require("../../../assets/imgs/motorbike.png");
var wheelIcon = require("../../../assets/imgs/tuk-tuk.png");
var bikeBlack = require("../../../assets/imgs/bicycleBlack.png");
var carBlack = require("../../../assets/imgs/carBlack.png");
var tuktukBlack = require("../../../assets/imgs/tuk-tuk_Black.png");
var threeDots = require("../../../assets/imgs/threeDots.png");
var download = require("../../../assets/imgs/download.png");
var favouriteParkings = require("../../../assets/imgs/favouriteParkings.png");
var resolve = require("../../../assets/imgs/resolve.png");
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
export default class AddVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      activeSlide: 0,
      deviceId: "",
      vehicleType: 0,
      vehicleNo: "",
      vehicleModal: "",
      showEmailErr: false,
      vehicleNoError: "",
      modalType: [],
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.getDeviceInfo();
    this.getVehicleType();
  }

  getVehicleType() {
    console.log("getVehicleType[]");
    var _this = this;
    this.setState({ showLoader: true });
    restApi.setUrl(apiName["vehicleType"]);
    restApi.getRequest(function (response) {
      if (response.respCode == 1) {
        _this.setState({ showLoader: false });
        console.log("apiName[]", response);
        if (response.details.length > 0) {
          _this.getModalType(response.details[0].type_id);
          var idToRemove = 3;
          var filteredPeople = response.details.filter(
            (item) => item.type_id !== idToRemove
          );
          console.log("apiName[filteredPeople]", filteredPeople);
          _this.setState({
            entries: filteredPeople,
            vehicleType: response.details[0].type_id,
          });
        }
      } else {
        console.log("elese getVehicleType[]");
        var dummyData = {
          details: [
            {
              id: "5fcb38fb55cea99bf95a36fc",
              type_id: 1,
              type_name: "Bike",
            },
            {
              id: "5fcb397ce524ee5e7422279c",
              type_id: 3,
              type_name: "Auto",
            },
            {
              id: "5fcb3942e524ee5e7422279b",
              type_id: 2,
              type_name: "Car",
            },
          ],
          respCode: 1,
          version: null,
          message: null,
        };
        _this.getModalType(dummyData.details[0].type_id);
        var idToRemove = 3;
        var filteredPeople = dummyData.details.filter(
          (item) => item.type_id !== idToRemove
        );
        console.log("elese getVehicleType[]", filteredPeople);
        _this.setState({
          entries: filteredPeople,
          vehicleType: dummyData.details[0].type_id,
        });
        _this.setState({ showLoader: false });
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    //console.log('onBackPress', this.props.route.params.from);
    if (this.props.route.params?.from === "vehicleRegisteration") {
      this.props.navigation.push("VehicleRegisteration");
    } else if (this.props.route.params?.from === "RequestPass") {
      //this.props.navigation.push('RequestPassTab');
      //this.props.navigation.navigate('RequestPassTab');
      // this.props.navigation.goBack();
    } else {
      RNMinimizeApp.minimizeApp();
      return true;
    }
  };
  onBackPressed = () => {
    // console.log('onBackPressed', this.props.route.params.from);
    if (this.props.route.params?.from === "vehicleRegisteration") {
      // this.props.navigation.navigate('VehicleRegisteration')
      this.props.navigation.push("VehicleRegisteration");
      //this.props.navigation.goBack();
    } else if (this.props.route.params?.from === "RequestPass") {
      //this.props.navigation.push('RequestPassTab');
      //this.props.navigation.navigate('RequestPassTab');
      this.props.navigation.goBack();
    } else {
      RNMinimizeApp.minimizeApp();
      return true;
    }
  };

  getModalType(typeId) {
    var _this = this;
    restApi.setUrl(apiName["vehicleModal"] + typeId);
    restApi.getRequest(function (response) {
      console.log("apiName[vehicleModal]", response);
      console.log("OhBHai", response);
      if (response.respCode == 1) {
        _this.setState({ showLoader: false });
        if (response.details.length > 0) {
          var data = [];
          for (let i = 0; i < response.details.length; i++) {
            var a = {};
            a = {
              label: response.details[i].model_name,
              value: response.details[i].model_name,
              model_id: response.details[i].model_id,
              type_id: response.details[i].type_id,
            };
            data.push(a);
          }
          _this.setState({ modalType: data });
        }
      } else {
        _this.setState({ showLoader: false });
      }
    });
  }

  getDeviceInfo() {
    DeviceInfo.getAndroidId().then((androidId) => {
      console.log(androidId);
      this.setState({ deviceId: androidId });
      // androidId here
    });
  }

  addVehicle() {
    console.log("addVehicle");
    var _this = this;
    var userId = "";
    commanService.getData("userData").then((res) => {
      console.log(res);
      userId = Base64.decode(res["UserId"]);
    });
    var model_id;
    if (this.state.vehicleNoError) {
      commanService.createSimpleToast(
        "*Please enter valid vehicle no. For eg: MH-31-AB-1234"
      );
      return;
    }
    for (let i = 0; i < this.state.modalType.length; i++) {
      if (this.state.vehicleModal == this.state.modalType[i].value) {
        model_id = this.state.modalType[i].model_id;
      }
    }
    // if (this.state.vehicleType == 2) {
    //   if (this.state.vehicleModal == '') {
    //     // this.setState({ vehicleNoError: "*Please select model type to continue." })
    //     commanService.createSimpleToast(
    //       '*Please select model type to continue.',
    //       'error',
    //     );
    //     return;
    //   }
    // }
    if (this.state.vehicleNo == "") {
      // alert("Please Valid Registration no. to continue")
      commanService.createSimpleToast(
        "Please Add Vehicle Registeration No.",
        "fail"
      );
      // this.setState({ vehicleNoError: "*Please enter registration no. and select modal type to continue." })
      return;
    } else {
      this.setState({ showLoader: true });

      setTimeout(() => {
        var req = {
          UserId: userId,
          VehRegNumber: this.state.vehicleNo.toUpperCase(),
          VehicleType: this.state.vehicleType,
          VehicleModel: 1,
          // this.state.vehicleType == 1 || this.state.vehicleType == 3
          //   ? 1
          //   : model_id,
        };
        console.log("REQUEST:>>", req);
        restApi.setUrl(apiName["addVehicle"]);
        restApi.setReq(req);
        restApi.sendRequest(function (response) {
          // setTimeout(() => {
          //     restApi.returnResponse(function (response) {
          console.log("apiName[]", response);
          console.log("OhBHai", response);
          if (response.respCode == 1) {
            commanService.getData("userData").then((res) => {
              var a = res;
              console.log(response["details"]);
              a["isVehicleRegistered"] = "yes";
              a["defaultVehicle"] = response["details"]["vehRegNumber"];
              a["vehicleType"] = _this.state.vehicleType; //response['details']['VehicleType']
              // a['LisencePlate'] = req["LisencePlate"]
              // a['VehicleType'] = req["VehicleType"]
              // a['VehicleClass'] = req["VehicleClass"]
              commanService.storeData("userData", a);
            });
            _this.setState({
              vehicleNo: "",
            });
            if (_this.props.route.params?.from === "vehicleRegisteration") {
              _this.props.navigation.push("VehicleRegisteration");
            } else if (_this.props.route.params?.from === "RequestPass") {
              // _this.props.navigation.push('RequestPassTab');
              _this.props.navigation.goBack();
            } else {
              _this.props.navigation.navigate("Dashboard");
            }
            _this.setState({ showLoader: false });
            commanService.createSimpleToast(
              "Vehicle Register Successfully",
              "success"
            );
          } else {
            _this.setState({ showLoader: false });
            commanService.createSimpleToast(
              "Something went wrong, Please try again later",
              "error"
            );
          }
        });
      }, 500);
    }
  }

  _renderItem = ({ item, index }) => {
    console.log(item);
    console.log(index, this.state.activeSlide);
    return this.state.activeSlide == index ? (
      <LinearGradient
        onPress={() => this.select(index, item)}
        useAngle={true}
        angle={180}
        colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
        style={styles.gradientView}
      >
        <TouchableOpacity
          // onPress={() => this.select(index, item)}
          style={styles.cardMainView}
        >
          <View style={styles.imgView}>
            <Image
              onPress={() => this.select(index, item)}
              style={styles.imgIcons}
              source={
                item.type_id == 1
                  ? bikeIcon
                  : item.type_id == 2
                  ? carIcon
                  : wheelIcon
              }
            />
          </View>
          <Text
            //  onPress={() => this.select(index, item)}
            style={styles.vehicleText}
          >
            {item.type_name}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    ) : (
      <TouchableOpacity
        onPress={() => this.select(index, item)}
        style={{
          backgroundColor: "#D8F6F2",
          width: 100,
          height: 130,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          marginLeft: 5,
        }}
      >
        <View style={styles.imgView}>
          <Image
            style={styles.imgIcons}
            source={
              item.type_id == 1
                ? bikeBlack
                : item.type_id == 2
                ? carBlack
                : tuktukBlack
            }
          />
        </View>
        <Text style={[styles.vehicleText, { color: colorCodes.titleColor }]}>
          {item.type_name}
        </Text>
      </TouchableOpacity>
    );
  };

  select = (index, item) => {
    console.log("select");
    this.setState(
      {
        activeSlide: index,
        vehicleType: item.type_id,
        showLoader: true,
      },
      () => {
        setTimeout(() => {
          this.getModalType(item.type_id);
        }, 500);
      }
    );
  };

  handleRegisterationNo = (text) => {
    const reg = /^[A-Z|a-z]{2}\s?[0-9]{1,2}\s?[A-Z|a-z]{0,3}\s?[0-9]{4}$/;
    console.log(reg.test(text));
    if (reg.test(text)) {
      Keyboard.dismiss();
      this.setState({ vehicleNo: text, vehicleNoError: "" });
    } else {
      this.setState({
        vehicleNoError: "*Please enter valid vehicle no. For eg: MH31AB1234",
        vehicleNo: text,
      });
    }
    //     console.log("1")
    //     if (text.length < 10) {
    //         this.setState({
    //             vehicleNoError: "*Please enter valid vehicle no. For eg: MH31DJ8271",
    //             vehicleNo: text,
    //         });
    //     console.log("12")
    //         return false;
    //     } else {
    //         if (text.length == 10) {
    //             Keyboard.dismiss();
    // this.setState({ vehicleNo: text, vehicleNoError: '' })
    //     console.log("123")

    //         }

    //         else {
    //             console.log("1234")
    //             this.setState({ showMobileErr: true })
    //         }

    //         return true;
    //     }

    // }
  };

  handleModalNo = (text) => {
    // let reg = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    // if (reg.test(text) === false) {
    //     this.setState({ showEmailErr: true })
    // }
    // else {
    this.setState({ vehicleModal: text, showEmailErr: false });
    // }
  };

  render() {
    const { entries } = this.state;
    console.log(entries);
    return (
      <SafeAreaView>
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
        <ScrollView style={{ height: "100%", backgroundColor: "#fff" }}>
          <View style={styles.TopView}>
            {/* {this.props.route.params != undefined ?  */}
            <TouchableOpacity
              style={[styles.backBtn]}
              onPress={() => this.onBackPressed()}
            >
              <Image
                onPress={() => this.select(index, item)}
                style={{
                  width: 25,
                  height: 25,
                  zIndex: 120,
                }}
                source={backbutton}
              />
            </TouchableOpacity>
            {/* : null} */}
            <View style={styles.welcomeView}>
              <Text style={[global.welcomeText, { fontSize: 18 }]}>
                We need your basic
              </Text>
              <Text style={global.appName}>Information</Text>
              <Text style={[global.appTitle, { fontFamily: fonts.semiBold }]}>
                Add Vehicle
              </Text>
              {/* <Text style={[global.appTitle, { marginTop: -17 }]}>You can choose all that apply</Text> */}
            </View>
            <FlatList
              contentContainerStyle={{ marginLeft: 5 }}
              horizontal={true}
              data={entries}
              renderItem={this._renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
            {/* <Carousel
              ref={(c) => {
                this._carousel = c;
              }}
              data={entries}
              renderItem={this._renderItem}
              sliderWidth={330}
              itemWidth={110}
              autoplay={false}
              scrollEnabled={false}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              firstItem={this.state.activeSlide}
              activeSlideAlignment={'start'}
              // activeSlideAlignment={
              //   this.state.activeSlide == 0
              //     ? 'start'
              //     : this.state.activeSlide == 1
              //     ? 'center'
              //     : this.state.activeSlide == 2
              //     ? 'end'
              //     : 'start'
              // }
              enableSnap={false}
              onSnapToItem={(index) => this.setState({activeSlide: index})}
            /> */}
          </View>

          <View
            style={{
              padding: 0,
              margin: 0,
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <View
              style={{
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                width: "100%",
                padding: 0,
                backgroundColor: "#FFFFFF",
                height: "100%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  paddingBottom: 10,
                  marginLeft: 80,
                  color: "#01313C",
                  textAlign: "left",
                  width: "100%",
                  fontFamily: "Segoe_UI_Regular",
                  fontWeight: "600",
                }}
              >
                Registration No.
              </Text>
              <TextInput
                keyboardType="name-phone-pad"
                placeholder="MH31AB1234"
                placeholderTextColor="#01313c70"
                // autoCapitalize={'characters'}
                // secureTextEntry={false}
                style={[
                  global.textBox,
                  {
                    borderColor: "#01313c40",
                    borderWidth: 0.5,
                    borderRadius: 5,
                    fontFamily: "Segoe_UI_Bold",
                  },
                ]}
                onChangeText={this.handleRegisterationNo}
                value={this.state.vehicleNo}
              />
              {/* {this.state.vehicleNoError != "" ?
                                <Text style={[global.OtpErrorText], { marginLeft: 90, width: '100%', color: 'red', marginRight: 30, fontSize: 12 }}>{this.state.vehicleNoError}</Text>
                                : null
                            } */}

              {/* {this.state.vehicleType == 1 ||
              this.state.vehicleType == 3 ? null : (
                <View style={{width: '100%'}}>
                  <Text
                    style={{
                      paddingTop: 20,
                      paddingBottom: 10,
                      marginLeft: 40,
                      color: '#01313C',
                      textAlign: 'left',
                      width: '100%',
                      fontFamily: 'Segoe_UI_Regular',
                      fontWeight: '600',
                    }}>
                    Make Model
                  </Text>

                  <View>
                    <Menu>
                      <MenuTrigger>
                        <View
                          style={{
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                            width: '100%',
                            padding: 0,
                            backgroundColor: '#FFFFFF',
                            alignItems: 'center',
                          }}>
                          <TextInput
                            keyboardType="name-phone-pad"
                            placeholder="Select Car Model"
                            autoCompleteType={'off'}
                            placeholderTextColor="#01313c70"
                            editable={false}
                            style={[
                              global.textBox,
                              {
                                borderColor: '#01313c40',
                                borderWidth: 0.5,
                                borderRadius: 5,
                              },
                            ]}
                            value={this.state.vehicleModal}
                          />
                        </View>
                      </MenuTrigger>
                      <MenuOptions optionsContainerStyle={{marginLeft: 40}}>
                        <FlatList
                          data={this.state.modalType}
                          renderItem={({item}) => (
                            <MenuOption
                              onSelect={() =>
                                this.setState({vehicleModal: item.value})
                              }>
                              <View
                                style={{
                                  padding: 10,
                                  fontFamily: fonts.regular,
                                  borderBottomWidth: 0.5,
                                  borderColor: '#00000029',
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                  <Image
                                    source={carBlack}
                                    style={{
                                      width: 20,
                                      height: 20,
                                      resizeMode: 'contain',
                                      zIndex: 300,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      fontFamily: fonts.regular,
                                      paddingLeft: 5,
                                      color: colorCodes.textColor,
                                      marginTop: 2,
                                    }}>
                                    {item.value}
                                  </Text>
                                </View>
                              </View>
                            </MenuOption>
                          )}
                        />
                      </MenuOptions>
                    </Menu>
                  </View>
                </View>
              )} */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  width: "100%",
                  padding: 15,
                  paddingTop: 40,
                  paddingBottom: 100,
                }}
              >
                <LinearGradient
                  useAngle={true}
                  angle={260}
                  colors={["#9C28E9", "#3240B1"]}
                  style={{
                    alignItems: "center",
                    backgroundColor: "transparent",
                    width: "90%",
                    height: 50,
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.addVehicle();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        padding: 12,
                        height: 50,
                        textAlign: "center",
                        color: "#FFFFFF",
                        fontFamily: fonts.semiBold,
                        fontWeight: "600",
                      }}
                      onPress={() => {
                        this.addVehicle();
                      }}
                    >
                      ADD VEHICLE AND PROCEED
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  gradientView: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    width: 100,
    height: 130,
    padding: 0,
    paddingBottom: 2,
    alignItems: "center",
    alignContent: "center",
    marginLeft: 5,
  },
  cardMainView: {
    height: "100%",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    width: "100%",
    borderColor: "#3b116b75",
    borderWidth: 0.5,
    // shadowColor: '#3b116b75',
    // shadowOffset: { width: 0, height: 0.5 },
    // shadowOpacity: 0.1,
    // shadowRadius: 1,
    // elevation: 1,
  },
  imgView: { width: 50, height: 50, paddingTop: 30 },
  imgIcons: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    position: "absolute",
    margin: 25,
  },
  vehicleText: {
    textAlign: "center",
    paddingTop: 30,
    fontFamily: "Segoe_UI_Regular",
    fontSize: 14,
    color: "#FFFFFF",
  },
  TopView: { padding: 20, backgroundColor: colorCodes.colorWhite },
  welcomeView: {
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
  },
});
