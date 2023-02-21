import * as React from "react";
import {
  View,
  useWindowDimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import QRCode from "react-native-qrcode-svg";
import ImageView from "react-native-image-viewing";
import Overlay from "react-native-modal-overlay";
import CommanServices from "../../utils/comman";
import colorCodes from "../../themes/colorCodes";
import { apiName } from "../../../Config";
import RestApi from "../../utils/restapii";
import global from "../../themes/global";
import fonts from "../../themes/fonts";
import { Base64 } from "js-base64";
import { h, w } from "../../theme/responsive";
var restApi = new RestApi();
var commanService = new CommanServices();
var logo = require("../../../assets/icon.png");
var close = require("../../../assets/imgs/close.png");
var resolve = require("../../../assets/imgs/resolve.png");
var loginImg = require("../../../assets/imgs/loginBg.png");
var star = require("../../../assets/imgs/star-outline.png");
var download = require("../../../assets/imgs/download.png");
var threeDots = require("../../../assets/imgs/threeDots.png");
var backbutton = require("../../../assets/imgs/backbutton.png");
var medal_blue = require("../../../assets/imgs/medal_blue.png");
var favouriteParkings = require("../../../assets/imgs/favouriteParkings.png");

const getUpcomingBooking = () => {
  var userId = "";
  global.setLoader(true);
  commanService.getData("userData").then((res) => {
    userId = Base64.decode(res["UserId"]);
    var req = {
      UserId: userId,
    };
    console.log("REQUEST:>>", req);

    restApi.setUrl(apiName["getUpcomingBooking"]);
    restApi.setReq(req);
    restApi.sendRequest(function (response) {
      console.log("getUpcomingBooking", response);
      if (response.respCode == 1) {
        var item = [];
        for (let i = 0; i < response.bookings.length; i++) {
          var d1 = new Date("Tue Jan 01 2021 00:00:00 GMT+0530 (IST)");
          d1.setMinutes(d1.getMinutes() + response.bookings[i].todate);
          var currDate = new Date();
          var endDate = d1;
          var timeInMins = (currDate - endDate) / 60000;
          console.log(currDate);
          console.log(endDate);
          console.log(timeInMins);
          console.log(response.bookings[i].todate);
          var d2 = new Date("Tue Jan 01 2021 00:00:00 GMT+0530 (IST)");
          var d3 = new Date("Tue Jan 01 2021 00:00:00 GMT+0530 (IST)");
          d2.setMinutes(d2.getMinutes() + response.bookings[i].fromdate);
          d3.setMinutes(d3.getMinutes() + response.bookings[i].todate);
          response.bookings[i]["displayFromDate"] = d2.toString();
          response.bookings[i]["displayToDate"] = d3.toString();
          item.push(response.bookings[i]);
        }
        // global.setLoader(false)
        global.setBookingDetails(item);
      } else {
        global.setLoader(false);
        commanService.createSimpleToast(
          "Something went wrong, Please try again later",
          "error"
        );
      }
    });
  });
  getCompletedBooking();
};

const upcomingItem = ({ item }) => {
  var name = item.facility?.name ? item.facility.name : "";
  var date = new Date(item.displayFromDate);
  var enddate = new Date(item.displayToDate);
  let mnth = "";
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  (mnth = monthNames[date.getMonth()]),
    (day = ("0" + date.getDate()).slice(-2));
  var booking_date = [day, mnth, date.getFullYear().toString().substr(-2)].join(
    " "
  );

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + "" + ampm;

  var hours = enddate.getHours();
  var minutes = enddate.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var endTime = hours + ":" + minutes + "" + ampm;
  console.log(endTime);
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => global.nav.navigation.navigate("Booking", { info: item })}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 1,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              color: colorCodes.textColor,
              fontFamily: fonts.semiBold,
              fontSize: 16,
              marginLeft: 5,
            }}
          >
            {item.facility.name}
          </Text>
          {item.bookingmode == 2 ? (
            <Image
              style={{ width: 12, height: 15, zIndex: 100, marginLeft: 3 }}
              source={medal_blue}
            />
          ) : null}
        </View>
        <UpcomingMenu item={item} />
      </View>
      <View style={{ marginBottom: 5 }}>
        <Text
          style={{
            fontFamily: "Segoe_UI_Regular",
            fontSize: 10,
            color: "#373737",
            margin: 5,
          }}
        >
          {booking_date + ", " + strTime + " - " + endTime}
        </Text>
        {/* <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: '#01313C', paddingTop: 5 }}>{'₹50.00'}</Text> */}
        {item.bookingstatus ? (
          item.checkinflag ? (
            item.checkoutflag ? (
              item.paymentstatus ? (
                <View style={{ flexDirection: "row", marginLeft: 5 }}>
                  {/* <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: '#01313C', paddingTop: 5 }}>{'₹' + amountpayable}</Text> */}
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        fontSize: 14,
                        color: "#01313C",
                      }}
                    >
                      Booking Status:{" "}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: 14,
                        color: "#01313C",
                        paddingTop: 3,
                      }}
                    >
                      Completed
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles._buttons}
                    onPress={() =>
                      global.nav.navigation.navigate("PaymentSummary", {
                        paymentData: item,
                      })
                    }
                  >
                    <Text
                      style={{
                        padding: 10,
                        fontFamily: fonts.semiBold,
                        fontSize: 12,
                        color: colorCodes.textColor,
                      }}
                    >
                      {"Payment"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles._buttons}
                  onPress={() => getQr(item)}
                >
                  <Text
                    style={{
                      padding: 10,
                      fontFamily: fonts.semiBold,
                      fontSize: 12,
                      color: colorCodes.textColor,
                    }}
                  >
                    Get QR
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles._buttons, { opacity: 0.5 }]}>
                  <Text
                    style={{
                      padding: 10,
                      fontFamily: fonts.semiBold,
                      fontSize: 12,
                      color: colorCodes.textColor,
                    }}
                  >
                    {"Payment"}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles._buttons}
                onPress={() => editRebook(item, "modify")}
              >
                <Text
                  style={{
                    padding: 10,
                    fontFamily: fonts.semiBold,
                    fontSize: 12,
                    color: colorCodes.textColor,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles._buttons}
                onPress={() => getQr(item)}
              >
                <Text
                  style={{
                    padding: 10,
                    fontFamily: fonts.semiBold,
                    fontSize: 12,
                    color: colorCodes.textColor,
                  }}
                >
                  Get QR
                </Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <View style={{ flexDirection: "row", marginLeft: 5 }}>
            {/* <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 14,
                  color: '#01313C',
                }}>
                Booking Status:{' '}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  color: '#01313C',
                  paddingTop: 3,
                }}>
                Cancelled{' '}
              </Text>
            </View> */}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const UpcomingMenu = ({ item }) => (
  <TouchableOpacity style={{ position: "absolute", right: 5, marginTop: 7 }}>
    <Menu>
      <MenuTrigger>
        <Image
          style={{ width: 20, height: 20, resizeMode: "contain" }}
          resizeMode="contain"
          source={threeDots}
        ></Image>
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={() => markFavourite(item)}>
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
                  height: h(3),
                  fontFamily: fonts.regular,
                  paddingLeft: 5,
                  color: colorCodes.textColor,
                  marginTop: 2,
                }}
              >
                Mark Favourite
              </Text>
            </View>
          </View>
        </MenuOption>
        {item.bookingstatus ? (
          item.bookingstatus && !item.paymentstatus ? (
            <View>
              <MenuOption onSelect={() => addFeebBack(item)}>
                <View
                  style={{
                    padding: 10,
                    fontFamily: fonts.regular,
                    borderBottomWidth: 0.5,
                    borderColor: "#00000029",
                  }}
                  onPress={() => this.addFeebBack(item)}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={resolve}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: "contain",
                        zIndex: 300,
                      }}
                    />
                    <Text
                      style={{
                        height: h(3),
                        fontFamily: fonts.regular,
                        paddingLeft: 5,
                        color: colorCodes.textColor,
                        marginTop: 2,
                      }}
                    >
                      Resolve Dispute
                    </Text>
                  </View>
                </View>
              </MenuOption>
              {!item.checkinflag ? (
                <MenuOption onSelect={() => cancelBooking(item)}>
                  <View
                    style={{
                      padding: 10,
                      fontFamily: fonts.regular,
                      borderBottomWidth: 0.5,
                      borderColor: "#00000029",
                    }}
                    onPress={() => cancelBooking(item)}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={close}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: "contain",
                          zIndex: 300,
                        }}
                      />
                      <Text
                        style={{
                          height: h(3),
                          fontFamily: fonts.regular,
                          paddingLeft: 5,
                          color: colorCodes.textColor,
                          marginTop: 2,
                        }}
                      >
                        Cancel Booking
                      </Text>
                    </View>
                  </View>
                </MenuOption>
              ) : null}
            </View>
          ) : null
        ) : null}
      </MenuOptions>
    </Menu>
  </TouchableOpacity>
);

const upcomingRoute = (bookingDetails) =>
  bookingDetails.length > 0 ? (
    <FlatList
      data={bookingDetails}
      renderItem={upcomingItem}
      style={{ marginTop: 10 }}
      keyExtractor={(item) => item.id}
    />
  ) : (
    <View>
      <Text style={styles.nobookingsText}>No Upcoming Bookings</Text>
      <View style={styles.imageView}>
        <Image
          style={{ width: 300, height: 300, resizeMode: "cover" }}
          source={loginImg}
        />
      </View>
      <Text style={styles.explorParkingText}>Explore Parkings Near You</Text>
      <View style={{ width: "100%", alignItems: "center", marginTop: 15 }}>
        <TouchableOpacity
          style={styles.explorBtn}
          onPress={() => global.nav.navigation.navigate("Dashboard")}
        >
          <Text style={styles.explorText}>EXPLORE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

const getCompletedBooking = () => {
  var userId = "";
  global.setLoader(true);
  commanService.getData("userData").then((res) => {
    userId = Base64.decode(res["UserId"]);
    var req = {
      UserId: userId,
    };
    console.log("REQUEST:>>", req);
    restApi.setUrl(apiName["bookingHistory"]);
    restApi.setReq(req);
    restApi.sendRequest(function (response) {
      console.log("getCompletedBooking", response);
      if (response.respCode == 1) {
        var item = [];
        for (let i = 0; i < response.bookings.length; i++) {
          var d1 = new Date("Tue Jan 01 2021 00:00:00 GMT+0530 (IST)");
          d1.setMinutes(d1.getMinutes() + response.bookings[i].todate);
          var currDate = new Date();
          var endDate = d1;
          var timeInMins = (currDate - endDate) / 60000;
          console.log(currDate);
          console.log(endDate);
          console.log(timeInMins);
          console.log(response.bookings[i].todate);
          var d2 = new Date("Tue Jan 01 2021 00:00:00 GMT+0530 (IST)");
          var d3 = new Date("Tue Jan 01 2021 00:00:00 GMT+0530 (IST)");
          d2.setMinutes(d2.getMinutes() + response.bookings[i].fromdate);
          d3.setMinutes(d3.getMinutes() + response.bookings[i].todate);
          response.bookings[i]["displayFromDate"] = d2.toString();
          response.bookings[i]["displayToDate"] = d3.toString();
          item.push(response.bookings[i]);
        }
        global.setCompletedBookings(item);
        global.setLoader(false);
      } else {
        global.setLoader(false);
        commanService.createSimpleToast(
          "Something went wrong in fetching past booking, Please try again later",
          "error"
        );
      }
    });
  });
};

const completedItem = ({ item }) => {
  var name = item.facility?.name ? item.facility.name : "";
  var date = new Date(item.displayFromDate);
  var enddate = new Date(item.displayToDate);
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  (mnth = monthNames[date.getMonth()]),
    (day = ("0" + date.getDate()).slice(-2));
  var booking_date = [day, mnth, date.getFullYear().toString().substr(-2)].join(
    " "
  );

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + "" + ampm;

  var hours = enddate.getHours();
  var minutes = enddate.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var endTime = hours + ":" + minutes + "" + ampm;
  console.log(endTime);
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => global.nav.navigation.navigate("Booking", { info: item })}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 1,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              color: colorCodes.textColor,
              fontFamily: fonts.semiBold,
              fontSize: 16,
              marginLeft: 5,
            }}
          >
            {item.facility.name}
          </Text>
          {item.bookingmode == 2 ? (
            <Image
              style={{ width: 12, height: 15, zIndex: 100, marginLeft: 3 }}
              source={medal_blue}
            />
          ) : null}
        </View>
        <CompletedMenu item={item} />
      </View>
      <View style={{ marginBottom: 5 }}>
        <Text
          style={{
            fontFamily: "Segoe_UI_Regular",
            fontSize: 10,
            color: "#373737",
            margin: 5,
          }}
        >
          {booking_date + ", " + strTime + " - " + endTime}
        </Text>
        {/* <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: '#01313C',}}>{'₹50.00'}</Text> */}
        {item.bookingstatus ? (
          item.checkinflag ? (
            item.checkoutflag ? (
              item.paymentstatus ? (
                <View style={{ flexDirection: "row", marginLeft: 5 }}>
                  {/* <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: '#01313C', paddingTop: 5 }}>{'₹' + amountpayable}</Text> */}
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        fontSize: 14,
                        color: "#01313C",
                      }}
                    >
                      Booking Status:{" "}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: 14,
                        color: "#01313C",
                        paddingTop: 3,
                      }}
                    >
                      Completed
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles._buttons}
                    onPress={() =>
                      global.nav.navigation.navigate("PaymentSummary", {
                        paymentData: item,
                      })
                    }
                  >
                    <Text
                      style={{
                        padding: 10,
                        fontFamily: fonts.semiBold,
                        fontSize: 12,
                        color: colorCodes.textColor,
                      }}
                    >
                      {"Payment"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles._buttons}
                  onPress={() => getQr(item)}
                >
                  <Text
                    style={{
                      padding: 10,
                      fontFamily: fonts.semiBold,
                      fontSize: 12,
                      color: colorCodes.textColor,
                    }}
                  >
                    Get QR
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles._buttons, { opacity: 0.5 }]}>
                  <Text
                    style={{
                      padding: 10,
                      fontFamily: fonts.semiBold,
                      fontSize: 12,
                      color: colorCodes.textColor,
                    }}
                  >
                    {"Payment"}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles._buttons}
                onPress={() => editRebook(item, "modify")}
              >
                <Text
                  style={{
                    padding: 10,
                    fontFamily: fonts.semiBold,
                    fontSize: 12,
                    color: colorCodes.textColor,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles._buttons}
                onPress={() => getQr(item)}
              >
                <Text
                  style={{
                    padding: 10,
                    fontFamily: fonts.semiBold,
                    fontSize: 12,
                    color: colorCodes.textColor,
                  }}
                >
                  Get QR
                </Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <View style={{ flexDirection: "row", marginLeft: 5 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 14,
                  color: "#01313C",
                }}
              >
                Booking Status:{" "}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  color: "#01313C",
                  paddingTop: 3,
                }}
              >
                Cancelled{" "}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const CompletedMenu = ({ item }) => (
  <TouchableOpacity style={{ position: "absolute", right: 5, marginTop: 7 }}>
    <Menu>
      <MenuTrigger>
        <Image
          style={{ width: 20, height: 20, resizeMode: "contain" }}
          resizeMode="contain"
          source={threeDots}
        ></Image>
      </MenuTrigger>
      <MenuOptions>
        {item.paymentstatus ? (
          <MenuOption onSelect={() => downloadInvoice(item)}>
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
                  source={download}
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
                  View Invoice
                </Text>
              </View>
            </View>
          </MenuOption>
        ) : null}

        <MenuOption onSelect={() => editRebook(item, "reebook")}>
          <View
            style={{
              padding: 10,
              fontFamily: fonts.regular,
              borderBottomWidth: 0.5,
              borderColor: "#00000029",
            }}
            onPress={() => editRebook(item, "reebook")}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={resolve}
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
                Rebook
              </Text>
            </View>
          </View>
        </MenuOption>
        <MenuOption onSelect={() => markFavourite(item)}>
          <View
            style={{
              padding: 10,
              fontFamily: fonts.regular,
              borderBottomWidth: 0.5,
              borderColor: "#00000029",
            }}
            onPress={() => markFavourite(item)}
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
                Mark Favourite
              </Text>
            </View>
          </View>
        </MenuOption>

        <MenuOption onSelect={() => rateParking(item)}>
          <View
            style={{
              padding: 10,
              fontFamily: fonts.regular,
              borderBottomWidth: 0.5,
              borderColor: "#00000029",
            }}
            onPress={() => rateParking(item)}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={star}
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
                Rate Parking*
              </Text>
            </View>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  </TouchableOpacity>
);

const completedRoute = (completedBookings) =>
  completedBookings.length > 0 ? (
    <FlatList
      data={completedBookings}
      renderItem={completedItem}
      style={{ marginTop: 10 }}
      keyExtractor={(item) => item.id}
    />
  ) : (
    <View>
      <Text style={styles.nobookingsText}>No Completed Bookings</Text>
      <View style={styles.imageView}>
        <Image
          style={{ width: 300, height: 300, resizeMode: "cover" }}
          source={loginImg}
        />
      </View>
      <Text style={styles.explorParkingText}>Explore Parkings Near You</Text>
      <View style={{ width: "100%", alignItems: "center", marginTop: 15 }}>
        <TouchableOpacity
          style={styles.explorBtn}
          onPress={() => global.nav.navigation.navigate("Dashboard")}
        >
          <Text style={styles.explorText}>EXPLORE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

const editRebook = (item, type) => {
  if (type == "modify") {
    global.nav.navigation.navigate("BookingDetails", {
      data: item.facility,
      isModify: "yes",
      bookingID: item.bookingid,
    });
  } else {
    global.nav.navigation.navigate("ParkingDetails", { data: item.facility });
  }
};

const getQr = (item) => {
  console.log("item", item);
  global.setQrCode(item.bookingid);
  global.setShowQr(true);
  // var userId = '';
  // global.setLoader(true);
  // commanService.getData('userData').then((res) => {
  //   userId = Base64.decode(res['UserId']);
  //   var req = {
  //     userId: userId,
  //     bookingid: item.bookingid,
  //   };
  //   console.log('REQUEST:>>', req);
  //   restApi.setUrl(apiName['getQRCode']);
  //   restApi.setReq(req);
  //   restApi.sendRequest(function (response) {
  //     if (response.respCode == 1) {
  //       global.setLoader(false);
  //       global.setQrCode(response.code);
  //       global.setShowQr(true);
  //     } else {
  //       global.setLoader(false);
  //       commanService.createSimpleToast(
  //         'Something went wrong, Please try again later',
  //         'error',
  //       );
  //     }
  //   });
  // });
};

const markFavourite = (item) => {
  var userId = "";
  global.setLoader(true);
  commanService.getData("userData").then((res) => {
    userId = Base64.decode(res["UserId"]);
    var req = {
      userid: userId,
      facilityid: item.facility.facilityid,
      flag: true,
    };
    restApi.setUrl(apiName["setFavourite"]);
    restApi.setReq(req);
    restApi.sendRequest(function (response) {
      console.log(response);
      if (response.respCode == 1) {
        commanService.createSimpleToast(
          item.facility.name + " is added to favourite.",
          "success"
        );
        global.setLoader(false);
      } else {
        global.setLoader(false);
        commanService.createSimpleToast(
          "Something went wrong, Please try again later",
          "error"
        );
      }
    });
  });
};

const cancelBooking = (item) => {
  Alert.alert(
    "Please Confirm!",
    "Do you really want to cancel this booking at " + item.facility.name + "?",
    [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          var userId = "";
          global.setLoader(true);
          commanService.getData("userData").then((res) => {
            var _this = this;
            userId = Base64.decode(res["UserId"]);
            var req = {
              userid: userId,
              bookingid: item.bookingid,
            };
            console.log("REQUEST:>>", req);
            restApi.setUrl(apiName["cancelBooking"]);
            restApi.setReq(req);
            restApi.sendRequest(function (response) {
              console.log(response);
              if (response.respCode == 1) {
                global.setLoader(false);
                getUpcomingBooking();
                //   _this.getPastBookings();

                commanService.createSimpleToast(
                  "Booking at " + item.facility.name + " is cancelled.",
                  "success"
                );
              } else {
                global.setLoader(false);
                commanService.createSimpleToast(
                  "Something went wrong, Please try again later",
                  "error"
                );
              }
            });
          });
        },
      },
    ],
    { cancelable: false }
  );
};

const addFeebBack = (item) => {
  global.nav.navigation.navigate("Help");
};

const downloadInvoice = (item) => {
  console.log(item);
  var time = new Date(item.checkintime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  var checkoutDate = new Date(item.checkouttime).toLocaleDateString([], {
    dateStyle: "short",
  });
  var checkouttime = new Date(item.checkouttime).toLocaleTimeString([], {
    dateStyle: "full",
    timeStyle: "short",
  });
  if (item.currency != null) {
    var amt = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: item.currency,
    }).format(item.amountpayable / 100);
    global.setamountpayable(amt);
  }
  global.setmodalData(item);
  global.setShowModal(true);
  global.setcheckoutTime(checkouttime);
  global.setcheckoutDate(checkoutDate);

  // global.nav.navigation.navigate("Thankyou", { paymentData: item })
};

const closeModal = () => {
  global.setmodalData({});
  global.setShowModal(false);
};

const rateParking = (item) => {
  commanService.createSimpleToast("Coming Soon");
};

export default MyBooking = (navigate) => {
  global.nav = navigate;
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "upcoming", title: "Upcoming" },
    { key: "completed", title: "Completed" },
  ]);
  const [showLoader, setLoader] = React.useState(false);
  const [bookingDetails, setBookingDetails] = React.useState([]);
  const [completedBookings, setCompletedBookings] = React.useState([]);
  const [qrCode, setQrCode] = React.useState("");
  const [showQr, setShowQr] = React.useState(false);
  const [modalData, setmodalData] = React.useState({});
  const [showModal, setShowModal] = React.useState(false);
  const [amountpayable, setamountpayable] = React.useState(0);
  const [checkoutTime, setcheckoutTime] = React.useState("");
  const [checkoutDate, setcheckoutDate] = React.useState("");

  const renderScene = SceneMap({
    upcoming: () => upcomingRoute(bookingDetails),
    completed: () => completedRoute(completedBookings),
  });
  global.setLoader = setLoader;
  global.setBookingDetails = setBookingDetails;
  global.setCompletedBookings = setCompletedBookings;
  global.setQrCode = setQrCode;
  global.setShowQr = setShowQr;
  global.setmodalData = setmodalData;
  global.setShowModal = setShowModal;
  global.setamountpayable = setamountpayable;
  global.setcheckoutTime = setcheckoutTime;
  global.setcheckoutDate = setcheckoutDate;
  React.useEffect(() => {
    getUpcomingBooking();
  }, []);
  console.log("qrCode", qrCode);
  return (
    <View style={{ flex: 1 }}>
      {showLoader ? (
        <View style={global.loaderStyle}>
          <ActivityIndicator size="large" color={colorCodes.primaryColor} />
        </View>
      ) : null}

      {showQr ? (
        <View style={styles.qrCodeOverlay}>
          <View
            style={{
              width: "100%",
              height: h(10),
              justifyContent: "center",
              alignItems: "flex-end",
              paddingRight: 10,
              position: "absolute",
              top: 5,
              marginRight: w(10),
            }}
          >
            <Text
              onPress={() => {
                setShowQr(false);
              }}
              style={{ color: "#FFFFFF", fontSize: 25 }}
            >
              X
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              height: h(50),
              width: w(100),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <QRCode
              value={qrCode}
              logo={{ uri: "data:image/png;base64," + qrCode }}
              logoSize={w(90)}
              size={w(90)}
              logoBackgroundColor="transparent"
            />
          </View>
        </View>
      ) : null}

      <Overlay
        visible={showModal}
        closeOnTouchOutside
        animationType={"bounceIn"}
        childrenWrapperStyle={{ borderWidth: 1, borderRadius: 5 }}
      >
        <View>
          <View style={{ flexDirection: "row" }}>
            <Image style={{ width: 40, height: 40 }} source={logo} />
            {/* <Text style={{ fontFamily: fonts.bold, color: colorCodes.textColor, fontSize: 16, textAlign: 'center' }}>Thank You!</Text> */}
            <TouchableOpacity
              style={{ position: "absolute", right: 0, top: -5 }}
              onPress={() => closeModal()}
            >
              <Image style={{ width: 30, height: 30 }} source={close} />
            </TouchableOpacity>
          </View>
          {/* <ScrollView style={{height: 20}}> */}
          <Text
            style={{
              fontFamily: fonts.bold,
              color: colorCodes.textColor,
              fontSize: 16,
              marginTop: 10,
            }}
          >
            Thank you for your payment
          </Text>
          <Text style={[styles.tcPara, { marginTop: 10 }]}>Dear Customer,</Text>
          <Text style={styles.tcPara}>
            Details of your booking are given below:
          </Text>
          <Text style={styles.tcPara}> </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.tcHeading}>Booking Id: </Text>
            <Text style={styles.tcPara}>{modalData.bookingid}</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              marginTop: 10,
              marginBottom: 10,
              borderColor: "#ddd",
              opacity: 0.5,
            }}
          ></View>
          {/* 
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.tcHeading}>Booking Mode: </Text>
            <Text style={styles.tcPara}>
              {modalData.bookingmode == 2 ? 'Guest Booking' : 'Normal Booking'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.tcHeading}>Booking Status: </Text>
            <Text style={styles.tcPara}>
              {modalData.bookingstatus ? 'Completed' : 'Cancelled'}
            </Text>
          </View> */}

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.tcHeading}>Check out date:</Text>
            <Text style={styles.tcPara}>{checkoutDate}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.tcHeading}>Check out time:</Text>
            <Text style={styles.tcPara}>{checkoutTime}</Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              marginTop: 10,
              marginBottom: 10,
              borderColor: "#ddd",
              opacity: 0.5,
            }}
          ></View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.tcHeading}>Payment Mode: </Text>
            <Text style={styles.tcPara}>
              {modalData.paymentmode ? "UPI" : "Cash"}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.tcHeading}>Payment Status: </Text>
            <Text style={styles.tcPara}>
              {modalData.paymentstatus ? "Success" : "Failed"}
            </Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              marginTop: 10,
              marginBottom: 10,
              borderColor: "#ddd",
              opacity: 0.5,
            }}
          ></View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.tcHeading}>Total Amount: </Text>
            <Text style={styles.tcPara}>{amountpayable}</Text>
          </View>

          {/* <Text style={styles.tcHeading}>Parking Location: XYKBNs</Text>
            <Text style={styles.tcPara}> </Text> */}
          {/* <Text style={styles.tcHeading}>Parking Time: {this.state.modalData.time}</Text>
              <Text style={styles.tcPara}> </Text> */}
        </View>
      </Overlay>
      <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: "white" }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerTitleWrapper}
            onPress={() => navigate.navigation.navigate("Dashboard")}
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigate.navigation.navigate("Dashboard")}
            >
              <Image
                onPress={() => this.select(index, item)}
                style={{ width: 25, height: 25, position: "absolute" }}
                source={backbutton}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerTitleText,
                { zIndex: 100, marginTop: 7, color: "#01313C" },
              ]}
            >
              {"Bookings"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginLeft: 5, marginRight: 5 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                style={{ backgroundColor: "#FFF", color: "red" }}
                indicatorStyle={{ backgroundColor: "#770EC1", height: 3.5 }}
                renderLabel={({ route, color }) => (
                  <Text
                    style={{
                      color: "#770EC1",
                      fontSize: 14,
                      fontFamily: fonts.semiBold,
                    }}
                  >
                    {route.title}
                  </Text>
                )}
              />
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colorCodes.colorWhite,
    padding: 5,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colorCodes.colorWhite,
    marginLeft: 46,
  },
  backBtn: {
    position: "absolute",
    top: 3,
    left: 3,
    backgroundColor: "red",
    zIndex: 100,
  },
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.9,
    borderColor: "#00000029",
    borderRadius: 10,
    padding: 7,
    marginVertical: 5,
    paddingLeft: 20,
  },
  _buttons: {
    width: w(20),
    flexDirection: "row",
    borderWidth: 1,
    shadowColor: "#00000057",
    borderColor: "#A3BCD5",
    borderRadius: 5,
    height: h(5),
    backgroundColor: "#D8F6F2",
    marginRight: 10,
    justifyContent: "center",
    marginTop: 5,
    alignItems: "center",
    alignContent: "center",
  },
  imageView: {
    width: 300,
    height: 295,
    marginTop: -150,
    paddingLeft: 0,
    paddingRight: 30,
  },
  nobookingsText: {
    width: "100%",
    marginTop: 25,
    marginBottom: 25,
    textAlign: "center",
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colorCodes.primaryColor,
  },
  explorParkingText: {
    width: "100%",
    marginTop: 25,
    textAlign: "center",
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colorCodes.textColor,
  },
  explorBtn: {
    borderWidth: 1,
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
  },
  explorText: {
    padding: 10,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colorCodes.textColor,
    marginTop: -3,
  },
  tcHeading: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colorCodes.textColor,
  },
  tcPara: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colorCodes.textColor,
    marginTop: 2,
  },
  qrCodeOverlay: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    alignContent: "center",
    backgroundColor: "#000000",
    width: w(100),
    height: "100%",
    position: "absolute",
    zIndex: 2,
  },
});
