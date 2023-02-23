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
  TextInput,
  BackHandler,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import colorCodes from "../../themes/colorCodes";
import LinearGradient from "react-native-linear-gradient";
import fonts from "../../themes/fonts";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import RestApi from "../../utils/restapii";
import { apiName } from "../../../Config";
import { Base64 } from "js-base64";
import Overlay from "react-native-modal-overlay";
import Slider from "@react-native-community/slider";
import CommanServices from "../../utils/comman";
import global from "../../themes/global";
var restApi = new RestApi();
var commanService = new CommanServices();
var close = require("../../../assets/imgs/close.png");
var sales = require("../../../assets/imgs/sales.png");
var location = require("../../../assets/imgs/location.png");
var pinPoint = require("../../../assets/imgs/purplePointer.png");
var backbutton = require("../../../assets/imgs/backbutton.png");
var bookDetails = require("../../../assets/imgs/bookDetails.png");
var Sccoter_big = require("../../../assets/imgs/Sccoter_big.png");
var rickshaw_big = require("../../../assets/imgs/rickshaw_big.png");
var carVector = require("../../../assets/imgs/carVector.png");
export default class BookingSummary extends Component {
  constructor(props) {
    super(props);

    console.log(
      "Ha DATA kay ala ae??:>>",
      JSON.stringify(this.props.route.params.bookingID)
    );
    console.log("YES", JSON.stringify(this.props.route.params.actualStartTime));
    var a = [];
    a.push(this.props.route.params.bookingDate);
    var b = [];
    var c = {
      id: 0,
      title:
        this.props.route.params.bookingType == "D"
          ? "HOURLY"
          : this.props.route.params.bookingType == "W"
          ? "WEEKLY"
          : this.props.route.params.bookingType == "M"
          ? "MONTHLY"
          : null,
    };
    b.push(c);
    this.state = {
      parkingDetails: this.props.route.params.data,
      setDatePickerVisibility: false,
      Pricingentries: b,
      availableDates: a,
      activeSlide: 0,
      actualStartTime: this.props.route.params.actualStartTime,
      actualEndTime: this.props.route.params.actualEndTime,
      vechicleNo: "",
      vehicleType: null,
      startTime: this.props.route.params.startTime,
      endTime: this.props.route.params.endTime,
      promoCode: "",
      isPromoApplied: false,
      showLoader: false,
      modalVisible: false,
      userVechicles: this.props.route.params.userVechicles,
      bookingID: this.props.route.params.bookingID,
      isGuest: false,
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
    this.props.navigation.goBack();
    return true;
  };

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
      } else {
        this.setState({
          vechicleNo: res["defaultVehicle"],
          vehicleType: res["vehicleType"],
          isGuest: false,
        });
      }
    });
  }

  select(index, item) {
    this.setState({ activeSlide: index, vehicleType: item.title });
  }

  onClose = () => this.setState({ modalVisible: false });

  setVehicle(index, item) {
    console.log("item", item);
    commanService.getData("userData").then((res) => {
      var a = res;
      a["defaultVehicle"] = item["vehRegNumber"];
      a["vehicleType"] = item["vehicleType"];
      commanService.storeData("userData", a);
      this.setState({
        modalVisible: false,
        vehicleType: item["vehicleType"],
        vechicleNo: item["vehRegNumber"],
      });
    });
  }

  bookParking() {
    // alert("Book Parking")
    // console.log("YES", JSON.stringify(this.props.route.params.bookingDate.originalDate.split("-")))
    if (this.state.bookingID == undefined || this.state.bookingID == null) {
      console.log("guestParking");
      var d = new Date();
      console.log(
        this.props.route.params.bookingDate.originalDate._day.split("-")
      );
      var b = this.props.route.params.bookingDate.originalDate._day.split("-");
      d.setFullYear(+b[0], +b[1] - 1, +b[2]);

      var currDate = this.state.actualStartTime;
      var currToDate = this.state.actualEndTime;
      var oldDate = new Date("Tue Jan 01 2021 00:00:00");
      var from_date = (currDate - oldDate) / 60000; // in mins
      var to_date = (currToDate - oldDate) / 60000;
      var userId = "";
      this.setState({ showLoader: true });
      commanService.getData("userData").then((res) => {
        var _this = this;

        var comman = commanService;
        userId = Base64.decode(res["UserId"]);
        console.log(userId);
        if (this.state.isGuest) {
          var req = {
            userId: userId,
            facilityid:
              this.props.route.params.data.facilityId ||
              this.props.route.params.data.facilityid,
            VehRegNumber: this.state.vechicleNo,
            bookingtype: this.props.route.params.bookingType,
            fromdate: +from_date.toFixed(),
            todate: +to_date.toFixed(),
            VehicleType: this.state.vehicleType,
            VehicleModel: this.state.vehicleType,
          };
          console.log("REQUEST:>>", req);
          alert("Req" + req + " " + apiName["guestParking"]);
          restApi.setUrl(apiName["guestParking"]);
          restApi.setReq(req);
          restApi.sendRequest(function (response) {
            console.log("YAHOO!!", response);
            if (response.respCode == 1) {
              // comman.sendNotification()
              _this.props.navigation.replace("BookingConfirmation", {
                data: _this.state.parkingDetails,
                bookingType: _this.state.bookingType,
                bookingDate: _this.props.route.params.bookingDate,
                startTime: _this.state.startTime,
                endTime: _this.state.endTime,
                qrCode: response.bookings[0].qrcode,
                bookingID: response.bookings[0].bookingid,
              });
              _this.setState({ showLoader: false });
            } else {
              _this.setState({ showLoader: false });
              commanService.createSimpleToast(
                "Something went wrong, Please try again later",
                "error"
              );
            }
          });
        } else {
          console.log("bookParking");
          var req = {
            userId: userId,
            facilityid:
              this.props.route.params.data.facilityId ||
              this.props.route.params.data.facilityid,
            VehRegNumber: this.state.vechicleNo,
            bookingtype: this.props.route.params.bookingType,
            fromdate: +from_date.toFixed(),
            todate: +to_date.toFixed(),
          };
          console.log("REQUEST:>>", req);
          restApi.setUrl(apiName["bookParking"]);
          restApi.setReq(req);
          restApi.sendRequest(function (response) {
            console.log("YAHOO!!", response);
            if (response.respCode == 1) {
              // comman.sendNotification()
              _this.props.navigation.replace("BookingConfirmation", {
                data: _this.state.parkingDetails,
                bookingType: _this.state.bookingType,
                bookingDate: _this.props.route.params.bookingDate,
                startTime: _this.state.startTime,
                endTime: _this.state.endTime,
                qrCode: response.bookings[0].qrcode,
                bookingID: response.bookings[0].bookingid,
                pnr: response.bookings[0].pnr,
              });
              _this.setState({ showLoader: false });
            } else {
              _this.setState({ showLoader: false });
              commanService.createSimpleToast(
                "Something went wrong, Please try again later",
                "error"
              );
            }
          });
        }
      });
    } else {
      var d = new Date();
      console.log(
        this.props.route.params.bookingDate.originalDate._day.split("-")
      );
      var b = this.props.route.params.bookingDate.originalDate._day.split("-");
      d.setFullYear(+b[0], +b[1] - 1, +b[2]);

      var currDate = new Date(this.state.actualStartTime);
      var currToDate = new Date(this.state.actualEndTime);
      var oldDate = new Date("Tue Jan 01 2021 00:00:00");
      var from_date = (currDate - oldDate) / 60000; // in mins
      var to_date = (currToDate - oldDate) / 60000;
      var userId = "";
      this.setState({ showLoader: true });
      commanService.getData("userData").then((res) => {
        var _this = this;
        var comman = commanService;
        userId = Base64.decode(res["UserId"]);
        var req = {
          userId: userId,
          facilityid:
            this.props.route.params.data.facilityId ||
            this.props.route.params.data.facilityid,
          bookingid: this.state.bookingID,
          fromdate: +from_date.toFixed(),
          todate: +to_date.toFixed(),
        };
        console.log("REQUEST:>>", req);
        restApi.setUrl(apiName["changeBooking"]);
        restApi.setReq(req);
        restApi.sendRequest(function (response) {
          console.log("YAHOO!!", response);
          if (response.respCode == 1) {
            // comman.sendNotification()
            commanService.createSimpleToast(
              "Booking Updated Successfully",
              "success"
            );
            _this.props.navigation.replace("BookingConfirmation", {
              data: _this.state.parkingDetails,
              bookingType: _this.state.bookingType,
              bookingDate: _this.props.route.params.bookingDate,
              startTime: _this.state.startTime,
              endTime: _this.state.endTime,
              qrCode: response.bookings[0].qrcode,
              bookingID: response.bookings[0].bookingid,
            });
            _this.setState({ showLoader: false });
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
  }

  _renderItem = ({ item, index }) => {
    return this.state.activeSlide == index ? (
      <LinearGradient
        onPress={() => this.select(index, item)}
        useAngle={true}
        angle={180}
        colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
        style={styles.gradientView}
      >
        <View
          onPress={() => this.select(index, item)}
          style={styles.cardMainView}
        >
          <View style={{ marginTop: 5 }}>
            <Text
              onPress={() => this.select(index, item)}
              style={[styles.vehicleText, { top: -16 }]}
            >
              {item.title}
            </Text>
          </View>
        </View>
      </LinearGradient>
    ) : (
      <View
        onPress={() => this.select(index, item)}
        style={[
          styles.cardMainView,
          { borderWidth: 0.5, borderColor: "#A3BCD5" },
        ]}
      >
        <View style={{ marginTop: 5 }}>
          <Text
            onPress={() => this.select(index, item)}
            style={[styles.vehicleText, { color: "#01313C" }]}
          >
            {item.title}
          </Text>
        </View>
      </View>
    );
  };

  _renderPricingItems = ({ item, index }) => {
    return this.state.activeSlide == index ? (
      <LinearGradient
        onPress={() => this.select(index, item)}
        useAngle={true}
        angle={180}
        colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
        style={styles.gradientView}
      >
        <View
          onPress={() => this.select(index, item)}
          style={styles.cardMainView}
        >
          <View style={{ marginTop: 5 }}>
            <Text
              onPress={() => this.select(index, item)}
              style={[
                styles.vehicleText,
                { fontFamily: fonts.semiBold, top: -16 },
              ]}
            >
              {item.title}
            </Text>
          </View>
        </View>
      </LinearGradient>
    ) : (
      <View
        onPress={() => this.select(index, item)}
        style={[
          styles.cardMainView,
          { borderWidth: 0.5, borderColor: "#A3BCD5" },
        ]}
      >
        <View style={{ marginTop: 5 }}>
          <Text
            onPress={() => this.select(index, item)}
            style={[
              styles.vehicleText,
              { fontFamily: fonts.semiBold, color: "#01313C" },
            ]}
          >
            {item.title}
          </Text>
        </View>
      </View>
    );
  };

  handlePromoCode = (text) => {
    this.setState({
      promoCode: text,
    });
  };

  applyPromo() {
    if (this.state.promoCode != "") {
      this.setState({ isPromoApplied: false, promoCode: "" });
      commanService.createSimpleToast("Not a valid Promo Code", "fail");
    } else {
      commanService.createSimpleToast("Please add a promo", "fail");
    }
  }

  removePromo() {
    this.setState({ isPromoApplied: false });
  }

  _renderVehicle = ({ item, index }) => {
    console.log(item);
    return (
      //   this.state.vehicleType == item.vehicleType ?
      // <LinearGradient
      //     onPress={() => this.select(index, item)}
      //     useAngle={true}
      //     angle={180}
      //     colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
      //     style={styles.gradientView} >
      <TouchableOpacity onPress={() => this.setVehicle(index, item)}>
        {/* <View style={styles.imgView}>
                <Image
                  onPress={() => this.select(index, item)}
                  style={styles.imgIcons}
                  source={item.id == 1 ? bikeIcon : item.id == 2 ? carIcon : wheelIcon} />
              </View> */}
        <View
          style={{
            paddingLeft: 20,
            paddingTop: 30,
            backgroundColor:
              this.state.vechicleNo == item.vehRegNumber ? "#CFFCB2" : "#FFF",
          }}
        >
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
      // </LinearGradient>
      // : null
    );
  };

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: colorCodes.colorWhite }}>
        {this.state.showLoader ? (
          <View style={global.loaderStyle}>
            {/* <PreLoader preLoaderVisible={this.state.showLoader} /> */}
            <ActivityIndicator size="large" color="#770EC1" />
          </View>
        ) : null}
        <StatusBar
          backgroundColor={colorCodes.colorWhite}
          barStyle={"dark-content"}
          translucent={false}
        />
        <Overlay
          visible={this.state.modalrefundVisible}
          onClose={this.onClose}
          closeOnTouchOutside
          animationType={"bounceIn"}
          childrenWrapperStyle={{ borderWidth: 1, borderRadius: 5 }}
        >
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colorCodes.textColor,
                  fontSize: 15,
                }}
              >
                Refund Policy For Booked Parking
              </Text>
              <TouchableOpacity
                style={{ position: "absolute", right: 0, top: -5 }}
                onPress={() => {
                  this.setState({ modalrefundVisible: false });
                }}
              >
                <Image style={{ width: 30, height: 30 }} source={close} />
              </TouchableOpacity>
            </View>
            {/* <ScrollView style={{height: 20}}> */}
            <Text style={[styles.tcHeading, { marginTop: 10 }]}>
              Please find below the details for refund policy.
            </Text>
            {/* <Text style={[styles.tcHeading]}>To cancel before parking start time:</Text> */}
            <Text style={styles.tcPara}>
              1. Customer will receive a full/partial refund if they cancel any
              parking before parking time starts
            </Text>
            <Text style={styles.tcPara}>
              {
                "2. Refund will be processed to the same mode of payment which was used during the parking booking"
              }
            </Text>
            <Text style={styles.tcPara}>
              3. Refund might reflect in customers bank within 3 to 7 days time.
              It depends on customer’s bank. Our app do not control the refund
              timing.{" "}
            </Text>
            <Text style={styles.tcPara}>
              4. No refund will be made if customer did not turn up (no show)
              after booking a parking spot and customer will be charged for
              first hour of booking in such cases.{" "}
            </Text>
            <Text style={styles.tcPara}>
              5. Management holds the right to cancel any confirmed booking in
              case of any unavoidable circumstances occur at the parking space.
              Customer will receive a full refund for such cases.
            </Text>
            <Text style={styles.tcPara}>
              6. Service charges will be applicable if customer cancels the
              booking at any given time. Refund amount will be = total amount -
              service charge
            </Text>
            <Text style={styles.tcHeading}>Refund Amount:</Text>
            <Text style={styles.tcPara}>
              Refund fees vary by city and by facility. Parking management has
              every right to decide how much percentage of refund is payable to
              customer.{" "}
            </Text>
            {/* <Text style={styles.tcPara}>{'2. Customer will be charged for first hour if you do not cancel booking and do not turn up as well'}</Text>
                        <Text style={styles.tcPara}>3. Management has rights to auto cancel booking if customer did not turn up within first 15 minutes from booking time and customer will also be charged for first hour. </Text>
                        <Text style={styles.tcPara}>4. Management reserved the right to cancel and confirmed booking in case of any unwanted circumstances occur in the premises</Text>
                        <Text style={styles.tcHeading}>CANCELLATION FEES</Text>
                        <Text style={styles.tcPara}>Cancellation fees vary by city and by product. </Text> */}
            {/* <Text style={styles.tcHeading}> 3. LINKED SITES</Text>
                        <Text style={styles.tcPara}>This Site may contain links to other independent third-party Web sites ("Linked Sites”).</Text>

                        <Text style={styles.tcHeading}>4. FORWARD LOOKING STATEMENTS</Text>
                        <Text style={styles.tcPara}>All materials reproduced on this site speak as of the original date of publication or filing.</Text> */}
            {/* </ScrollView> */}
          </View>
        </Overlay>
        <Overlay
          visible={this.state.modalprivacyVisible}
          onClose={this.onClose}
          closeOnTouchOutside
          animationType={"bounceIn"}
          childrenWrapperStyle={{ borderWidth: 1, borderRadius: 5 }}
        >
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colorCodes.textColor,
                  fontSize: 16,
                }}
              >
                Cancelling a Booked Parking
              </Text>
              <TouchableOpacity
                style={{ position: "absolute", right: 0, top: -5 }}
                onPress={() => {
                  this.setState({ modalprivacyVisible: false });
                }}
              >
                <Image style={{ width: 30, height: 30 }} source={close} />
              </TouchableOpacity>
            </View>
            {/* <ScrollView style={{height: 20}}> */}
            <Text style={[styles.tcPara, { marginTop: 10 }]}>
              You can cancel parking at any time, before the booking time
              starts. If you cancel after the start time, you will be charged a
              cancellation fee.
            </Text>
            <Text style={[styles.tcHeading]}>
              To cancel before parking start time:
            </Text>
            <Text style={styles.tcPara}>
              1. Customer can cancel booked parking only via our mobile
              application
            </Text>
            <Text style={styles.tcPara}>
              {"2. Open our mobile app & click on “My Booking” section"}
            </Text>
            <Text style={styles.tcPara}>
              3. Choose the parking, which you want to cancel, from “Upcoming
              Booking”{" "}
            </Text>
            <Text style={styles.tcPara}>
              4. Click on the ellipsis icon (three dots) and choose cancel
              booking
            </Text>
            <Text style={styles.tcPara}>
              5. Customer will receive a cancellation confirmation
            </Text>
            <Text style={styles.tcHeading}>OTHER TERMS</Text>
            <Text style={styles.tcPara}>
              1. Cancellation is only allowed before your parking time starts
            </Text>
            <Text style={styles.tcPara}>
              {
                "2. Customer will be charged for first hour if you do not cancel booking and do not turn up as well"
              }
            </Text>
            <Text style={styles.tcPara}>
              3. Management has rights to auto cancel booking if customer did
              not turn up within first 15 minutes from booking time and customer
              will also be charged for first hour.{" "}
            </Text>
            <Text style={styles.tcPara}>
              4. Management reserved the right to cancel and confirmed booking
              in case of any unwanted circumstances occur in the premises
            </Text>
            <Text style={styles.tcHeading}>CANCELLATION FEES</Text>
            <Text style={styles.tcPara}>
              Cancellation fees vary by city and by product.{" "}
            </Text>
            {/* <Text style={styles.tcHeading}> 3. LINKED SITES</Text>
                        <Text style={styles.tcPara}>This Site may contain links to other independent third-party Web sites ("Linked Sites”).</Text>

                        <Text style={styles.tcHeading}>4. FORWARD LOOKING STATEMENTS</Text>
                        <Text style={styles.tcPara}>All materials reproduced on this site speak as of the original date of publication or filing.</Text> */}
            {/* </ScrollView> */}
          </View>
        </Overlay>
        <Overlay
          visible={this.state.modalVisible}
          onClose={this.onClose}
          closeOnTouchOutside
          animationType={"zoomIn"}
          childrenWrapperStyle={{ borderWidth: 1, borderRadius: 5 }}
        >
          <View style={{ width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colorCodes.textColor,
                  fontSize: 16,
                  paddingLeft: 20,
                }}
              >
                Choose Vehicle
              </Text>
              <TouchableOpacity
                style={{ position: "absolute", right: 0, top: -5 }}
                onPress={() => {
                  this.setState({ modalVisible: false });
                }}
              >
                <Image style={{ width: 30, height: 30 }} source={close} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10 }}>
              <FlatList
                data={this.state.userVechicles}
                renderItem={this._renderVehicle}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </Overlay>
        <View>
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
                        top: -3,
                        position: "absolute",
                      }}
                      source={backbutton}
                    />
                  </TouchableOpacity>
                  <Text style={styles.headerTitleText}>
                    {"Booking Summary"}
                  </Text>
                </View>
              </View>
              <View style={{ paddingLeft: 20 }}>
                <View style={{ paddingLeft: 10 }}>
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => {
                      this.state.isGuest
                        ? null
                        : this.setState({ modalVisible: true });
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        color: "#04093F",
                        fontSize: 16,
                      }}
                    >
                      Vehicle No.
                    </Text>
                    {this.state.isGuest ? null : (
                      <Image
                        source={bookDetails}
                        style={{
                          width: 15,
                          height: 15,
                          marginLeft: 5,
                          marginTop: 5,
                          resizeMode: "contain",
                        }}
                      />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={{ fontFamily: fonts.semiBold, color: "#01313C" }}
                  >
                    {this.state.vechicleNo}
                  </Text>

                  <Image
                    source={
                      this.state.vehicleType == 1
                        ? Sccoter_big
                        : this.state.vehicleType == 2
                        ? carVector
                        : this.state.vehicleType == 3
                        ? rickshaw_big
                        : null
                    }
                    style={{
                      width: 120,
                      height: 120,
                      position: "absolute",
                      resizeMode: "contain",
                      top: -40,
                      right: 30,
                    }}
                  />
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "#00000057",
                      paddingBottom: 10,
                      marginRight: 30,
                      opacity: 0.2,
                    }}
                  ></View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        global.appName,
                        {
                          paddingLeft: 10,
                          fontSize: 14,
                          fontFamily: fonts.regular,
                          color: "#707070",
                          paddingTop: 10,
                        },
                      ]}
                    >
                      Location
                    </Text>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: "#A3BCD5",
                        backgroundColor: "#FFF",
                        position: "absolute",
                        right: 30,
                        top: 10,
                        padding: 5,
                        marginTop: 15,
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                      }}
                      onPress={() => {
                        this.props.navigation.navigate("Dashboard");
                        // this.props.navigation.navigate('FindParking', {
                        //   parkingName: this.state.parkingDetails.name,
                        // })
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          color: colorCodes.textColor,
                          padding: 5,
                        }}
                      >
                        Change
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={[
                      global.appName,
                      {
                        paddingLeft: 10,
                        fontSize: 18,
                        fontFamily: fonts.semiBold,
                      },
                    ]}
                  >
                    {this.state.parkingDetails.name}
                  </Text>
                </View>
                <View
                  style={{
                    color: "#04093F",
                    flexDirection: "row",
                    textAlign: "left",
                    paddingLeft: 7,
                    fontSize: 15,
                    marginRight: 10,
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
                    {this.state.parkingDetails.address}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginLeft: 30, marginRight: 10, marginTop: 15 }}>
              <Text style={styles.loginLabel}>Booking Type</Text>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={{
                      borderWidth: 1,
                      borderColor: "#A3BCD5",
                      backgroundColor: "#FFF",
                      position: "absolute",
                      right: 20,
                      top: 10,
                      borderTopRightRadius: 5,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                      zIndex: 200,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        color: colorCodes.textColor,
                        padding: 7,
                        paddingRight: 15,
                        paddingLeft: 15,
                      }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={this.state.Pricingentries}
                renderItem={this._renderPricingItems}
                sliderWidth={320}
                itemWidth={100}
                autoplay={false}
                firstItem={this.state.activeSlide}
                activeSlideAlignment={
                  this.state.activeSlide == 0
                    ? "start"
                    : this.state.activeSlide == 1
                    ? "center"
                    : this.state.activeSlide == 2
                    ? "end"
                    : "start"
                }
                enableSnap={false}
                scrollEnabled={false}
                onSnapToItem={(index) => this.setState({ activeSlide: index })}
              />

              <Text style={[styles.loginLabel, { marginTop: 10 }]}>
                Parking Date
              </Text>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={{
                      borderWidth: 1,
                      borderColor: "#A3BCD5",
                      backgroundColor: "#FFF",
                      position: "absolute",
                      right: 20,
                      top: 10,
                      borderTopRightRadius: 5,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                      zIndex: 200,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        color: colorCodes.textColor,
                        padding: 7,
                        paddingRight: 15,
                        paddingLeft: 15,
                      }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={this.state.availableDates}
                renderItem={this._renderItem}
                sliderWidth={320}
                itemWidth={100}
                autoplay={false}
                firstItem={this.state.activeSlide}
                activeSlideAlignment={
                  this.state.activeSlide == 0
                    ? "start"
                    : this.state.activeSlide == 1
                    ? "center"
                    : this.state.activeSlide == 2
                    ? "end"
                    : "start"
                }
                enableSnap={false}
                scrollEnabled={false}
                onSnapToItem={(index) => this.setState({ activeSlide: index })}
              />
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={{
                      borderWidth: 1,
                      borderColor: "#A3BCD5",
                      backgroundColor: "#FFF",
                      position: "absolute",
                      right: 20,
                      top: 40,
                      borderTopRightRadius: 5,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        color: colorCodes.textColor,
                        padding: 7,
                        paddingRight: 15,
                        paddingLeft: 15,
                      }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  borderWidth: 0.5,
                  marginTop: 20,
                  width: "60%",
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  borderColor: "#A3BCD5",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    paddingTop: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      marginLeft: 15,
                      fontFamily: fonts.regular,
                      fontSize: 10,
                    }}
                  >
                    Start Time
                  </Text>
                  <Text
                    style={{
                      textAlign: "right",
                      marginLeft: 70,
                      fontFamily: fonts.regular,
                      fontSize: 10,
                    }}
                  >
                    End Time
                  </Text>
                </View>
                <Image
                  source={pinPoint}
                  style={{
                    width: 20,
                    position: "absolute",
                    height: 20,
                    resizeMode: "contain",
                    paddingTop: 80,
                    marginLeft: 20,
                    zIndex: 300,
                  }}
                />
                <Slider
                  style={{ width: 150, height: 40 }}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#A3BCD5"
                  maximumTrackTintColor="#A3BCD5"
                  thumbTintColor="#FFF"
                  disabled={true}
                />
                <Image
                  source={pinPoint}
                  style={{
                    width: 20,
                    position: "absolute",
                    height: 20,
                    resizeMode: "contain",
                    paddingTop: 80,
                    marginLeft: 130,
                    zIndex: 300,
                  }}
                />
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    marginTop: -10,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      marginLeft: 16,
                      fontFamily: fonts.semiBold,
                      fontSize: 12,
                      color: "#04093F",
                    }}
                  >
                    {this.state.startTime}
                  </Text>
                  <Text
                    style={{
                      textAlign: "right",
                      marginLeft: 85,
                      fontFamily: fonts.semiBold,
                      fontSize: 12,
                      color: "#04093F",
                    }}
                  >
                    {this.state.endTime}
                  </Text>
                </View>
              </View>
              <View style={{ marginBottom: 130 }}>
                <Text style={[styles.loginLabel, { marginTop: 15 }]}>
                  Promo Code
                </Text>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <Image
                    source={sales}
                    style={{
                      width: 30,
                      // position: 'absolute',
                      height: 30,
                      marginTop: 5,
                      marginRight: 5,
                      resizeMode: "contain",
                      zIndex: 300,
                    }}
                  />
                  <TextInput
                    editable={!this.state.isPromoApplied}
                    style={{
                      borderColor: this.state.isPromoApplied
                        ? "#57AB20"
                        : "#A3BCD5",
                      borderWidth: 1,
                      width: "59%",
                      height: 40,
                      borderTopRightRadius: 5,
                      backgroundColor: this.state.isPromoApplied
                        ? "#CFFCB2"
                        : "#FFF",
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                      color: this.state.isPromoApplied
                        ? "#57AB20"
                        : colorCodes.textColor,
                      paddingLeft: 10,
                      fontFamily: fonts.semiBold,
                    }}
                    onChangeText={this.handlePromoCode}
                    maxLength={10}
                    value={this.state.promoCode}
                  />
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {this.state.isPromoApplied ? (
                        <TouchableOpacity
                          onPress={() => this.removePromo()}
                          style={{
                            borderWidth: 1,
                            borderColor: "#A3BCD5",
                            backgroundColor: "#FFF",
                            marginLeft: 15,
                            borderTopRightRadius: 5,
                            borderTopLeftRadius: 5,
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fonts.semiBold,
                              color: colorCodes.textColor,
                              padding: 7,
                              paddingRight: 15,
                              paddingLeft: 15,
                            }}
                          >
                            Remove
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.applyPromo()}
                          style={{
                            marginTop: 0,
                            borderWidth: 1,
                            borderColor: "#A3BCD5",
                            backgroundColor: "#FFF",
                            marginLeft: 15,
                            borderTopRightRadius: 5,
                            borderTopLeftRadius: 5,
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fonts.semiBold,
                              color: colorCodes.textColor,
                              padding: 7,
                              paddingRight: 15,
                              paddingLeft: 15,
                            }}
                          >
                            Apply
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{ marginTop: 15, marginLeft: 3 }}
                    onPress={() => {
                      this.setState({ modalprivacyVisible: true });
                    }}
                  >
                    <Text
                      style={{
                        paddingBottom: 15,
                        textDecorationLine: "underline",
                        color: colorCodes.primaryColor,
                        textAlign: "left",
                        width: "100%",
                        fontFamily: fonts.regular,
                      }}
                    >
                      {"Cancellation Policy" + " & "}
                    </Text>
                  </TouchableOpacity>
                  {/* <View style={{ marginTop: 15, marginLeft: 3 }}> */}
                  {/* <Text style={{ paddingBottom: 15,color: colorCodes.textColor, textAlign: 'left', width: '100%', fontFamily: fonts.regular,textDecorationLine: 'underline', color: colorCodes.primaryColor, }}>{"&"}</Text> */}
                  {/* </View> */}
                  <TouchableOpacity
                    style={{ marginTop: 15 }}
                    onPress={() => {
                      this.setState({ modalrefundVisible: true });
                    }}
                  >
                    <Text
                      style={{
                        paddingBottom: 15,
                        textDecorationLine: "underline",
                        color: colorCodes.primaryColor,
                        textAlign: "left",
                        width: "100%",
                        fontFamily: fonts.regular,
                      }}
                    >
                      Refund Policy
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
          <HideWithKeyboard>
            {!this.state.showLoader ? (
              <TouchableOpacity
                onPress={() => {
                  this.bookParking();
                }}
                style={{
                  width: "100%",
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    zIndex: 20,
                  }}
                >
                  <LinearGradient
                    useAngle={true}
                    onPress={() => {
                      this.bookParking();
                    }}
                    angle={260}
                    colors={["#9C28E9", "#3240B1"]}
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
                      CONFIRM SUMMARY
                    </Text>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            ) : null}
          </HideWithKeyboard>
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
    width: "90%",
    height: 40,
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
    fontFamily: fonts.semiBold,
    fontSize: 14,
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
    fontSize: 14,
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
    color: "#01313C",
    textAlign: "left",
    fontFamily: fonts.semiBold,
    fontSize: 16,
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
  tcHeading: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colorCodes.textColor,
    paddingTop: 10,
  },
  tcPara: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colorCodes.textColor,
  },
});
