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
  Animated,
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
var backbutton = require("../../../assets/imgs/backbutton.png");
import global from "../../themes/global";
import Popover, { PopoverMode } from "react-native-popover-view";

import { Rating, AirbnbRating } from "react-native-ratings";
import CommanServices from "../../utils/comman";

var commanService = new CommanServices();
import { Base64 } from "js-base64";
var parkingImg1 = require("../../../assets/imgs/parkingImg1.png");
var parkingImg2 = require("../../../assets/imgs/parkingImg2.png");
var parkingImg3 = require("../../../assets/imgs/parkingImg3.png");
var threeDots = require("../../../assets/imgs/threeDots.png");
var favouriteParkings = require("../../../assets/imgs/favouriteParkings.png");
var download = require("../../../assets/imgs/download.png");
var resolve = require("../../../assets/imgs/resolve.png");
var loginImg = require("../../../assets/imgs/loginBg.png");
import { url, apiName } from "../../../Config";
import RestApi from "../../utils/restapii";
import fonts from "../../themes/fonts";
import colorCodes from "../../themes/colorCodes";
var restApi = new RestApi();
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
export default class FavouriteParking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parkingList: [],
      showLoader: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    // this.getData();
  }

  getData() {
    var userId = "";
    this.setState({ showLoader: true });
    commanService.getData("userData").then((res) => {
      console.log(res);
      var a = res;
      var _this = this;
      userId = Base64.decode(res["UserId"]);
      var req = {
        userid: userId,
      };
      console.log("REQUEST:>>", req);
      restApi.setUrl(apiName["getFavourite"]);
      restApi.setReq(req);
      restApi.sendRequest(function (response) {
        console.log(response);
        if (response.respCode == 1) {
          // commanService.createSimpleToast(item.facility.name + " is added to favourite.", "success")
          _this.setState({ showLoader: false, parkingList: response.loc });
        } else {
          _this.setState({ showLoader: false });
          commanService.createSimpleToast(
            "Something went wrong, Please try again later",
            "error"
          );
        }
      });
    });
  }

  markFavourite(item) {
    console.log(item);
    var userId = "";
    this.setState({ showLoader: true });
    commanService.getData("userData").then((res) => {
      var _this = this;
      userId = Base64.decode(res["UserId"]);
      var req = {
        userid: userId,
        facilityid: item.facilityId,
        flag: false,
      };
      console.log("REQUEST:>>", req);
      restApi.setUrl(apiName["setFavourite"]);
      restApi.setReq(req);
      restApi.sendRequest(function (response) {
        console.log(response);
        if (response.respCode == 1) {
          _this.setState({ showLoader: false, isUpcomingPopup: false });
          _this.getData();
        } else {
          _this.setState({ showLoader: false });
          commanService.createSimpleToast(
            "Something went wrong, Please try again later",
            "error"
          );
        }
      });
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  goToDetails(item) {
    this.props.navigation.navigate("ParkingDetails", { data: item });
  }

  goToDashboard() {
    this.props.navigation.replace("Dashboard");
  }

  _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          borderColor: "#E8E8E8",
          borderBottomWidth: 1,
          marginTop: 5,
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: "#FFF",
          alignItems: "center",
          alignContent: "center",
        }}
        //  onPress={() => this.goToDetails(item)}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "stretch",
          }}
        >
          <TouchableOpacity onPress={() => this.goToDetails(item)}>
            <Image
              style={{
                width: 80,
                height: 80,
                resizeMode: "contain",
              }}
              source={parkingImg1}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 2,
              flexDirection: "column",
              marginLeft: 10,
              alignItems: "stretch",
            }}
            onPress={() => this.goToDetails(item)}
          >
            <View>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 14,
                  color: colorCodes.textColor,
                  textAlign: "left",
                }}
              >
                {item.name}
              </Text>
            </View>
            <View>
              <Rating
                type="star"
                ratingCount={5}
                imageSize={10}
                startingValue={3}
                starContainerStyle={{ backgroundColorL: "red" }}
                style={{ marginLeft: -155 }}
                readonly={true}
                ratingColor="#3498db"
                ratingBackgroundColor="#c8c7c8"
                // onFinishRating={this.ratingCompleted}
              />
              <Text
                style={{
                  fontFamily: "Segoe_UI_Regular",
                  fontSize: 12,
                  color: "#04093F",
                  marginTop: 5,
                  marginLeft: 4,
                }}
              >
                {item.address}
              </Text>
            </View>

            {/* <Popover
            isVisible={this.state.isUpcomingPopup}
            ref={() => { this.popOver }}
            popoverStyle={{ borderWidth: 1, borderColor: '#00000029', zIndex: 50 }}
            onRequestClose={() =>this.setState({isUpcomingPopup: false})}
            from={(
              <TouchableOpacity style={{ zIndex: 50, marginRight: -15 }} onPress={() =>this.setState({isUpcomingPopup: true})}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                  source={threeDots}
                />
              </TouchableOpacity>
            )}>
            <View style={{ flexDirection: 'column', margin: 10 }}>
              <TouchableOpacity style={{ padding: 10, fontFamily: fonts.regular, borderBottomWidth: 0.5, borderColor: '#00000029' }} onPress={() => this.markFavourite(item)}>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={favouriteParkings} style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                    zIndex: 300
                  }} />
                  <Text style={{ fontFamily: fonts.regular, paddingLeft: 5, color: colorCodes.textColor, marginTop: 2 }}>Remove Favourite</Text>
                </View>

              </TouchableOpacity>
            </View>
          </Popover> */}
            {/* <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: colorCodes.textColor }}>{item.distance.toFixed(2) + "Km"}</Text> */}
          </TouchableOpacity>
          <View>
            <Menu>
              <MenuTrigger>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: "contain",
                  }}
                  resizeMode="contain"
                  source={threeDots}
                ></Image>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => this.markFavourite(item)}>
                  <View
                    style={{
                      padding: 10,
                      fontFamily: fonts.regular,
                      borderBottomWidth: 0.5,
                      borderColor: "#00000029",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={favouriteParkings}
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
                          marginTop: 2,
                        }}
                      >
                        Remove Favourite
                      </Text>
                    </View>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.showLoader ? (
          <View style={global.loaderStyle}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : null}
        <StatusBar
          backgroundColor={"#fff"}
          barStyle={"dark-content"}
          translucent={false}
        />
        <View style={styles.header}>
          <View
            style={styles.headerTitleWrapper}
            onPress={() => this.props.navigation.navigate("Dashboard")}
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => this.props.navigation.navigate("Dashboard")}
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
                { zIndex: 100, marginTop: 5, color: "#01313C" },
              ]}
            >
              {"Favourite Parkings"}
            </Text>
          </View>
        </View>
        <ScrollView>
          {this.state.parkingList.length > 0 ? (
            <View style={{ flex: 1, marginTop: 5, backgroundColor: "#FFF" }}>
              {/* <Text style={{ paddingLeft: 30, fontFamily: 'Segoe_UI_Bold', color: '#04093F' }}>Recommended Parkings</Text> */}

              <FlatList
                data={this.state.parkingList}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
          ) : (
            <View
              style={{
                margin: 10,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  width: "100%",
                  marginTop: 25,
                  textAlign: "center",
                  fontFamily: fonts.semiBold,
                  fontSize: 18,
                  color: colorCodes.primaryColor,
                }}
              >
                No Favourite Parkings
              </Text>
              <View style={styles.imageView}>
                <Image
                  style={{ width: 300, height: 300, resizeMode: "cover" }}
                  source={loginImg}
                />
              </View>
              <Text
                style={{
                  width: "100%",
                  marginTop: 25,
                  textAlign: "center",
                  fontFamily: fonts.semiBold,
                  fontSize: 16,
                  color: colorCodes.textColor,
                }}
              >
                Explore Parkings Near You
              </Text>
              <View
                style={{ width: "100%", alignItems: "center", marginTop: 50 }}
              >
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    // margin:20,
                    shadowColor: "#00000057",
                    borderColor: "#A3BCD5",
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    borderBottomRightRadius: 5,
                    height: 40,
                    width: 100,
                    backgroundColor: "#D8F6F2",
                    borderBottomLeftRadius: 5,
                    marginTop: 5,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                  onPress={() => this.goToDashboard()}
                >
                  <Text
                    style={{
                      padding: 10,
                      fontFamily: fonts.semiBold,
                      fontSize: 12,
                      color: colorCodes.textColor,
                      marginTop: -3,
                    }}
                  >
                    EXPLORE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colorCodes.colorWhite,
    height: 50,
    alignItems: "flex-start",
    justifyContent: "center",
    // paddingHorizontal: 20
  },
  headerTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    // top: -70,
    left: 15,
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
  imageView: {
    width: 300,
    height: 295,
    marginTop: -100,
    paddingLeft: 0,
    paddingRight: 30,
  },
});
