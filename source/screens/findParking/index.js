import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { apiName } from "../../../Config";
import colorCodes from "../../themes/colorCodes";
import CommanServices from "../../utils/comman";
import { w, h, f } from "../../theme/responsive";
import RestApi from "../../utils/restapii";
import LinearGradient from "react-native-linear-gradient";
import global from "../../themes/global";
import fonts from "../../themes/fonts";
import Geocoder from "react-native-geocoding";
import { Rating, AirbnbRating } from "react-native-ratings";
var commanService = new CommanServices();
var restApi = new RestApi();
var backbutton = require("../../../assets/imgs/backbutton.png");
var search = require("../../../assets/imgs/search.png");
var close = require("../../../assets/imgs/close.png");
var parkingImg1 = require("../../../assets/imgs/parkingImg1.png");
var loginImg = require("../../../assets/imgs/loginBg.png");
var parkingImg3 = require("../../../assets/imgs/parkingImg3.png");
import { Base64 } from "js-base64";
const { width, height } = Dimensions.get("window");

const dattaa = [
  {
    name: "Multi level parking, MP Nagar Zone 1",
    city: "Bhopal",
    distance: 3.6584514,
    address:
      "6CMM+785, Zone-I, Maharana Pratap Nagar, Bhopal, Madhya Pradesh,462023",
    pinCode: "462023",
    workingDays: 127,
  },
];
export default class FindParking extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.route.params);
    this.state = {
      searchText: this.props.route.params?.parkingName
        ? this.props.route.params.parkingName
        : "",
      parkingList: [],
      addressList: [],
      isSearch: "init",
      showLoader: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    Geocoder.init("AIzaSyCYB0HGrhdDVYR5JhW7ql4GzTwzrE0NBNg"); //AIzaSyDivrEOWbcxtKyUEaVRzykFx1rNix1cN6c
    if (this.props.route.params?.parkingName) {
      this.updateSearch(this.props.route.params.parkingName);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  updateSearch = (text) => {
    this.setState({ searchText: text });
    console.log(text);
    fetch(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCYB0HGrhdDVYR5JhW7ql4GzTwzrE0NBNg&input=" + //AIzaSyDivrEOWbcxtKyUEaVRzykFx1rNix1cN6c
        text,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("response:>", json);
        this.setState({ addressList: json.predictions });
      })
      .catch((error) => {
        console.error(error);
        commanService.createSimpleToast("cannot compelete request", "fail");
        return error;
      });
    // Geocoder.from("Colosseum")
    //     .then(json => {
    //         var location = json.results;
    //         console.log(location);
    //     })
    //     .catch(error => console.warn(error));
    // if (text == "Mumbai") {
    //     this.findParkingLocation(19.2307, 72.8567)
    //     this.setState({
    //         myCordinates: {
    //             latitude: 19.1663,
    //             longitude: 72.8526,
    //             latitudeDelta: 0.05,
    //             longitudeDelta: 0.05
    //         },
    //         countryCordinates: {
    //             latitude: 19.1663,
    //             longitude: 72.8526,
    //             latitudeDelta: 0.05,
    //             longitudeDelta: 0.05
    //         },
    //     })
    //     this.search.blur();
    //     this.setState({ searchText: "" })

    // }
    // else if (text == "Nagpur") {
    //     this.findParkingLocation(21.14631, 79.08491)
    //     this.setState({
    //         myCordinates: {
    //             latitude: 21.14631,
    //             longitude: 79.08491,
    //             latitudeDelta: 0.05,
    //             longitudeDelta: 0.05
    //         },
    //         countryCordinates: {
    //             latitude: 21.14631,
    //             longitude: 79.08491,
    //             latitudeDelta: 0.05,
    //             longitudeDelta: 0.05
    //         },
    //     })
    //     this.search.blur();

    //     this.setState({ searchText: "" })
    // }
  };

  findParkingLocation(lat, long, userid) {
    var _this = this;
    var req = { userid: userid, latitude: lat, longitude: long };
    console.log(req);
    console.log(apiName["findLocation"]);
    this.setState({ showLoader: true });
    restApi.setUrl(apiName["findLocation"]);
    restApi.setReq(req);
    restApi.sendRequest(function (response) {
      console.log(response);
      if (response.respCode == 1) {
        _this.setState({ showLoader: false, isSearch: "searched" });
        var data = response.loc;

        var a = [];
        for (let i = 0; i < data.length; i++) {
          var item = {};
          item = {
            id: i,
            title: data[i].name + " " + data[i].address + " " + data[i].city,
            coordinates: {
              latitude: data[i].location.coordinates.values[1],
              longitude: data[i].location.coordinates.values[0],
            },
          };
          a.push(item);
          _this.setState({
            markers: a,
            parkingList: data,
            isSearch: "searched",
          });
        }
      } else {
        _this.setState({ showLoader: false });
      }
    });
  }

  clearText() {
    this.setState({ searchText: "", parkingList: [], isSearch: "init" });
    this.search.clear();
  }

  goToDetails(item) {
    this.props.navigation.navigate("ParkingDetail", { data: item });
  }

  getLatLong(item) {
    fetch(
      "https://maps.googleapis.com/maps/api/place/details/json?placeid=" +
        item.place_id +
        "&key=AIzaSyCYB0HGrhdDVYR5JhW7ql4GzTwzrE0NBNg", //AIzaSyDivrEOWbcxtKyUEaVRzykFx1rNix1cN6c
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("response:>", json);
        this.setState({ addressList: [], searchText: item.description });
        commanService.getData("userData").then((res) => {
          console.log("getLatLong", res);
          var a = res;
          if (a["isFetchAddress"] == "no") {
            this.getMyAddress(location.latitude, location.longitude);
          }
          let userId = Base64.decode(res["UserId"]);
          this.findParkingLocation(
            json.result.geometry.location.lat,
            json.result.geometry.location.lng,
            userId
          );
        });
      })
      .catch((error) => {
        console.error(error);
        commanService.createSimpleToast("cannot compelete request", "fail");
        return error;
      });
  }

  _renderItem = ({ item, index }) => {
    console.log("itemssssss", item);
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          borderColor: "#E8E8E8",
          borderBottomWidth: 1,
          borderRadius: 5,
          width: "100%",
          padding: 10,
          alignItems: "center",
          alignContent: "center",
        }}
        onPress={() => this.goToDetails(item)}
      >
        <View
          style={{
            width: "30%",
            height: h(18),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 80,
              height: 80,
              resizeMode: "contain",
            }}
            source={parkingImg1}
          />
        </View>
        <View
          style={{
            width: "70%",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 14,
                width: "60%",
                color: colorCodes.textColor,
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 16,
                color: colorCodes.textColor,
                marginLeft: 30,
              }}
            >
              {item.distance.toFixed(2) + "Km"}
            </Text>
          </View>

          <View style={{ width: "70%" }}>
            <Text
              numberOfLines={4}
              style={{
                fontFamily: "Segoe_UI_Regular",
                fontSize: 12,
                color: "#04093F",
                marginTop: 5,
              }}
            >
              {item.address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderAddress = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          height: 20,
          borderBottomLeftRadius: 5,
          marginTop: 20,
          alignItems: "center",
          alignContent: "center",
          paddingBottom: 5,
        }}
        onPress={() => this.getLatLong(item)}
      >
        <View
          style={{
            marginLeft: 0,
            marginTop: 0,
            height: h(5),
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: 14,
              color: colorCodes.textColor,
            }}
          >
            {item.description.length > 45
              ? item.description.substring(0, 45 - 3) + "..."
              : item.description}
          </Text>
          {/* <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: colorCodes.textColor }}>{item.distance.toFixed(2) + "Km"}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView>
        <View style={{ width: w(100), height: h(92) }}>
          {this.state.showLoader ? (
            <View style={global.loaderStyle}>
              {/* <PreLoader preLoaderVisible={this.state.showLoader} /> */}
              <ActivityIndicator size="large" color="#FFF" />
            </View>
          ) : null}
          <StatusBar
            backgroundColor={colorCodes.colorWhite}
            barStyle={"dark-content"}
            translucent={false}
          />
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
            <View style={styles.header}>
              <View style={styles.headerTitleWrapper}>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Image
                    onPress={() => this.select(index, item)}
                    style={{
                      width: 25,
                      height: 25,
                      marginTop: -2,
                      position: "absolute",
                    }}
                    source={backbutton}
                  />
                </TouchableOpacity>
                <Text style={styles.headerTitleText}>{"Find Parking"}</Text>
              </View>
            </View>
            <View
              style={{ flexDirection: "row" }}
              onPress={() => this.props.navigation.push("FindParking")}
            >
              <TextInput
                ref={(input) => {
                  this.search = input;
                }}
                keyboardType="default"
                autoCapitalize="sentences"
                placeholder="Find Parking"
                editable={true}
                placeholderTextColor="#01313C"
                autoFocus={true}
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: 30,
                  marginRight: 40,
                  paddingLeft: 20,
                  width: "82%",
                  margin: 20,
                  backgroundColor: "#a3bcd580",
                  borderColor: "#a3bcd580",
                  borderRadius: 6,
                  borderWidth: 1,
                  fontSize: 16,
                  fontFamily: fonts.semiBold,
                  height: 55,
                }}
                onChangeText={this.updateSearch}
                value={this.state.searchText}
                // onBlur={this.handleEmailOnBlur}
              />
              {this.state.searchText != "" ? (
                <TouchableOpacity
                  onPress={() => this.clearText()}
                  style={{
                    zIndex: 300,
                    position: "absolute",
                    right: 50,
                    top: 20,
                  }}
                >
                  <Image
                    style={{ width: 30, height: 30, resizeMode: "contain" }}
                    source={close}
                  />
                </TouchableOpacity>
              ) : (
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    position: "absolute",
                    right: 50,
                    top: 20,
                    resizeMode: "contain",
                  }}
                  source={search}
                />
              )}
            </View>
            <FlatList
              style={{ margin: 20, marginLeft: 30, marginTop: 0 }}
              data={this.state.addressList}
              renderItem={this._renderAddress}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={{ flex: 1, width: "100%", height: "100%" }}>
            {this.state.isSearch == "init" ? null : this.state.parkingList
                .length > 0 ? (
              <FlatList
                style={{ width: "100%" }}
                data={this.state.parkingList}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View>
                <Text
                  style={{
                    width: "100%",
                    marginTop: 25,
                    marginBottom: 25,
                    textAlign: "center",
                    fontFamily: fonts.semiBold,
                    fontSize: 18,
                    color: colorCodes.primaryColor,
                  }}
                >
                  Coming at this location soon.
                </Text>
                <View style={styles.imageView}>
                  <Image
                    style={{ width: 300, height: 300, resizeMode: "cover" }}
                    source={loginImg}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            width: w(100),
            height: h(8),
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <LinearGradient
            useAngle={true}
            angle={260}
            colors={["#9C28E9", "#3240B1"]}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "red",
              width: "100%",
              height: h(8),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  padding: 12,
                  textAlign: "center",
                  color: "#FFF",
                  fontFamily: fonts.semiBold,
                  fontWeight: "600",
                }}
                onPress={() => {
                  this.props.navigation.replace("Home");
                }}
              >
                CONTINUE
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
  imageView: {
    width: 300,
    height: 295,
    marginTop: -150,
    paddingLeft: 30,
    paddingRight: 30,
  },
});
