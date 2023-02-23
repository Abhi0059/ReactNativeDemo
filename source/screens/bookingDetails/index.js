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
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
var location = require("../../../assets/imgs/location.png");
import moment from "moment";
import Carousel from "react-native-snap-carousel";
var clock = require("../../../assets/imgs/clock.png");
import colorCodes from "../../themes/colorCodes";
import LinearGradient from "react-native-linear-gradient";
import fonts from "../../themes/fonts";
import { Base64 } from "js-base64";
import RestApi from "../../utils/restapii";
import { apiName } from "../../../Config";
import global from "../../themes/global";
import Toast from "react-native-simple-toast";
var bikeIcon = require("../../../assets/imgs/motorbike.png");
var wheelIcon = require("../../../assets/imgs/tuk-tuk.png");
var backbutton = require("../../../assets/imgs/backbutton.png");
var bookDetails = require("../../../assets/imgs/bookDetails.png");
import Overlay from "react-native-modal-overlay";
var restApi = new RestApi();
import CommanServices from "../../utils/comman";
var commanService = new CommanServices();
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  WheelPicker,
  TimePicker,
  DatePicker,
} from "react-native-wheel-picker-android";
var carVector = require("../../../assets/imgs/carVector.png");
var Sccoter_big = require("../../../assets/imgs/Sccoter_big.png");
var rickshaw_big = require("../../../assets/imgs/rickshaw_big.png");
var close = require("../../../assets/imgs/close.png");

const styleee = {
  backgroundColor: "#FF6584",
  width: 300,
  height: Platform.OS === "ios" ? 50 : 100,
  color: "#ffffff",
  fontSize: 15,
  lineHeight: 2,
  lines: 4,
  borderRadius: 15,
  fontFamily: fonts.semiBold,
  paddingLeft: 20,
  paddingRight: 20,
  yOffset: 40,
};
export default class BookingDetails extends Component {
  constructor(props) {
    super(props);

    console.log(JSON.stringify(this.props.route.params.data));
    this.state = {
      parkingDetails: this.props.route.params.data,
      setDatePickerVisibility: false,
      userVechicles: this.props.route.params.userVechicles,
      Pricingentries: [
        { id: 0, title: "Hourly" },
        //{id: 1, title: 'Weekly'},
        { id: 2, title: "Monthly" },
      ],
      availableDates: [],
      activeSlide: 0,
      activeSlide_date: 0,
      vechicleNo: "",
      vehicleType: null,
      showStartTime: false,
      showStopTime: false,
      startTime: "",
      endTime: "",
      showTimer: false,
      currentDate: new Date(),
      type: "",
      modalVisible: false,
      bookingType: "D",
      bookingDate: "",
      showLoader: false,
      mallStartTime: this.props.route.params.mallStartTime,
      mallEndTime: this.props.route.params.mallEndTime,
      datestatus: this.props.route.params.datestatus,
      isModify: this.props.route.params.isModify
        ? this.props.route.params.isModify
        : "no",
      bookingID: this.props.route.params.bookingID,
      isGuest: false,
      selectedItem: 0,
      slotDates: [],
      slotStartTime: "",
      slotEndTime: "",
    };
    if (this.props.route.params.data == undefined) {
      console.log("here");
    }
  }

  componentDidMount() {
    console.log("this.props.route.params", this.props.route.params);
    this.getUserData();
    console.log("this.state.datestatus:>>", this.state.datestatus);

    if (this.state.datestatus == undefined) {
      this.getAvailableDates();
    } else {
      this.getDates();
    }
  }

  getAvailableDates() {
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
          _this.state.parkingDetails.facilityid, //_this.state.parkingDetails.facilityId || _this.state.parkingDetails.facilityid
      };
      console.log(apiName["getAvailableDates"]);
      console.log("getAvailableDates REQUEST:>>", req);
      restApi.setUrl(apiName["getAvailableDates"]);
      restApi.setReq(req);
      restApi.sendRequest(function (response) {
        console.log("getAvailableDates", response);
        if (response.respCode == 0) {
          console.log("getAvailableDatesgetAvailableDates", response);
          _this.setState({
            datestatus: response["datestatus"],
            showLoader: false,
          });
          _this.getDates();
          var startTime = _this.props.route.params.data.startTime / 60;
          if (startTime >= 12) {
            _this.setState({ mallStartTime: startTime.toString() + ":00 PM" });
          } else {
            _this.setState({ mallStartTime: startTime.toString() + ":00 AM" });
          }

          var endTime = Math.round(
            _this.props.route.params.data.endTime / 60
          ).toFixed(2);
          console.log("mallEndTime", endTime);

          if (endTime >= 12) {
            if (endTime == 12) {
              _this.setState({ mallEndTime: endTime.toString() + ":00 PM" });
            } else {
              if (endTime == 24) {
                _this.setState({
                  mallEndTime: (endTime - 12).toString() + ":00 AM",
                });
              } else {
                _this.setState({
                  mallEndTime: (endTime - 12).toString() + ":00 PM",
                });
              }
            }
          } else {
            _this.setState({ mallEndTime: endTime.toString() + ":00 AM" });
          }
        } else {
          _this.setState({ datestatus: [], showLoader: false });
        }
      });
    });
  }

  getDates() {
    let week = [];
    // var todaysDate = new Date();
    // var year = todaysDate.getFullYear();
    // var month = (1 + todaysDate.getMonth()).toString();
    // month = month.length > 1 ? month : '0' + month;
    // var day = todaysDate.getDate().toString();
    // day = day.length > 1 ? day : '0' + day;
    // var b = year + '-' + month + '-' + day;
    // var current_date = b; //Todays  Date: yyyy/mm/dd format

    // //toDate
    // var to_Date = new Date()
    // to_Date.setMonth(to_Date.getMonth() + 1);  //for all date till next one month
    // var e_Date = new Date(to_Date);
    // var e_year = e_Date.getFullYear();
    // var e_month = (1 + e_Date.getMonth()).toString();
    // e_month = e_month.length > 1 ? e_month : '0' + e_month;
    // var e_day = e_Date.getDate().toString();
    // e_day = e_day.length > 1 ? e_day : '0' + e_day;
    // var c = e_year + '-' + e_month + '-' + e_day;
    // var end_date = c //End   Date: yyyy/mm/dd format

    var listDate = [];
    // var startDate = current_date;
    // var endDate = end_date;
    // var dateMove = new Date(startDate);
    // var strDate = startDate;

    // while (strDate < endDate) {
    //     var strDate = dateMove.toISOString().slice(0, 10);
    //     listDate.push(strDate);
    //     dateMove.setDate(dateMove.getDate() + 1);
    // };
    // console.log("LISTDATE:>>",listDate);
    console.log(this.state.datestatus);
    for (let i = 0; i < this.state.datestatus.length; i++) {
      let _dayyy = moment(new Date(this.state.datestatus[i].date)).format(
        "yyyy-MM-DD"
      );
      console.log("_dayyys", _dayyy);

      // let _dayyys = new Date(this.state.datestatus[i].date)
      //   .toISOString()
      //   .slice(0, 10);
      //  console.log('_dayyys', _dayyys);
      var available_dates = {
        _day: _dayyy,
        holidayStatus: this.state.datestatus[i].holidaystatus,
      };
      listDate.push(available_dates);
    }
    console.log("LISTDATE:>>>>", listDate);

    for (let i = 0; i < listDate.length; i++) {
      var datePart = listDate[i]._day.split("-");
      var month = datePart[1];
      var mon =
        month == "01"
          ? "JAN"
          : month == "02"
          ? "FEB"
          : month == "03"
          ? "MAR"
          : month == "04"
          ? "APR"
          : month == "05"
          ? "MAY"
          : month == "06"
          ? "JUN"
          : month == "07"
          ? "JUL"
          : month == "08"
          ? "AUG"
          : month == "09"
          ? "SEP"
          : month == "10"
          ? "OCT"
          : month == "11"
          ? "NOV"
          : month == "12"
          ? "DEC"
          : "JAN";
      var dayy = datePart[2];

      var a = {
        id: i,
        title: dayy + " " + mon,
        originalDate: listDate[i],
        mmDD: mon + " " + dayy,
        holidayStatus: listDate[i].holidayStatus,
      };
      console.log(a);
      week.push(a);
    }
    for (let i = 0; i < listDate.length; i++) {
      if (listDate[i].holidayStatus == 1) {
        this.state.activeSlide_date = i;
        break;
      }
    }

    console.log(week);
    this.setState({ availableDates: week, bookingDate: week[0] });
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
    this.setState({
      activeSlide: index,
      bookingType: index == 0 ? "D" : index == 1 ? "W" : index == 2 ? "M" : "D",
    });
  }
  selectDate(index, item) {
    console.log(index, item);
    if (item.holidayStatus == 1) {
      console.log("first");
      Toast.show("Mall is Closed, Select another day");
    } else {
      console.log("second");
      this.setState({
        activeSlide_date: index,
        bookingDate: item,
        selectedItem: 0,
        slotStartTime: "",
        slotEndTime: "",
        actualStartTime: "",
        actualEndTime: "",
        startTime: "",
        endTime: "",
      });
    }
  }

  continue() {
    // alert("Book Parking")
    if (this.state.startTime != "" && this.state.endTime != "") {
      this.props.navigation.navigate("BookingSummary", {
        data: this.state.parkingDetails,
        bookingType: this.state.bookingType,
        bookingDate: this.state.bookingDate,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        userVechicles: this.state.userVechicles,
        actualStartTime: this.state.actualStartTime,
        actualEndTime: this.state.actualEndTime,
        isModify: this.state.isModify,
        bookingID: this.state.bookingID,
      });
    } else {
      alert("Please select time to continue");
      // Toast.show("Please select time to continue", Toast.LONG, Toast.TOP, styleee);
    }
  }

  _renderItem = ({ item, index }) => {
    console.log("_renderItem", item);
    return this.state.activeSlide == index ? (
      <LinearGradient
        onPress={() => {
          if (item.id == 1) {
            this.select(index, item);
          }
        }}
        useAngle={true}
        angle={180}
        colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
        style={styles.gradientView}
      >
        <TouchableOpacity
          onPress={() => {
            if (item.id == 1) {
              this.select(index, item);
            }
          }}
          style={styles.cardMainView}
        >
          <View style={{ marginTop: 5 }}>
            <Text
              onPress={() => {
                if (item.id == 1) {
                  this.select(index, item);
                }
              }}
              style={[
                styles.vehicleText,
                { fontFamily: fonts.regular, top: -12 },
              ]}
            >
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    ) : (
      <TouchableOpacity
        onPress={() => {
          if (item.id == 1) {
            this.select(index, item);
          }
        }}
        style={[
          styles.cardMainView,
          {
            borderWidth: 0.5,
            borderColor: "#A3BCD5",
            backgroundColor: "lightgrey",
          },
        ]}
      >
        <View style={{ marginTop: 5 }}>
          <Text
            onPress={() => {
              if (item.id == 1) {
                this.select(index, item);
              }
            }}
            style={[
              styles.vehicleText,
              { fontFamily: fonts.regular, color: "#01313C" },
            ]}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _renderDateItems = ({ item, index }) => {
    return item.holidayStatus == 0 ? (
      this.state.activeSlide_date == index ? (
        <LinearGradient
          onPress={() => this.selectDate(index, item)}
          useAngle={true}
          angle={180}
          colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
          style={[styles.gradientView]}
        >
          <TouchableOpacity
            onPress={() => this.selectDate(index, item)}
            style={styles.cardMainView}
          >
            <View style={{ marginTop: 5 }}>
              <Text
                onPress={() => this.selectDate(index, item)}
                style={[
                  styles.vehicleText,
                  { fontFamily: fonts.regular, top: -12, fontSize: 14 },
                ]}
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <TouchableOpacity
          onPress={() => this.selectDate(index, item)}
          style={[
            styles.cardMainView,
            {
              borderWidth: 0.5,
              borderColor: "#A3BCD5",
              padding: 8,
              marginTop: 2,
            },
          ]}
        >
          <View style={{ marginTop: 5 }}>
            <Text
              onPress={() => this.selectDate(index, item)}
              style={[
                styles.vehicleText,
                { fontFamily: fonts.regular, color: "#01313C", fontSize: 14 },
              ]}
            >
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      )
    ) : (
      <TouchableOpacity
        onPress={() => this.selectDate(index, item)}
        style={[
          styles.cardMainView,
          {
            backgroundColor: "#ddd",
            borderWidth: 0.5,
            borderColor: "#A3BCD5",
            padding: 8,
            marginTop: 2,
          },
        ]}
      >
        <View style={{ marginTop: 5 }}>
          <Text
            onPress={() => this.selectDate(index, item)}
            style={[
              styles.vehicleText,
              { fontFamily: fonts.regular, color: "#01313C", fontSize: 14 },
            ]}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  //Parse In
  parseIn = (date_time) => {
    console.log("parseIn", date_time);
    var d = new Date();

    d.setHours(date_time.substring(11, 13));
    d.setMinutes(date_time.substring(14, 16));
    console.log("first", d);
    return d;
  };

  //make list
  getTimeIntervals = (time1, time2) => {
    console.log("time1", time1);
    console.log("time2", time2);

    var arr = [];
    while (time1 < time2) {
      // let strTime = this.formatAMPM(time1);
      //  console.log('first', strTime);
      // arr.push(strTime);
      console.log("time1", time1);
      if (time1.toTimeString().substring(0, 5) != "00:00") {
        arr.push(time1.toTimeString().substring(0, 5));
      }
      time1.setMinutes(time1.getMinutes() + 15);
    }
    console.log("firstarr", arr);
    return arr;
  };

  formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  selectTime(type) {
    console.log("selectTime", this.state.bookingDate);
    if (this.state.bookingDate == null || this.state.bookingDate == undefined) {
      return;
    }
    //Input
    console.log("this.state.mallEndTime", this.state.mallEndTime);
    var splitEndTime = this.state.mallEndTime.split(":");
    console.log("first", splitEndTime[0]);
    var splitForAmPm = splitEndTime[1].split(" ");
    var amPm = splitForAmPm[1];
    var _h = "24";
    console.log(amPm);
    let endIs = parseInt(splitEndTime[0]);
    console.log("endIs", endIs);
    if (amPm == "PM") {
      switch (endIs.toString()) {
        case "1":
          _h = "13";
          break;
        case "2":
          _h = "14";
          break;
        case "3":
          _h = "15";
          break;
        case "4":
          _h = "16";
          break;
        case "5":
          _h = "17";
          break;
        case "6":
          _h = "18";
          break;
        case "7":
          _h = "19";
          break;
        case "8":
          _h = "20";
          break;
        case "9":
          _h = "21";
          break;
        case "10":
          _h = "22";
          break;
        case "11":
          _h = "23";
          break;
        case "12":
          _h = "12";
          break;

        default:
          break;
      }
    }

    if (type == "start") {
      console.log(this.state.bookingDate.originalDate["_day"]);
      var coeff = 1000 * 60 * 15;

      var date = new Date(); //or use any other date
      console.log("date", date);
      var rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
      console.log("rounded", rounded);
      var h = rounded.getHours().toString();
      var m = rounded.getMinutes().toString();
      var splitStartTime = this.state.mallStartTime.split(":");
      var q =
        splitStartTime[0].length == 1
          ? "0" + splitStartTime[0]
          : splitStartTime[0];
      var l = h.length == 1 ? "0" + h : h;
      console.log("h", h);
      console.log("_h", _h);

      if (_h == h) {
        if (this.state.bookingDate.id == 0) {
          Toast.show("No slots available for this date.");
          //commanService.createSimpleToast('No slots available for this date.');
          return;
        }
      }

      var i = this.state.bookingDate.id != 0 ? q : l;
      var j = this.state.bookingDate.id != 0 ? "00" : m;

      var startSlot =
        this.state.bookingDate.originalDate["_day"] + " " + i + ":" + j;

      var endSlot =
        this.state.bookingDate.originalDate["_day"] + " " + _h + ":" + "00";
      console.log("startSlot", startSlot, " ", endSlot);

      var startTime = startSlot; //"2021-04-21 16:30:00"
      var endTime = endSlot; //"2021-04-21 18:15:00"
      console.log(this.state.mallEndTime.split(":"));

      console.log("startSlot", startSlot);
      console.log("endTime", endSlot);

      startTime = this.parseIn(startTime);
      endTime = this.parseIn(endTime);

      console.log("startTime", startTime);
      console.log("endTime", endTime);

      var intervals = this.getTimeIntervals(startTime, endTime);
      console.log(intervals);
      this.setState({ showTimer: true, type: type, slotDates: intervals });
    } else {
      console.log("slotStartTime:", this.state.slotEndTime);
      console.log(" vfgvdfgdfgdfg", _h);
      var startSlot =
        this.state.bookingDate.originalDate["_day"] +
        " " +
        this.state.slotEndTime;
      var endSlot =
        this.state.bookingDate.originalDate["_day"] + " " + _h + ":" + "00";
      console.log("startSlot", startSlot);
      var startTime = startSlot; //"2021-04-21 16:30:00"
      var endTime = endSlot; //"2021-04-21 18:15:00"
      console.log(this.state.mallEndTime.split(":"));

      // //Parse In
      // var parseIn = function (date_time) {
      //   var d = new Date();
      //   d.setHours(date_time.substring(11, 13));
      //   d.setMinutes(date_time.substring(14, 16));
      //   return d;
      // };

      // //make list
      // var getTimeIntervals = function (time1, time2) {
      //   var arr = [];
      //   while (time1 < time2) {
      //     arr.push(time1.toTimeString().substring(0, 5));
      //     time1.setMinutes(time1.getMinutes() + 15);
      //   }
      //   return arr;
      // };

      console.log("startSlot", startSlot);
      console.log("endTime", endSlot);

      startTime = this.parseIn(startTime);
      endTime = this.parseIn(endTime);

      console.log("startTime", startTime);
      console.log("endTime", endTime);

      var intervals = this.getTimeIntervals(startTime, endTime);
      console.log(intervals);
      this.setState({ showTimer: true, type: type, slotDates: intervals });
    }
  }

  onItemSelected = (selectedItem) => {
    if (this.state.type == "start") {
      //actualStartTime
      //actualEndTime
      var startTime =
        this.state.bookingDate.originalDate["_day"] +
        " " +
        this.state.slotDates[selectedItem];
      var endTime =
        this.state.bookingDate.originalDate["_day"] +
          " " +
          this.state.slotDates[selectedItem + 4] ||
        this.state.slotDates[this.state.slotDates.length - 1];
      this.setState({
        selectedItem,
        slotStartTime: this.state.slotDates[selectedItem],
        slotEndTime:
          this.state.slotDates[selectedItem + 4] ||
          this.state.slotDates[this.state.slotDates.length - 1],
        actualStartTime: new Date(startTime),
        actualEndTime: new Date(endTime),
      });
      console.log("startTime:>>", startTime);
      console.log("startTime:>>", new Date(startTime));
      console.log("ENDTIME:>>", endTime);
      console.log("ENDTIME:>>", new Date(endTime));
    } else {
      var endTime =
        this.state.bookingDate.originalDate["_day"] +
        " " +
        this.state.slotDates[selectedItem];
      console.log("ENDTIME:>>", endTime);
      console.log("ENDTIME:>>", new Date(endTime));

      this.setState({
        slotEndTime:
          this.state.slotDates[selectedItem] ||
          this.state.slotDates[this.state.slotDates.length - 1],
        actualEndTime: new Date(endTime),
      });
    }
  };

  // onPress = () => {
  //     this.setState({ selectedItem: 3 });
  // };

  handleConfirm = (time) => {
    console.log(this.state.mallStartTime.split(":"));
    var mallStart = this.state.mallStartTime.split(":");
    var mallEnd = this.state.mallEndTime.split(":");
    if (this.state.activeSlide_date == 0) {
      var a = time;
    } else {
      var today = new Date(time);
      var tomorrow = new Date(time);
      var a = new Date(
        tomorrow.setDate(today.getDate() + this.state.activeSlide_date)
      );
      console.log("kal ki date:>>", a);
    }

    var hours = a.getHours();
    var minutes = a.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + "" + ampm;
    console.log(hours);
    console.log(mallStart[0].toString());
    console.log(mallEnd[0].toString());
    if (this.state.type == "start") {
      if (this.state.mallStartTime)
        if (strTime.includes("AM")) {
          if (mallStart[0] > hours) {
            commanService.createSimpleToast(
              "Mall Open at " + this.state.mallStartTime,
              "fail"
            );
            this.setState({ showTimer: false });
            return;
          } else {
            if (this.state.activeSlide_date != 0) {
              this.setState({
                showTimer: false,
                startTime: strTime,
                actualStartTime: new Date(a),
              });
            } else {
              if (mallStart[0] == hours || mallStart[0] < hours) {
                this.setState({
                  showTimer: false,
                  startTime: strTime,
                  actualStartTime: new Date(a),
                });
              } else {
                commanService.createSimpleToast("Mall is closed", "fail");
                this.setState({ showTimer: false });
              }
            }
          }
        } else {
          if (mallEnd[0] < hours + 1 && hours != 12) {
            commanService.createSimpleToast(
              "Mall closed at " + this.state.mallEndTime,
              "fail"
            );
            this.setState({ showTimer: false });
            return;
          } else {
            this.setState({
              showTimer: false,
              startTime: strTime,
              actualStartTime: new Date(a),
            });
          }
        }
    } else if (this.state.type == "end") {
      if (strTime.includes("PM")) {
        if (mallEnd[0] < hours) {
          if (hours == 12) {
            this.setState({
              showTimer: false,
              endTime: strTime,
              actualEndTime: new Date(a),
            });
          } else {
            commanService.createSimpleToast(
              "Mall Closed Please select another date",
              "fail"
            );
            this.setState({ showTimer: false });
            return;
          }
        } else {
          if (this.state.activeSlide_date != 0) {
            this.setState({
              showTimer: false,
              endTime: strTime,
              actualEndTime: new Date(a),
            });
          } else {
            if (mallEnd[0] == hours || mallEnd[0] > hours - 1) {
              this.setState({
                showTimer: false,
                endTime: strTime,
                actualEndTime: new Date(a),
              });
            } else {
              commanService.createSimpleToast("Mall is Closed", "fail");
              this.setState({ showTimer: false });
            }
          }
        }
      } else {
        if (mallStart[0] > hours - 1 && hours != 12) {
          commanService.createSimpleToast("Mall is closed", "fail");
          this.setState({ showTimer: false });
          return;
        } else {
          this.setState({
            showTimer: false,
            endTime: strTime,
            actualEndTime: new Date(a),
          });
        }
        this.setState({
          showTimer: false,
          endTime: strTime,
          actualEndTime: new Date(a),
        });
      }
    }
  };

  save() {
    this.setState({
      showTimer: false,
      startTime: this.state.slotStartTime,
      endTime: this.state.slotEndTime,
    });
  }

  hideDatePicker = () => {
    this.setState({ showTimer: false });
  };

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
      <SafeAreaView style={{ backgroundColor: colorCodes.colorWhite, flex: 1 }}>
        <StatusBar
          backgroundColor={colorCodes.colorWhite}
          barStyle={"dark-content"}
          translucent={false}
        />
        {this.state.showLoader ? (
          <View style={global.loaderStyle}>
            {/* <PreLoader preLoaderVisible={this.state.showLoader} /> */}
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : null}
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
        <Overlay
          animationType="zoomIn"
          containerStyle={{ backgroundColor: "rgba(37, 8, 10, 0.78)" }}
          animationDuration={500}
          visible={this.state.showTimer}
          onClose={this.onClose}
          closeOnTouchOutside
          //animationType={'fadeInUp'}
          childrenWrapperStyle={{ borderWidth: 1, borderRadius: 5 }}
        >
          <View style={{ width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colorCodes.textColor,
                  fontSize: 16,
                  paddingLeft: 10,
                }}
              >
                {this.state.type == "start"
                  ? "Select Start Time"
                  : "Select End Time"}
              </Text>
              <TouchableOpacity
                style={{ position: "absolute", right: 0, top: -5 }}
                onPress={() => {
                  this.setState({ showTimer: false });
                }}
              >
                <Image style={{ width: 30, height: 30 }} source={close} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10, marginLeft: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    color: colorCodes.textColor,
                  }}
                >
                  Mall closes at{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    color: colorCodes.textColor,
                    marginTop: -3,
                  }}
                >
                  {this.state.mallEndTime}
                </Text>
              </View>
              {this.state.type == "start" ? null : (
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        color: colorCodes.textColor,
                      }}
                    >
                      Date
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        color: colorCodes.textColor,
                      }}
                    >
                      {this.state.bookingDate?.title}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        color: colorCodes.textColor,
                      }}
                    >
                      Selected Start Time
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        color: colorCodes.textColor,
                        textAlign: "center",
                      }}
                    >
                      {this.state.slotStartTime}
                    </Text>
                  </View>
                  <View style={{ opacity: 0 }}>
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        color: colorCodes.textColor,
                      }}
                    >
                      End Time
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        color: colorCodes.textColor,
                        textAlign: "center",
                      }}
                    >
                      {this.state.slotEndTime}
                    </Text>
                  </View>
                </View>
              )}
              <View
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                {this.state.slotDates && this.state.slotDates.length ? (
                  <WheelPicker
                    selectedItem={this.state.selectedItem}
                    indicatorWidth={0}
                    hideIndicator={true}
                    indicatorColor={colorCodes.primaryColor}
                    itemTextFontFamily={fonts.regular}
                    itemTextColor={colorCodes.textColor}
                    selectedItemTextFontFamily={fonts.semiBold}
                    selectedItemTextColor={colorCodes.textColor}
                    data={this.state.slotDates}
                    onItemSelected={this.onItemSelected}
                  />
                ) : null}

                {/* <Text style={{ fontFamily: fonts.regular, color: colorCodes.textColor, fontSize:10, marginBottom: 10 }}>*Booking slots available till 17:00</Text> */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    width: "100%",
                  }}
                  onPress={() => {
                    this.save();
                  }}
                >
                  <LinearGradient
                    useAngle={true}
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
                        this.save();
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
                          this.save();
                        }}
                      >
                        SAVE
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Overlay>
        <View>
          {/* {this.state.showTimer ? */}

          {/* <DateTimePickerModal
                        isVisible={this.state.showTimer}
                        mode={'time'}
                        display={'spinner'}
                        style={{ fontFamily: fonts.semiBold }}
                        is24Hour={false}
                        date={this.state.currentDate}
                        minuteInterval={15}
                        minimumDate={new Date()}
                        maximumDate={new Date()}
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                    /> */}

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
                        marginTop: -3,
                        position: "absolute",
                      }}
                      source={backbutton}
                    />
                  </TouchableOpacity>
                  <Text style={styles.headerTitleText}>
                    {"Booking Details"}
                  </Text>
                </View>
              </View>
              <View style={{ marginLeft: 20 }}>
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
                <Text
                  style={[
                    global.appName,
                    {
                      paddingLeft: 10,
                      fontSize: 16,
                      fontFamily: fonts.semiBold,
                      color: "#04093F",
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
                    paddingLeft: 8,
                    fontSize: 14,
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
                    {this.state.parkingDetails.address +
                      ", " +
                      this.state.parkingDetails.city}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginLeft: 30, marginRight: 30, marginTop: 15 }}>
              <Text style={styles.loginLabel}>Booking Type</Text>
              <View style={{ marginTop: -10 }}>
                <Carousel
                  // ref={(c) => { this._carousel = c; }}
                  data={this.state.Pricingentries}
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
                  onSnapToItem={(index) =>
                    this.setState({ activeSlide: index })
                  }
                />
              </View>
              <Text style={[styles.loginLabel, { marginTop: 15 }]}>
                Select Date
              </Text>
              <View style={{ flexDirection: "row", marginTop: -10 }}>
                <Carousel
                  ref={(c) => {
                    this._carousel = c;
                  }}
                  data={this.state.availableDates}
                  renderItem={this._renderDateItems}
                  sliderWidth={360}
                  itemWidth={75}
                  autoplay={false}
                  slideStyle={{ marginRight: 10, marginBottom: 10 }}
                  inactiveSlideOpacity={1}
                  inactiveSlideScale={1}
                  activeSlideAlignment="start"
                  enableSnap={false}
                  scrollEnabled={true}
                  onSnapToItem={(index) =>
                    this.setState({ activeSlide_date: index })
                  }
                />
              </View>

              <View style={{ marginLeft: 5, marginBottom: 70, marginTop: 10 }}>
                <Text
                  style={[
                    styles.loginLabel,
                    { marginTop: 10, textAlign: "left" },
                  ]}
                >
                  Start Time
                </Text>
                <TouchableOpacity
                  style={{ flexDirection: "row", marginTop: 5 }}
                  onPress={() => this.selectTime("start")}
                >
                  <TextInput
                    ref={(input) => {
                      this.secondTextInput = input;
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Select a time"
                    value={this.state.startTime}
                    editable={false}
                    placeholderTextColor="#01313C"
                    style={{
                      marginTop: -5,
                      marginBottom: 10,
                      paddingLeft: 20,
                      width: "100%",
                      backgroundColor: "#fff",
                      borderColor: "#A3BCD5",
                      borderRadius: 2,
                      borderWidth: 1,
                      fontSize: 14,
                      fontFamily: fonts.semiBold,
                      color: "#01313C",
                      height: 55,
                    }}
                    // onChangeText={this.handleEmail}
                    // onBlur={this.handleEmailOnBlur}
                  />
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      position: "absolute",
                      right: 10,
                      top: 2,
                      resizeMode: "contain",
                    }}
                    source={clock}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.loginLabel,
                    { marginTop: 10, textAlign: "left" },
                  ]}
                >
                  End Time
                </Text>
                <TouchableOpacity
                  style={{ flexDirection: "row", marginTop: 5 }}
                  onPress={() =>
                    this.state.slotStartTime != ""
                      ? this.selectTime("end")
                      : Toast.show("Select Start Time to proceed")
                  }
                >
                  <TextInput
                    ref={(input) => {
                      this.secondTextInput = input;
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Select a time"
                    editable={false}
                    value={this.state.endTime}
                    placeholderTextColor="#01313C"
                    style={{
                      marginTop: -5,
                      marginBottom: 10,
                      paddingLeft: 20,
                      width: "100%",
                      color: "#01313C",
                      backgroundColor: "#fff",
                      borderColor: "#A3BCD5",
                      borderRadius: 2,
                      borderWidth: 1,
                      fontSize: 14,
                      fontFamily: fonts.semiBold,
                      height: 55,
                    }}
                    // onChangeText={this.handleEmail}
                    // onBlur={this.handleEmailOnBlur}
                  />
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      position: "absolute",
                      right: 10,
                      top: 2,
                      resizeMode: "contain",
                    }}
                    source={clock}
                  />
                </TouchableOpacity>
              </View>
              {/* <View style={{ padding:40}}>
                            <View style={{
                                color: "#04093F", flexDirection: 'row', textAlign: 'left', fontSize: 15,
                            }}>
                                <View style={[styles.loginCardView, { flexDirection: 'row' }]}>
                                    <Text style={[styles.loginLabel, ]}>Start Time</Text>
                                    <Text style={[styles.loginLabel, {marginLeft:-60}]}>End Time</Text>
                                </View>

                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10, }}>
                                <View style={{ width: '75%' }} >
                                    {this.state.showStartTime ? (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={this.state.startTime}
                                            mode={'time'}
                                            is24Hour={true}
                                            display="spinner"
                                            onChange={this.setStartDate}
                                        />
                                    ) : <Text style={{fontFamily:fonts.bold,color:colorCodes.primaryColor, fontSize:20}} onPress={() => this.setState({ showStartTime: true })}>{this.state.startTime.getHours() + ':' + this.state.startTime.getMinutes()}</Text>}
                                </View>

                                <View style={{marginLeft:5}}>
                                    {this.state.showStopTime ? (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={this.state.stopTime}
                                            mode={'time'}
                                            is24Hour={true}
                                            display="spinner"
                                            onChange={this.setStopDate}
                                        />
                                    ) : <Text style={{fontFamily:fonts.bold,color:colorCodes.primaryColor, fontSize:20}} onPress={() => this.setState({ showStopTime: true })} >{this.state.stopTime.getHours() + ':' + this.state.stopTime.getMinutes()}</Text>}
                                </View>
                            </View>
                            </View> */}
              {/* <View style={{ marginTop: 20 }}>
                                <View>
                                    <Button title="Show Date Picker" onPress={this.showDatePicker()} /> */}
              {/* <DateTimePickerModal
                                        isVisible={false}
                                        mode="time"
                                        // onConfirm={handleConfirm}
                                        // onCancel={hideDatePicker}
                                    /> */}
              {/* </View>

                                <Text style={[global.appName, { fontSize: 14, fontFamily: fonts.regular, paddingTop: 20 }]}>Amenities</Text>
                                <View style={styles.cuisineBlock}>
                                    <FlatList
                                        contentContainerStyle={{ paddingBottom: 100 }}
                                        horizontal={false}
                                        numColumns={3}
                                        // columnWrapperStyle={{ flex: 1, }}
                                        data={this.state.amenities}
                                        renderItem={(item) =>
                                            <TouchableOpacity style={[styles.cusineItem]}>
                                                <Text style={styles.cusineItemText}>{item.item.title}</Text>
                                            </TouchableOpacity>
                                        }
                                    />
                                    <View style={styles.separator}></View>
                                </View>
                            </View> */}
            </View>
          </ScrollView>
          <TouchableOpacity
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
            onPress={() => {
              this.continue();
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
                  CONTINUE
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
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
    fontFamily: fonts.semiBold,
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
    paddingBottom: 5,
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
});
