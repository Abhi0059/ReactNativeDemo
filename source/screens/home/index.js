import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert,
  Linking,
  Platform,
} from "react-native";
import Banner from "../../components/Banner";
import NavigationServices from "../../utils/NavigationService";
import MapComponent from "../../components/MapComponent";
import ParkingCard from "../../components/ParkingCard";
import fonts from "../../themes/fonts";
import colorCodes from "../../themes/colorCodes";
var search = require("../../../assets/imgs/search.png");
import GetLocation from "react-native-get-location";
import moment from "moment";
//import Geolocation from '@react-native-community/geolocation';
import { Base64 } from "js-base64";
import {
  checkForGps,
  createSimpleToast,
  getUserData,
} from "../../utils/CommanServices";
import { httpCall } from "../../utils/RestApi";
import { apiName } from "../../../Config";
import Loader from "../../components/Loader";
import remoteConfig from "@react-native-firebase/remote-config";
import DeviceInfo from "react-native-device-info";
import { f, h } from "../../theme/responsive";

// const firebaseConfig = {
//   messagingSenderId: "964406149632",
//   projectId: "eazypark-67b1a",
//   appId: "1:964406149632:android:08a55a0432813f65438ee5",
// };
// const config = {
//   name: "EazyPark",
// };

// PushNotification.getChannels((ch) => {
//   console.log("chhh", ch);
// });

// if (Firebase.app.length === false) {
//   console.log("!Firebase.app.length", !Firebase.app.length);
//   Firebase.initializeApp(firebaseConfig, config);
// } else {
//   Firebase.app();
// }

// PushNotification.createChannel(
//   {
//     channelId: "eazypark",
//     channelName: "EazyPark",
//     channelDescription: "EazyPark for parking",
//     soundName: "default",
//     importance: Importance.HIGH,
//     vibrate: true,
//   },
//   (created) => {}
// );

// fcmService.registerAppWithFCM();
// fcmService.register(onRegister, onNotification, onOpenNotification);
// localNotificationService.configure(onOpenNotification);

// function onRegister(token) {
//   console.log("[App] Token", token);
//   // setUserDataInAsyncStorage('deviceToken', token, true);
// }

// async function onNotification(notification) {
//   console.log("on notification in index", notification);

//   // const {data, id} = notification;
//   // const {route, message, priority, actionId, notificationstatus} = data;
//   // let notificationData = {...data};
//   // const title = JSON.parse(message);
//   // const options = {
//   //   soundName: 'default',
//   //   sound: true,
//   // };

//   // const notificationMessage = title?.[userLanguage] || title.en;
//   // localNotificationService.showNotification(
//   //   1,
//   //   '',
//   //   notificationMessage,
//   //   notificationData,
//   //   options,
//   // );
// }

// function onOpenNotification(notification, check) {
//   const { data } = notification;
//   const { message } = data;
//   console.log("onOpenNotification", notification);
//   console.log(
//     "asdfasfasa",
//     notification.userInteraction,
//     " ",
//     Platform.OS,
//     " ",
//     message
//   );
//   if (message && Platform.OS === "android" && notification.userInteraction) {
//     console.log("CheckIn");
//     setTimeout(() => {
//       NavigationServices.navigate("Booking", { info: { bookingid: message } });
//     }, 3000);
//   }
//   // if (
//   //   route &&
//   //   ((Platform.OS === 'android' && notification.userInteraction) ||
//   //     (Platform.OS === 'ios' && notification.userInteraction) ||
//   //     (Platform.OS === 'ios' && !check))
//   // ) {
//   //   const prevNotifications = store.getState().notifications.notifications;
//   //   const checkIsExist = prevNotifications.find((data, index) => {
//   //     const isDateEqual = moment(data.created_at).isSame(created_at);
//   //     return isDateEqual ? data.id : false;
//   //   });
//   //   if (checkIsExist?.id) {
//   //     sQLiteDatabase.updateData(checkIsExist?.id);
//   //   }
//   //   setTimeout(() => {
//   //     NavigationService.navigate(route, {id: actionId});
//   //   }, 3000);
//   // }
// }

const Home = (props) => {
  const [parkingData, setparkingData] = useState([]);
  const [upcomingData, setUpcomingData] = useState([]);
  const [myCordinates, setmyCordinates] = useState({
    latitude: 19.280527,
    longitude: 72.8824317,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  });
  const [countryCordinates, setmcountryCordinates] = useState({
    latitude: 19.280527,
    longitude: 72.8824317,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  });
  const [origin, setorigin] = useState({});
  const [parkingTrue, setParkingTrue] = useState(false);
  const [showLoader, setLoader] = useState(false);
  const [markers, setmarkers] = useState([]);
  const [name, setname] = useState("Welcome to EazyPark™");

  useEffect(() => {
    console.log("Dashboard");
    setTimeout(() => {
      checkForGps();
    }, 3500);
  }, []);

  useEffect(() => {
    console.log("first");
    //getInitialNotification();
    //  onNotificationListener();
    // onNotificationOpenedListener();
    getUserData("userData").then((res) => {
      console.log("res", res);
      setname(res["name"]);
      if (
        res["latitude"] != null &&
        res["latitude"] != undefined &&
        res["longitude"] != null &&
        res["longitude"] != undefined
      ) {
        setmyCordinates({
          latitude: +res["latitude"],
          longitude: +res["longitude"],
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setmcountryCordinates({
          latitude: +res["latitude"],
          longitude: +res["longitude"],
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setorigin({ latitude: +res["latitude"], longitude: +res["longitude"] });

        findParkings(+res["latitude"], +res["longitude"]);
      } else {
        getCurrentLocation();
      }

      props.navigation.addListener("focus", () => {
        //  upComingParkings();
      });
      // upComingParkings();
    });
    setTimeout(() => {
      remoteConfig().fetch(1);
      remoteConfig()
        .setDefaults({ android_version: "0.0.1" })
        .then(() => remoteConfig().fetchAndActivate())
        .then((fetchedRemotely) => {
          const awesomeNewFeature = remoteConfig().getValue("android_version");
          // DeviceInfo.getVersion() // Latest Version
          console.log(awesomeNewFeature._value); // App Version

          if (
            isVersionLess(DeviceInfo.getVersion(), awesomeNewFeature._value)
          ) {
            // alert("bhai update kar le")
            Alert.alert(
              "New Update Available " + awesomeNewFeature._value,
              "Please update the app",
              [
                {
                  text: "Update",
                  onPress: () =>
                    Linking.openURL(
                      "https://play.google.com/store/apps/details?id=com.incubermax.eazypark"
                    ),
                },
              ]
            );
          }
        });
    }, 1500);
  }, []);

  const isVersionLess = (currVersion, latestVersion) => {
    var currVerArr = currVersion.split(".");
    var latestVerArr = latestVersion.split(".");
    if (+currVerArr[0] < +latestVerArr[0]) {
      return true;
    } else {
      if (+currVerArr[0] > +latestVerArr[0]) {
        return false;
      } else {
        if (+currVerArr[1] < +latestVerArr[1]) {
          return true;
        } else {
          if (+currVerArr[1] > +latestVerArr[1]) {
            return false;
          } else {
            if (+currVerArr[2] < +latestVerArr[2]) {
              return true;
            } else {
              if (+currVerArr[2] > +latestVerArr[2]) {
                return false;
              } else {
                return false;
              }
            }
          }
        }
      }
    }
  };
  // getInitialNotification = async () => {
  //   //get the initial token (triggered when app opens from a closed state)
  //   const notification = await notifications.getInitialNotification();
  //   console.log('getInitialNotification', notification);
  //   return notification;
  // };

  // onNotificationOpenedListener = () => {
  //   //remember to remove the listener on un mount
  //   //this gets triggered when the application is in the background
  //   notifications.onNotificationOpened((notification) => {
  //     console.log('onNotificationOpened', notification);
  //     //do something with the notification
  //   });
  // };

  // onNotificationListener = () => {
  //   //remember to remove the listener on un mount
  //   //this gets triggered when the application is in the forground/runnning
  //   //for android make sure you manifest is setup - else this wont work
  //   //Android will not have any info set on the notification properties (title, subtitle, etc..), but _data will still contain information
  //   notifications.onNotification((notification) => {
  //     //do something with the notification
  //     console.log(
  //       'notificationnotificationnotificationnotification',
  //       notification,
  //     );
  //     console.log('onNotification', notification);
  //     // localNotification(notification);
  //     // if (notification._body == 'Dear User, Your Check In is successful') {
  //     //   props.navigation.navigate('CheckIn', {data: notification});
  //     // } else {
  //     //   getUserData('userData').then((res) => {
  //     //     props.navigation.navigate('PaymentSummary', {
  //     //       paymentData: res['checkoutData'],
  //     //     });
  //     //   });
  //     // }
  //   });
  // };

  // onTokenRefreshListener = () => {
  //   //remember to remove the listener on un mount
  //   //this gets triggered when a new token is generated for the user
  //   this.removeonTokenRefresh = messages.onTokenRefresh((token) => {
  //     //do something with the new token
  //   });
  // };
  // setBadge = async (number) => {
  //   //only works on iOS and some Android Devices
  //   return await notifications.setBadge(number);
  // };

  // getBadge = async () => {
  //   //only works on iOS and some Android Devices
  //   return await notifications.getBadge();
  // };

  // hasPermission = async () => {
  //   //only works on iOS
  //   return await notifications.hasPermission();
  //   //or     return await messages.hasPermission()
  // };

  // requestPermission = async () => {
  //   //only works on iOS
  //   return await notifications.requestPermission();
  //   //or     return await messages.requestPermission()
  // };

  // const localNotification = async (notification) => {
  //   //required for Android
  //   const channel = new Android.Channel(
  //     'test-channel',
  //     'Test Channel',
  //     Android.Importance.Max,
  //   ).setDescription('My apps test channel');

  //   // for android create the channel
  //   notifications.android().createChannel(channel);
  //   await notifications.displayNotification(
  //     new NotificationMessage()
  //       .setNotificationId(notification._notificationId)
  //       .setTitle(notification._title)
  //       .setBody(notification._data.message)
  //       .setData({
  //         key1: 'key1',
  //         key2: 'key2',
  //       })
  //       .android.setChannelId('test-channel'), //required for android
  //   );
  // };

  const getCurrentLocation = () => {
    console.log("getCurrentLocation called");
    GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 })
      .then((location) => {
        console.log("locationsss", location);
        setmyCordinates({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setmcountryCordinates({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setorigin({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        // this.mapView.animateToRegion(this.state.myCordinates, 2000); //MAP VIEW
        findParkings(location.latitude, location.longitude);
        // commanService.getData("userData").then(res => {
        //     var a = res
        //     a["latitude"] = location.latitude
        //     a["longitude"] = location.longitude
        //     commanService.storeData("userData", a);
        //     if (a['isFetchAddress'] == 'no') {
        //         this.getMyAddress(location.latitude, location.longitude)
        //     }
        // })
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
        console.log("Message", message);
        // createSimpleToast("Unable to fetch current location. Trying again", 'failed');
        //getCurrentLocation();

        //checkGps
      });
  };

  const findParkings = (lat, long) => {
    console.log("findParkings called");
    //setLoader(true);
    getUserData("userData").then((res) => {
      var userId = Base64.decode(res["UserId"]);
      var req = { userid: userId, latitude: lat, longitude: long };

      httpCall(apiName["findLocation"], req).then(
        (response) => {
          console.log("findLocation", response);
          if (response.respCode == 1) {
            setLoader(false);
            var data = response.loc;
            var parkingInfo = [];
            for (let i = 0; i < data.length; i++) {
              var item = {};
              item = {
                id: data[i].facilityId,
                title:
                  data[i].name + " " + data[i].address + " " + data[i].city,
                coordinates: {
                  latitude: data[i].location.coordinates.values[1],
                  longitude: data[i].location.coordinates.values[0],
                },
              };
              parkingInfo.push(item);
              setparkingData(data);
              setParkingTrue(false);
              setmarkers(parkingInfo);
            }
          } else {
            setLoader(false);
            setParkingTrue(true);
          }
        },
        (error) => {
          setLoader(false);
        }
      );
    });
  };
  const upComingParkings = () => {
    console.log("upComingParkings called");
    setLoader(true);
    getUserData("userData").then((res) => {
      var userId = Base64.decode(res["UserId"]);
      var req = { userid: userId };

      httpCall(apiName["getUpcomingBooking"], req).then(
        (response) => {
          console.log("getUpcomingBooking", response);
          setLoader(false);
          if (response.respCode == 1) {
            setLoader(false);
            let showArray = [];
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

              response.bookings[i]["displayFromDate"] = moment(d2)
                .format("DD MMM YY hh:mm a")
                .toString();
              response.bookings[i]["displayToDate"] = moment(d3)
                .format("hh:mm a")
                .toString();
              showArray.push(response.bookings[i]);
            }
            setUpcomingData(showArray);
            console.log("first", showArray);
          } else {
            setUpcomingData([]);
            setLoader(false);
          }
        },
        (error) => {
          setUpcomingData([]);
          setLoader(false);
        }
      );
    });
  };

  const goToParking = (item) => {
    setLoader(true);
    getUserData("userData").then((res) => {
      var userId = Base64.decode(res["UserId"]);
      var req = {
        userid: userId, //decrypted UserID
        facilityid: item.facilityId,
      };
      httpCall(apiName["getFacilityDetails"], req).then(
        (response) => {
          if (response.respCode == 1) {
            setLoader(false);
            if (response["images"].length > 0) {
              var imgArr = [];
              for (let i = 0; i < response["images"].length; i++) {
                imgArr.push({
                  uri:
                    "data:image/png;base64," + response["images"][i].imagedata,
                });
              }
            }
            props.navigation.push("ParkingDetails", {
              data: item,
              entries: response["images"],
              image: imgArr,
            });
          } else {
            setLoader(false);
            // createSimpleToast("*something went wrong please try again later", 'failed');
          }
        },
        (error) => {
          setLoader(false);
        }
      );
    });
  };

  return (
    <SafeAreaView style={styles.main}>
      {showLoader ? <Loader /> : null}
      {Object.keys(myCordinates).length === 0 ? null : (
        <MapComponent
          origin={origin}
          myCordinates={myCordinates}
          markers={markers}
        />
      )}
      <View>
        <Banner name={name} />
      </View>
      <View style={styles.bottomView}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => props.navigation.navigate("FindParking")}
        >
          <TextInput
            placeholder="Find Parking"
            editable={false}
            placeholderTextColor="#01313C"
            style={styles.findBtn}
          />
          <Image style={styles.searchImg} source={search} />
        </TouchableOpacity>
        {parkingData.length > 0 ? (
          <Text style={styles.recommendedtext}>Recommended Parkings</Text>
        ) : null}

        {parkingData.length > 0 ? (
          <FlatList
            data={parkingData}
            renderItem={({ item }) => {
              return (
                <ParkingCard
                  name={item.name}
                  distance={item.distance}
                  address={item.address}
                  city={item.city}
                  clickHandler={() => goToParking(item)}
                />
              );
            }}
            keyExtractor={(item) => item.facilityId.toString()}
          />
        ) : parkingTrue ? (
          <View style={styles.noParkingView}>
            <Text style={styles.noparkingTxt}>
              Search parking option coming soon
            </Text>
          </View>
        ) : null}
      </View>
      {upcomingData && upcomingData.length > 0 ? (
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={() => {
            props.navigation.navigate("BookingsTabs");
          }}
          style={{
            height: h(9),
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0.5,
            borderColor: "#000000",
          }}
        >
          <View
            style={{ height: h(7), width: "95%", justifyContent: "center" }}
          >
            {/* <Text
              style={{
                fontSize: f(1.6),
                fontWeight: '700',
              }}>{`Upcoming Booking`}</Text> */}
            <Text style={{ fontSize: f(1.6), fontWeight: "700" }}>
              {`Upcoming Booking - ${upcomingData[0]?.facility?.["name"]}`}
            </Text>
            <Text>
              {`${upcomingData[0]?.displayFromDate} - ${upcomingData[0]?.displayToDate}`}
            </Text>
          </View>
          <View style={{}}>
            <Text style={{ fontSize: f(2.4), fontWeight: "400" }}>{">"}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
      {upcomingData && upcomingData.length > 1 ? (
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={() => {
            props.navigation.navigate("BookingsTabs");
          }}
          style={{
            height: h(7),
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0.5,
            borderColor: "#000000",
          }}
        >
          <View
            style={{ height: h(7), width: "95%", justifyContent: "center" }}
          >
            <Text style={{ fontSize: f(1.6), fontWeight: "700" }}>
              {upcomingData[1]?.facility?.["name"]}
            </Text>
            <Text>
              {`${upcomingData[1]?.displayFromDate} - ${upcomingData[1]?.displayToDate}`}
            </Text>
          </View>
          <View style={{}}>
            <Text style={{ fontSize: f(2.4), fontWeight: "400" }}>{">"}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  bottomView: { flex: 1, marginLeft: 20, marginRight: 20, marginTop: 10 },
  findBtn: {
    marginTop: 2,
    marginBottom: 10,
    paddingLeft: 30,
    width: "100%",
    backgroundColor: "#a3bcd580",
    borderColor: "#a3bcd580",
    borderRadius: 2,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: fonts.semiBold,
    height: 55,
  },
  searchImg: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 20,
    top: 15,
    resizeMode: "contain",
  },
  recommendedtext: {
    fontFamily: fonts.semiBold,
    color: "#04093F",
    marginLeft: 5,
  },
  noParkingView: {
    justifyContent: "center",
    alignItems: "center",
    height: "50%",
  },
  noparkingTxt: {
    fontFamily: fonts.semiBold,
    padding: 10,
    borderWidth: 0.5,
    borderColor: colorCodes.primaryColor,
    borderRadius: 20,
  },
});

export default Home;
