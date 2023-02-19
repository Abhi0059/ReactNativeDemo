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
  FlatList,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";

var backbutton = require("../../../assets/imgs/whitebackbutton.png");

import { url, apiName } from "../../../Config";
import CommanServices from "../../utils/comman";
import RestApi from "../../utils/restapii";
var restApi = new RestApi();
var commanService = new CommanServices();
import { Base64 } from "js-base64";
import global from "../../themes/global";
var profileBg = require("../../../assets/imgs/profileBg.png");
var Sccoter_big = require("../../../assets/imgs/Sccoter_big.png");
var rickshaw_big = require("../../../assets/imgs/rickshaw_big.png");
var carVector = require("../../../assets/imgs/carVector.png");
var bikeblack = require("../../../assets/imgs/bicycleBlack.png");
var wheelBlack = require("../../../assets/imgs/tuk-tuk_Black.png");
var carBlack = require("../../../assets/imgs/carBlack.png");
var uploadLicense = require("../../../assets/imgs/uploadLicense.png");
var verifyVehicle = require("../../../assets/imgs/verifyVehicle.png");
var addVehicle = require("../../../assets/imgs/addVehicle.png");
var uploadRcBook = require("../../../assets/imgs/uploadRcBook.png");
var greybackbutton = require("../../../assets/imgs/backbutton.png");
var camera = require("../../../assets/imgs/camera.png");
var gallery = require("../../../assets/imgs/gallery.png");
import LinearGradient from "react-native-linear-gradient";
const actionSheetRef = createRef();
import ActionSheet from "react-native-actions-sheet";
// const VehicleRegisteration = ({ navigation }) => {
export default class VehicleRegisteration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      vehicleData: [],
      vehicleCount: [],
      showLoader: false,
      vehicleType: 1,
    };
    commanService.getData("userData").then((res) => {
      var a = Base64.decode(res["UserId"]);
      this.setState({ userId: a });
    });
    // setTimeout(() => {
    //   this.getVehicles();
    // }, 500);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    setTimeout(() => {
      // this.getVehicles();
    }, 500);
  }

  onBackPress = () => {
    this.props.navigation.navigate("Home");
    return true;
  };

  showActionSheet() {
    actionSheetRef.current?.setModalVisible();
  }

  openCamera() {
    actionSheetRef.current?.hide();
    commanService.launchCamera();
  }

  openGallery() {
    actionSheetRef.current?.hide();
    commanService.launchImageLibrary();
  }

  getVehicles() {
    var _this = this;
    this.setState({ showLoader: true });
    restApi.setUrl(apiName["getVehicle"] + this.state.userId);
    restApi.getRequest(function (response) {
      if (response.respCode == 1) {
        _this.setState({ showLoader: false });
        console.log(response);
        if (response["details"].length > 0) {
          _this.sortData(response["details"]);

          _this.setState({ vehicleData: response["details"] });
          commanService.getData("userData").then((res) => {
            console.log(res);
            var a = res;
            a["isVehicleRegistered"] = "yes";
            a["defaultVehicle"] = response["details"][0].vehRegNumber;
            a["vehicleType"] = response["details"][0].vehicleType;
            // a['LisencePlate'] = req["LisencePlate"]
            // a['VehicleType'] = req["VehicleType"]
            // a['VehicleClass'] = req["VehicleClass"]
            commanService.storeData("userData", a);
          });
          // commanService.createSimpleToast("Vehicle Already Registered");
          // commanService.getData("userData").then(res => {
          //     console.log(res)
          //     var a = res
          //     a['isVehicleRegistered'] = "yes"
          //     commanService.storeData("userData", a);
          // })
          // _this.props.navigation.navigate("Home");
          // _this.getModalType(response.details[0].type_id)
          // _this.setState({ entries: response.details, vehicleType: response.details[0].type_id });
        } else {
          commanService.getData("userData").then((res) => {
            console.log(res);
            var a = res;
            a["isVehicleRegistered"] = "no";
            commanService.storeData("userData", a);
          });
          _this.props.navigation.navigate("AddVehicle");
        }
      } else {
        _this.setState({ showLoader: false });
      }
    });
  }

  sortData(item) {
    var data = [];
    var a = { car: 0, auto: 0, bike: 0 };
    for (let i = 0; i < item.length; i++) {
      switch (item[i].vehicleType) {
        case 1:
          a["bike"] = a["bike"] + 1;
          break;
        case 2:
          a["car"] = a["car"] + 1;
          break;
        case 3:
          a["auto"] = a["auto"] + 1;
          break;
        default:
          break;
      }
    }
    data.push(
      { id: 1, count: a["bike"] },
      { id: 2, count: a["car"] },
      { id: 3, count: a["auto"] }
    );
    for (let i = 0; i < data.length; i++) {
      var setVehicleType = 1;
      switch (data[i].id) {
        case 1:
          if (data[i].count > 0) {
          } else {
            setVehicleType = 1;
          }
          break;
        case 2:
          if (data[i].count > 0) {
          } else {
            setVehicleType = 2;
          }
          break;
        case 3:
          if (data[i].count == 0) {
          } else {
            setVehicleType = 3;
          }
          break;
        default:
          break;
      }
    }
    this.setState({ vehicleCount: data, vehicleType: setVehicleType });
  }

  _renderItem = ({ item, index }) => {
    return item.count == 0 ? null : (
      // <LinearGradient
      //     onPress={() => this.select(index, item)}
      //     useAngle={true}
      //     angle={180}
      //     colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
      //     style={styles.gradientView} >
      <TouchableOpacity onPress={() => this.select(index, item)}>
        <View style={styles.imgView}>
          <Image
            onPress={() => this.select(index, item)}
            style={styles.imgIcons}
            source={
              item.id == 1 ? bikeblack : item.id == 2 ? carBlack : wheelBlack
            }
          />
        </View>
        <Text
          onPress={() => this.select(index, item)}
          style={{
            position: "absolute",
            left: 10,
            marginLeft: 30,
            textAlign: "center",
            backgroundColor: "#1A8FFF",
            width: 15,
            height: 15,
            borderRadius: 100,
            paddingTop: -10,
            fontSize: 10,
            fontFamily: fonts.regular,
          }}
        >
          {item.count}
        </Text>
      </TouchableOpacity>
    );
    // </LinearGradient>
  };

  _renderVehicle = ({ item, index }) => {
    console.log(item);
    return this.state.vehicleType == item.vehicleType ? (
      // <LinearGradient
      //     onPress={() => this.select(index, item)}
      //     useAngle={true}
      //     angle={180}
      //     colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
      //     style={styles.gradientView} >
      <TouchableOpacity onPress={() => this.deleteVehicle(index, item)}>
        {/* <View style={styles.imgView}>
            <Image
              onPress={() => this.select(index, item)}
              style={styles.imgIcons}
              source={item.id == 1 ? bikeIcon : item.id == 2 ? carIcon : wheelIcon} />
          </View> */}
        <View style={{ paddingLeft: 20, paddingTop: 30 }}>
          <Text style={{ fontFamily: fonts.bold }}>Registration No</Text>
          <Text style={{ fontFamily: fonts.regular, paddingTop: 5 }}>
            {item.vehRegNumber}
          </Text>
          <Image
            source={
              item.vehicleType == 1
                ? Sccoter_big
                : item.vehicleType == 2
                ? carVector
                : rickshaw_big
            }
            style={{
              width: 90,
              height: 90,
              position: "absolute",
              resizeMode: "contain",
              right: 30,
            }}
          />
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: "#00000057",
              paddingBottom: 10,
              marginRight: 30,
            }}
          ></View>
        </View>
      </TouchableOpacity>
    ) : // </LinearGradient>
    null;
  };

  select(index, item) {
    this.setState({ vehicleType: item.id });
  }

  deleteVehicle(index, item) {
    _this = this;
    Alert.alert(
      "Please Confirm!",
      "Do you really want to delete this vehicle?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            var _this = this;
            var req = {
              UserId: this.state.userId,
              VehRegNumber: item.vehRegNumber,
            };
            console.log("REQUEST:>>", req);
            restApi.setUrl(apiName["deleteVehicle"]);
            restApi.setReq(req);
            restApi.sendRequest(function (response) {
              if (response.respCode == 1) {
                // commanService.getData("userData").then(res => {
                //     console.log(res)
                //     var a = res
                //     a['isVehicleRegistered'] = "yes"
                //     // a['LisencePlate'] = req["LisencePlate"]
                //     // a['VehicleType'] = req["VehicleType"]
                //     // a['VehicleClass'] = req["VehicleClass"]
                //     commanService.storeData("userData", a);
                // })
                setTimeout(() => {
                  _this.getVehicles();
                }, 500);
                _this.setState({ showLoader: false });
                commanService.createSimpleToast("Vehicle Deleted", "success");
              } else {
                _this.setState({ showLoader: false });
                commanService.createSimpleToast(
                  "Something went wrong, Please try again later",
                  "fail"
                );
              }
            });
          },
        },
      ],
      { cancelable: false }
    );
  }

  continue() {
    this.props.navigation.navigate("AddVehicle", {
      from: "vehicleRegisteration",
    });
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: colorCodes.colorWhite }}>
        {/* {this.state.showLoader ? <View style={global.loaderStyle}>
          <ActivityIndicator size="large" color="#FFF" />
        </View> : null} */}
        {this.state.showLoader ? (
          <View style={global.loaderStyle}>
            {/* <PreLoader preLoaderVisible={this.state.showLoader} />
             */}
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : null}
        <StatusBar
          backgroundColor={colorCodes.colorWhite}
          barStyle={"dark-content"}
          translucent={false}
        />
        <View style={{ height: "100%" }}>
          <ScrollView>
            <View>
              <View
                // useAngle={true}
                //     angle={180}
                //     colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
                style={styles.header}
              >
                <Image
                  onPress={() => this.select(index, item)}
                  style={{
                    width: "100%",
                    height: 280,
                    top: -110,
                    right: 0,
                    position: "absolute",
                  }}
                  source={profileBg}
                />

                <TouchableOpacity
                  style={styles.headerTitleWrapper}
                  onPress={() => this.props.navigation.navigate("Home")}
                >
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => this.props.navigation.navigate("Home")}
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
                      { zIndex: 100, marginTop: 7, paddingLeft: 5 },
                    ]}
                    onPress={() => this.props.navigation.goBack()}
                  >
                    {"Vehicle Registration"}
                  </Text>
                </TouchableOpacity>
                <Image
                  onPress={() => this.select(index, item)}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    // backgroundColor: colorCodes.primaryColor,
                  }}
                  source={null}
                />
              </View>
              <View
                style={{
                  color: "#04093F",
                  position: "absolute",
                  top: 60,
                  textAlign: "left",
                  paddingLeft: 20,
                  fontSize: 15,
                  marginRight: 10,
                  marginTop: 5,
                }}
              >
                <Text style={{ color: "#FFFFFF", fontFamily: fonts.semiBold }}>
                  Your Vehicles
                </Text>
                <View style={{ paddingTop: 10 }}>
                  <FlatList
                    horizontal={true}
                    data={this.state.vehicleCount}
                    renderItem={this._renderItem}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>
              </View>

              <View>
                <FlatList
                  data={this.state.vehicleData}
                  renderItem={this._renderVehicle}
                  keyExtractor={(item) => item.id.toString()}
                />
                <View
                  style={{ paddingTop: 15, paddingBottom: 50, marginRight: 10 }}
                >
                  {/* <TouchableOpacity style={{
                      borderWidth: 1,
                      flexDirection: 'row',
                      elevation: 1,
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
                    onPress={() => { this.continue(); }}
                    >
                      <View style={{ paddingLeft: 10 }}>
                        <Image
                          style={{
                            width: 30,
                            height: 30, resizeMode: 'contain',
                          }}
                          source={addVehicle}
                        />
                      </View>
                      <Text style={{ padding: 10, fontFamily: 'Segoe_UI_Bold', fontSize: 14, color: '#01313C', marginTop: -3, paddingLeft: 30 }}>Add Vehicle</Text>
                      <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 170 }}>
                        <Image
                          style={{
                            width: 30,
                            height: 30, resizeMode: 'contain',
                            transform: [{ rotate: '180deg' }],
                          }}
                          source={greybackbutton}
                        />
                      </View>
                    </TouchableOpacity> */}
                  {/* <View style={{ marginTop: 5 }}>
                      <TouchableOpacity style={{
                        borderWidth: 1,
                        flexDirection: 'row',
                        elevation: 1,
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
                            source={verifyVehicle}
                          />
                        </View>
                        <Text style={{ padding: 10, fontFamily: 'Segoe_UI_Bold', fontSize: 14, color: '#01313C', marginTop: -3, paddingLeft: 30 }}>Verify Vehicle</Text>
                        <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 180 }}>
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

                    <View style={{ marginTop: 5 }}>
                      <TouchableOpacity style={{
                        borderWidth: 1,
                        flexDirection: 'row',
                        elevation: 1,
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
                      onPress={() => this.showActionSheet()}
                      >
                        <View style={{ paddingLeft: 10 }}>
                          <Image
                            style={{
                              width: 30,
                              height: 30, resizeMode: 'contain',
                            }}
                            source={uploadLicense}
                          />
                        </View>
                        <Text style={{ padding: 10, fontFamily: 'Segoe_UI_Bold', fontSize: 14, color: '#01313C', marginTop: -3, paddingLeft: 30 }}>Upload Driving License</Text>
                        <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 240 }}>
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

                    <View style={{ marginTop: 5 }}>
                      <TouchableOpacity style={{
                        borderWidth: 1,
                        flexDirection: 'row',
                        elevation: 1,
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
                      onPress={() => this.showActionSheet()}
                      >
                        <View style={{ paddingLeft: 10 }}>
                          <Image
                            style={{
                              width: 30,
                              height: 30, resizeMode: 'contain',
                            }}
                            source={uploadRcBook}
                          />
                        </View>
                        <Text style={{ padding: 10, fontFamily: 'Segoe_UI_Bold', fontSize: 14, color: '#01313C', marginTop: -3, paddingLeft: 30 }}>Upload RC book</Text>
                        <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 200 }}>
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
                    </View> */}
                </View>
              </View>
            </View>
          </ScrollView>
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
                this.bookParking();
              }}
              angle={260}
              colors={["#9C28E9", "#3240B1"]}
              style={{
                alignItems: "center",
                backgroundColor: "transparent",
                width: "100%",
                zIndex: 20,
                // borderTopRightRadius: 5,
                // borderTopLeftRadius: 5,
                // borderBottomLeftRadius: 5,
                // borderBottomRightRadius: 5
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.continue();
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
                    this.continue();
                  }}
                >
                  ADD VEHICLE
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <ActionSheet ref={actionSheetRef}>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.menuView}>
                <Image style={styles.menuIcon} source={camera} />
                <Text style={styles.menuText} onPress={() => this.openCamera()}>
                  Upload From Camera
                </Text>
                <Image style={styles.menuIconBack} source={backbutton} />
              </View>
              <View style={styles.menuView}>
                <Image style={styles.menuIcon} source={gallery} />
                <Text
                  style={styles.menuText}
                  onPress={() => this.openGallery()}
                >
                  Upload From Gallery
                </Text>
                <Image style={styles.menuIconBack} source={backbutton} />
              </View>
            </View>
          </ActionSheet>
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
    // height: '100%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    width: "100%",
  },
  imgView: {
    width: 50,
    height: 50,
    marginRight: 20,
    backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 0.5,
  },
  imgIcons: {
    width: 40,
    height: 40,
    top: 2,
    left: 5,
    resizeMode: "contain",
    position: "absolute",
    // marginTop: 10,
    // marginLeft: 25,

    marginRight: 20,
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
    height: 160,
    alignItems: "flex-start",
    justifyContent: "center",
    // paddingHorizontal: 20
  },
  headerTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    top: -50,
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
});

// export default VehicleRegisteration;
