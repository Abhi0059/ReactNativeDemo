import React, { Component } from "react";
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
  Dimensions,
  ActivityIndicator,
} from "react-native";
var location = require("../../../assets/imgs/location.png");
//import Pdf from 'react-native-pdf';
//import PDFView from "react-native-view-pdf";
import Carousel from "react-native-snap-carousel";
import colorCodes from "../../themes/colorCodes";
import LinearGradient from "react-native-linear-gradient";
import fonts from "../../themes/fonts";
import CommanServices from "../../utils/comman";
import RestApi from "../../utils/restapii";
import { apiName } from "../../../Config";
import { Base64 } from "js-base64";
import global from "../../themes/global";
import Toast from "react-native-simple-toast";
import moment from "moment";
var restApi = new RestApi();
var commanService = new CommanServices();
var parkingImg1 = require("../../../assets/imgs/parkingImg1.png");
var parkingImg2 = require("../../../assets/imgs/parkingImg2.png");
var parkingImg3 = require("../../../assets/imgs/parkingImg3.png");
var carIcon = require("../../../assets/imgs/car.png");
var bikeIcon = require("../../../assets/imgs/motorbike.png");
var wheelIcon = require("../../../assets/imgs/tuk-tuk.png");
var backbutton = require("../../../assets/imgs/backbutton.png");
var bikeBlack = require("../../../assets/imgs/bicycleBlack.png");
var carBlack = require("../../../assets/imgs/carBlack.png");
var tukBlack = require("../../../assets/imgs/tuk-tuk_Black.png");
import ImageView from "react-native-image-viewing";
import { w, h, f } from "../../theme/responsive";
const { width, height } = Dimensions.get("window");

class ListItemRender extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data, setkeyword, selectedValue } = this.props;
    console.log("data", data);
    const { type_id, type_name, image } = data;
    console.log("selectedValue", selectedValue);
    if (type_id == 4) {
      return <View />;
    } else {
      return (
        <View style={styles.cardView}>
          {selectedValue == type_id ? (
            <LinearGradient
              useAngle={true}
              angle={180}
              colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
              style={[styles.gradientView]}
            >
              <TouchableOpacity
                onPress={() => {
                  setkeyword(type_id);
                }}
                style={styles.cardMainView}
              >
                <View style={styles.imgView}>
                  <Image
                    style={[styles.imgIcons, { tintColor: "#FFFFFF" }]}
                    source={{ uri: "data:image/png;base64," + image }}
                  />
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text
                    style={[styles.vehicleText, { fontFamily: fonts.bold }]}
                  >
                    {type_name}
                  </Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setkeyword(type_id);
              }}
              style={[styles.cardMainView, { backgroundColor: "#D8F6F2" }]}
            >
              <View style={styles.imgView}>
                <Image
                  style={[styles.imgIcons, { tintColor: "#000000" }]}
                  source={{ uri: "data:image/png;base64," + image }}
                />
              </View>
              <View style={{ marginTop: 5 }}>
                <Text
                  style={[
                    styles.vehicleText,
                    {
                      fontFamily: fonts.semiBold,
                      color: colorCodes.titleColor,
                    },
                  ]}
                >
                  {type_name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    }
  }
}
export default class ParkingDetail extends Component {
  constructor(props) {
    super(props);
    console.log(JSON.stringify("abeData:>>", this.props.route.params.data));
    this.state = {
      parkingDetails: this.props.route.params.data,
      entries: this.props.route.params.entries || [],
      image: this.props.route.params.image || [],
      imgIndex: 0,
      Pricingentries: [],
      isShowImages: false,
      showLoader: false,
      amenities: [
        { id: 0, title: "Security guard" },
        { id: 1, title: "Gated premises" },
        { id: 2, title: "Covered" },
        { id: 3, title: "Secured entry and exit" },
      ],
      working_days: "",
      start_time: "",
      end_time: "",
      activeSlide: 0,
      vehicleType: 1,
      datestatus: [],
      allVehicles: [],
    };
    // if (this.props.route.params.data == undefined) {
    //   console.log('here');
    // }
  }

  componentDidMount() {
    commanService.getData("userData").then((res) => {
      console.log(res);
    });
    this.getParkingDetails();
    this.getParkingData();
    this.getVehicleType();
    this.getAvailableDates();
  }

  getVehicleType() {
    var _this = this;

    let facilityId =
      _this.state.parkingDetails.facilityId ||
      _this.state.parkingDetails.facilityid;

    console.log("facilityId", facilityId);
    this.setState({ showLoader: true });
    commanService.getData("userData").then((res) => {
      console.log("userDatasss", res);
      var a = Base64.decode(res["UserId"]);
      console.log("UserId", a);
      restApi.setUrl(`${apiName["vehicleType"]}?UserId=${a}&fid=${facilityId}`);
      restApi.getRequest(function (response) {
        console.log("getVehicleType", response);
        if (response.respCode == 1) {
          _this.setState({ showLoader: false });

          if (response.details.length > 0) {
            console.log("getVehicleType", response.details);
            var vehType = 1;
            vehType = response.details[0].type_id;

            // var idToRemove = 3;
            // var filteredPeople = response.details.filter(
            //   (item) => item.type_id !== idToRemove,
            // );
            // console.log('filteredPeople', filteredPeople);
            _this.setState({
              Pricingentries: response.details,
              vehicleType: vehType,
              activeSlide: vehType - 1,
            });
          }
        }
      });
    });
  }

  setIsVisible(index) {
    this.setState({ isShowImages: true, imgIndex: index });
  }

  getParkingData() {
    var workingDays = this.props.route.params.data.workingDays;
    switch (workingDays) {
      case 7:
        this.setState({ working_days: "Monday - Wednesday" });
        break;
      case 15:
        this.setState({ working_days: "Monday - Thursday" });
        break;
      case 31:
        this.setState({ working_days: "Monday - Friday" });
        break;
      case 63:
        this.setState({ working_days: "Monday - Saturday" });
        break;
      case 127:
        this.setState({ working_days: "Monday - Sunday" });
        break;

      default:
        this.setState({ working_days: "Monday - Sunday" });
        break;
    }

    var startTime = this.props.route.params.data.startTime / 60;
    if (startTime >= 12) {
      this.setState({ start_time: startTime.toString() + ":00 PM" });
    } else {
      this.setState({ start_time: startTime.toString() + ":00 AM" });
    }

    var endTime = Math.round(this.props.route.params.data.endTime / 60).toFixed(
      2
    );

    console.log("mallEndTime", endTime);
    console.log(
      "startTimeendTime",
      this.props.route.params.data.startTime,
      " ",
      this.props.route.params.data.endTime
    );
    if (endTime >= 12) {
      console.log("mallEndTime endTime >= 12", endTime);
      if (endTime == 12) {
        console.log("mallEndTime endTime == 12", endTime);
        this.setState({ end_time: endTime.toString() + ":00 PM" });
      } else {
        console.log("mallEndTime endTime >= 12", endTime);
        if (endTime == 24) {
          this.setState({ end_time: (endTime - 12).toString() + ":00 AM" });
        } else {
          this.setState({ end_time: (endTime - 12).toString() + ":00 PM" });
        }
      }
    } else {
      this.setState({ end_time: endTime.toString() + ":00 AM" });
    }
    console.log("mallEndTime", this.state.end_time);
  }

  select(index, item) {
    this.setState({ activeSlide: index, vehicleType: item.type_id });
  }

  getAvailableDates() {
    var userId = "";
    commanService.getData("userData").then((res) => {
      var _this = this;
      var a = Base64.decode(res["UserId"]);
      userId = a;
      // this.setState({ showLoader: true });
      var req = {
        userid: userId,
        facilityid:
          _this.state.parkingDetails.facilityId ||
          _this.state.parkingDetails.facilityid,
      };
      console.log(apiName["getAvailableDates"]);
      console.log("getAvailableDates REQUEST:>>", req);
      restApi.setUrl(apiName["getAvailableDates"]);
      restApi.setReq(req);
      restApi.sendRequest(function (response) {
        console.log("getAvailableDates", response);
        if (response.respCode == 0) {
          _this.setState({ datestatus: response["datestatus"] });
        } else {
          _this.setState({ datestatus: [] });
        }
      });
    });
  }

  bookParking() {
    var userId = "";
    commanService.getData("userData").then((res) => {
      console.log(res);
      var _this = this;
      var _comman = commanService;
      var a = Base64.decode(res["UserId"]);
      userId = a;
      this.setState({ showLoader: true });
      restApi.setUrl(apiName["getVehicle"] + userId);
      restApi.getRequest(function (response) {
        if (response.respCode == 1) {
          console.log("bookParking getVehicle", response);
          if (response["details"].length > 0) {
            for (let i = 0; i < response["details"].length; i++) {
              if (
                _this.state.vehicleType == 4 ||
                _this.state.vehicleType == response["details"][i].vehicleType
              ) {
                _this.setState({ vehicleData: response["details"] });
                _comman.getData("userData").then((res) => {
                  var a = res;
                  a["defaultVehicle"] = response["details"][i]["vehRegNumber"];
                  a["vehicleType"] = response["details"][i]["vehicleType"];
                  _comman.storeData("userData", a);
                  _this.setState({ showLoader: false });
                  _this.props.navigation.navigate("BookingDetails", {
                    data: _this.state.parkingDetails,
                    userVechicles: response["details"],
                    mallStartTime: _this.state.start_time,
                    mallEndTime: _this.state.end_time,
                    datestatus: _this.state.datestatus,
                  });
                });
                break;
              } else {
                if (response["details"].length - 1 == i) {
                  _this.setState({ showLoader: false });
                  Toast.show(
                    "You do not have this vehicle. Please add this vehicle to continue"
                  );
                  // _comman.createSimpleToast(
                  //   'You do not have this vehicle. Please add this vehicle to continue',
                  //   'fail',
                  // );
                }
              }
            }
          } else {
            _this.setState({ showLoader: false });
          }
        } else {
          _this.setState({ showLoader: false });
        }
      });
    });
  }

  getParkingDetails() {
    var userId = "";

    commanService.getData("userData").then((res) => {
      var _this = this;
      var a = Base64.decode(res["UserId"]);
      userId = a;
      this.setState({ showLoader: true });
      var req = {
        userid: userId,
        facilityid:
          _this.state.parkingDetails.facilityId ||
          _this.state.parkingDetails.facilityid,
      };
      console.log("REQUEST:>>", req);
      restApi.setUrl(apiName["getFacilityDetails"]);
      restApi.setReq(req);
      restApi.sendRequest(function (response) {
        console.log("getParkingDetails", response);
        if (response.respCode == 1) {
          _this.setState({ showLoader: false });
          if (response["images"].length > 0) {
            var imgArr = [];
            for (let i = 0; i < response["images"].length; i++) {
              imgArr.push({
                uri: "data:image/png;base64," + response["images"][i].imagedata,
              });
            }
            _this.setState({ entries: response["images"], image: imgArr });
          }

          if (response["pricing"].length > 0) {
            _this.setState({ allVehicles: response["pricing"] });
          }

          // else {
          //     commanService.getData("userData").then(res => {
          //         console.log(res)
          //         var a = res
          //         a['isVehicleRegistered'] = "no"
          //         commanService.storeData("userData", a);
          //     })
          //     _this.props.navigation.replace("AddVehicle");
          // }
        } else {
          _this.setState({ showLoader: false });
        }
      });
    });
  }

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          // borderWidth: 1,
          elevation: 5,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 1,
          height: 60,
          alignItems: "center",
          alignContent: "center",
          marginTop: 10,
        }}
        onPress={() => this.setIsVisible(index)}
      >
        <View style={{ width: 20, height: 60 }}>
          <Image
            style={{
              width: 60,
              height: 60,
              resizeMode: "cover",
              borderWidth: 1,
              borderRadius: 5,
            }}
            source={{ uri: "data:image/png;base64," + item.imagedata }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  _renderPricingItems = ({ item, index }) => {
    console.log("_renderPricingItems", item);
    return this.state.activeSlide == index ? (
      <LinearGradient
        onPress={() => this.select(index, item)}
        useAngle={true}
        angle={180}
        colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
        style={[styles.gradientView, { height: item.rate ? 120 : 100 }]}
      >
        <TouchableOpacity
          onPress={() => this.select(index, item)}
          style={styles.cardMainView}
        >
          <View style={styles.imgView}>
            <Image
              onPress={() => this.select(index, item)}
              style={styles.imgIcons}
              source={{ uri: "data:image/png;base64," + item.image }}
            />
          </View>
          <View style={{ marginTop: 5 }}>
            <Text
              onPress={() => this.select(index, item)}
              style={[styles.vehicleText, { fontFamily: fonts.bold }]}
            >
              {item.type_name}
            </Text>
            {/* {item.rate ? (
              <View style={{marginTop: 10}}>
                <Text
                  onPress={() => this.select(index, item)}
                  style={styles.vehicleText}>
                  ₹{item.rate}/Hr
                </Text>
                <Text onPress={() => this.select(index, item)} style={styles.vehicleText}>{item.slots} slots</Text>
              </View>
            ) : null} */}
          </View>
        </TouchableOpacity>
      </LinearGradient>
    ) : (
      <TouchableOpacity
        onPress={() => this.select(index, item)}
        style={{
          backgroundColor: "#D8F6F2",
          width: 100,
          height: item.rate ? 120 : 100,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      >
        <View style={styles.imgView}>
          <Image
            onPress={() => this.select(index, item)}
            style={styles.imgIcons}
            source={
              item.type_id == 1
                ? bikeBlack
                : item.type_id == 2
                ? carBlack
                : { uri: "data:image/png;base64," + item.image }
            }
          />
        </View>
        <View style={{ marginTop: 5 }}>
          <Text
            onPress={() => this.select(index, item)}
            style={[
              styles.vehicleText,
              { fontFamily: fonts.semiBold, color: colorCodes.titleColor },
            ]}
          >
            {item.type_name}
          </Text>
          {item.rate ? (
            <View style={{ marginTop: 10 }}>
              <Text
                onPress={() => this.select(index, item)}
                style={styles.vehicleText}
              >
                ₹{item.rate}/Hr
              </Text>
              {/* <Text onPress={() => this.select(index, item)} style={styles.vehicleText}>{item.slots} slots</Text> */}
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  setkeyword = (id) => {
    this.setState({
      vehicleType: id,
    });
  };

  render() {
    const { allVehicles, vehicleType } = this.state;
    console.log(
      "this.props.route.params.data.endTime",
      this.props.route.params.data.endTime,
      " ",
      this.props.route.params.data.startTime
    );

    var dateStart = moment("12:00:00 AM", "h:mm:ss A")
      .add(this.props.route.params.data.startTime, "minutes")
      .format("LTS");

    var dateEnd = moment("12:00:00 AM", "h:mm:ss A")
      .add(this.props.route.params.data.endTime, "minutes")
      .format("LTS");

    console.log(
      "this.props.route.params.data.startTime",
      dateStart,
      " dateEnd ",
      dateEnd
    );
    let pdfUrl = "https://www.africau.edu/images/default/sample.pdf";
    // let openHours = Math.round(
    //   (this.props.route.params.data.endTime -
    //     this.props.route.params.data.startTime) /
    //     60,
    // );
    let resources = {};
    if (allVehicles && allVehicles.length > 0) {
      resources = {
        file:
          Platform.OS === "ios"
            ? "downloadedDocument.pdf"
            : "/sdcard/Download/downloadedDocument.pdf",
        url: `${allVehicles[0]?.pricecharturl}`,
        base64: "JVBERi0xLjMKJcfs...",
      };
    }

    const resourceType = "url";
    return (
      <SafeAreaView style={{ backgroundColor: colorCodes.colorWhite, flex: 1 }}>
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
        <View>
          <ImageView
            images={this.state.image}
            imageIndex={this.state.imgIndex}
            visible={this.state.isShowImages}
            onRequestClose={() => this.setState({ isShowImages: false })}
          />
          <ScrollView>
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
                        marginTop: -3,
                        position: "absolute",
                      }}
                      source={backbutton}
                    />
                  </TouchableOpacity>
                  <Text style={styles.headerTitleText}>
                    {"Parking Details"}
                  </Text>
                </View>
              </View>
              <View style={{ marginLeft: 20, marginRight: 20 }}>
                <Text
                  style={[
                    global.appName,
                    {
                      fontSize: 16,
                      fontFamily: fonts.semiBold,
                      marginLeft: 10,
                    },
                  ]}
                >
                  {this.state.parkingDetails.name}
                </Text>
                <View
                  style={{
                    color: "#04093F",
                    flexDirection: "row",
                    textAlign: "left",
                    paddingLeft: 10,
                    fontSize: 15,
                    marginRight: 10,
                    marginTop: 5,
                  }}
                >
                  <Image
                    source={location}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      paddingTop: 10,
                    }}
                  />
                  <Text
                    style={[
                      global.welcomeText,
                      {
                        color: "#707070",
                        alignSelf: "center",
                        marginRight: 30,
                        fontFamily: fonts.regular,
                        paddingTop: 5,
                      },
                    ]}
                  >
                    {this.state.parkingDetails.address +
                      ", " +
                      this.state.parkingDetails.city}
                  </Text>
                </View>
                {this.state.entries != [] ? (
                  <Carousel
                    ref={(c) => {
                      this._carousel = c;
                    }}
                    data={this.state.entries}
                    renderItem={this._renderItem}
                    sliderWidth={320}
                    itemWidth={70}
                    containerCustomStyle={{ marginLeft: 17 }}
                    scrollEnabled={false}
                    inactiveSlideOpacity={1}
                    inactiveSlideScale={1}
                    autoplay={false}
                    activeSlideAlignment={"start"}
                  />
                ) : null}
              </View>
            </View>

            <View style={{ marginLeft: 30, marginRight: 10, marginTop: 10 }}>
              <Text
                style={[
                  global.appName,
                  {
                    fontSize: 16,
                    fontFamily: fonts.semiBold,
                    color: "#04093F",
                    paddingTop: -20,
                    paddingBottom: 10,
                  },
                ]}
              >
                Select Vehicle Type
              </Text>

              <View style={styles.listView}>
                <FlatList
                  numColumns={3}
                  data={this.state.Pricingentries}
                  columnWrapperStyle={{ justifyContent: "flex-start" }}
                  renderItem={({ item, index }) => {
                    return (
                      <ListItemRender
                        data={item}
                        index={index}
                        key={index.toString()}
                        setkeyword={this.setkeyword}
                        selectedValue={vehicleType}
                      />
                    );
                  }}
                  listKey={(item) => item.toString()}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEventThrottle={400}
                />
              </View>
              <View style={{ marginTop: 20, paddingLeft: 5 }}>
                <Text
                  style={{
                    marginBottom: 5,
                    fontFamily: fonts.semiBold,
                    fontSize: 16,
                  }}
                >
                  Opening Time
                </Text>
                <Text
                  style={[
                    global.appName,
                    { fontSize: 17, fontFamily: fonts.bold, paddingTop: 0 },
                  ]}
                >
                  {`${dateStart ? dateStart : "0"} to ${
                    dateEnd ? dateEnd : "0"
                  }`}
                </Text>
                {/* <Text style={[global.appName, { fontSize: 17, fontFamily: fonts.bold, paddingTop: 0 }]}>{this.state.start_time + ' - ' + this.state.end_time}</Text> */}
                {/* <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: '#01313C',
                  }}>
                  {this.state.working_days}
                </Text> */}
                {allVehicles && allVehicles.length > 0 ? (
                  <View>
                    <Text
                      style={[
                        global.appName,
                        {
                          fontSize: 16,
                          fontFamily: fonts.semiBold,
                          paddingTop: 20,
                          marginBottom: 5,
                        },
                      ]}
                    >
                      Pricing Details
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        height: h(30),
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* <PDFView
                        fadeInDuration={250.0}
                        style={{
                          width: "100%",
                          height: h(30),
                          backgroundColor: "grey",
                        }}
                        resource={resources[resourceType]}
                        resourceType={resourceType}
                        enableAnnotations={true}
                        onLoad={() =>
                          console.log(`PDF rendered from ${resourceType}`)
                        }
                        onError={(error) =>
                          console.log("Cannot render PDF", error)
                        }
                      /> */}
                    </View>

                    {/* <View style={{paddingBottom: 100}}>
                      <View
                        style={{
                          flex: 1,
                          alignSelf: 'stretch',
                          flexDirection: 'row',
                          borderBottomWidth: 1,
                          borderColor: '#ddd',
                        }}>
                        <View style={{flex: 1, alignSelf: 'stretch'}}>
                          <Text style={{fontFamily: fonts.semiBold}}>
                            Vehicle Type
                          </Text>
                        </View>
                        <View style={{flex: 1, alignSelf: 'stretch'}}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: fonts.semiBold,
                            }}>
                            Price
                          </Text>
                        </View>
                        <View style={{flex: 1, alignSelf: 'stretch'}}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: fonts.semiBold,
                            }}>
                            Hours
                          </Text>
                        </View>
                        <View style={{flex: 1, alignSelf: 'stretch'}}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: fonts.semiBold,
                            }}>
                            Increase
                          </Text>
                        </View>
                      </View>
                      {allVehicles.map((item, index) => {
                        console.log(item);
                        let {
                          vehicletype,
                          price,
                          extraduration,
                          extraamount,
                          minduration,
                        } = item;
                        price = price / 100;
                        minduration = minduration / 60;
                        extraamount = extraamount / 100;
                        extraduration = extraduration / 60;
                        console.log(
                          'price',
                          price,
                          ' minduration ',
                          minduration,
                          ' extraamount ',
                          extraamount,
                          ' extraduration ',
                          extraduration,
                          ' vehicletype ',
                          vehicletype,
                        );
                        return (
                          <View
                            key={index.toString()}
                            style={{
                              flex: 1,
                              alignSelf: 'stretch',
                              flexDirection: 'row',
                              borderBottomWidth: 0.5,
                              borderBottomColor: '#ddd',
                              paddingTop: 5,
                              paddingBottom: 5,
                            }}>
                            <View
                              style={{
                                flex: 1,
                                alignSelf: 'stretch',
                                borderLeftWidth: 3,
                                borderLeftColor: colorCodes.primaryColor,
                                paddingTop: 5,
                                paddingBottom: 5,
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontFamily: fonts.semiBold,
                                }}>
                                {vehicletype == 1
                                  ? 'Bike'
                                  : vehicletype == 2
                                  ? 'Car'
                                  : 'Bicycle'}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                alignSelf: 'stretch',
                                paddingTop: 5,
                                paddingBottom: 5,
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontFamily: fonts.semiBold,
                                }}>
                                {`₹ ${price}`}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                alignSelf: 'stretch',
                                paddingTop: 5,
                                paddingBottom: 5,
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontFamily: fonts.semiBold,
                                }}>
                                {`${minduration} Hrs`}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                alignSelf: 'stretch',
                                paddingTop: 5,
                                paddingBottom: 5,
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontFamily: fonts.semiBold,
                                }}>
                                {extraamount !== 0
                                  ? `₹ ${extraamount}/${extraduration}hr`
                                  : '-'}
                              </Text>
                            </View>
                          </View>
                        );
                      })}

                      <Text style={{fontFamily: fonts.regular, fontSize: 12}}>
                        *Service charges & GST included.
                      </Text>

                      <View style={styles.separator}></View>
                    </View> */}
                  </View>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={() => {
            this.bookParking();
          }}
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
                this.bookParking();
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
                  this.bookParking();
                }}
              >
                Book Parking
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  gradientView: {
    backgroundColor: "yellow",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    width: 100,
    height: 120,
    padding: 0,
    alignItems: "center",
    alignContent: "center",
  },
  cardMainView: {
    height: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: "space-evenly",
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
  listView: {
    flex: 1,
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
    marginRight: 5,
    marginTop: 5,
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
    fontSize: 15,
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
  logo: {
    height: 25,
    width: 25,
  },
  cardView: {
    alignItems: "flex-start",
    width: 100,
    height: 120,
    justifyContent: "center",
    marginLeft: w(2),
    marginTop: h(1),
  },
});
