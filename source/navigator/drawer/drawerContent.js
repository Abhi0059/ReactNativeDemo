import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import {
  createSimpleToast,
  getUserData,
  storeUserData,
  deleteData,
} from "../../utils/CommanServices";
import DeviceInfo from "react-native-device-info";
import colorCodes from "../../themes/colorCodes";
import fonts from "../../themes/fonts";
import MenuButton from "../../components/MenuButton";

var profileImg = require("../../../assets/imgs/profile.png");
var medal_blue = require("../../../assets/imgs/medal_blue.png");
var myBookings = require("../../../assets/imgs/myBookings.png");
var contactUs = require("../../../assets/imgs/contactUs.png");
var favouriteParkings = require("../../../assets/imgs/favouriteParkings.png");
var uploadRcBook = require("../../../assets/imgs/car-outline.png");
var rateUs = require("../../../assets/imgs/rateUs.png");
var pass = require("../../../assets/imgs/pass.png");
var checkout = require("../../../assets/imgs/checkout.png");
var referIcon = require("../../../assets/imgs/refer.png");

import RNRestart from "react-native-restart";
import Rate, { AndroidMarket } from "react-native-rate";
const menuData = [
  {
    id: "1",
    name: "Vehicle Registration",
    leftimg: uploadRcBook,
    buttonHandle: "VehicleRegisteration",
  },
  {
    id: "2",
    name: "My Bookings",
    leftimg: myBookings,
    buttonHandle: "BookingsTabs",
  },
  {
    id: "3",
    name: "My Pass",
    leftimg: pass,
    buttonHandle: "MyPass",
  },
  {
    id: "4",
    name: "Favourite Parking",
    leftimg: favouriteParkings,
    buttonHandle: "MyFavourites",
  },
  {
    id: "5",
    name: "Contact Us",
    leftimg: contactUs,
    buttonHandle: "Help",
  },
  {
    id: "6",
    name: "Rate Us",
    leftimg: rateUs,
    buttonHandle: "Rate Us",
  },
  {
    id: "7",
    name: "Refer a friend",
    leftimg: referIcon,
    buttonHandle: "Refer",
  },
  {
    id: "8",
    name: "Log Out",
    leftimg: checkout,
    buttonHandle: "Log Out",
  },
];
export function DrawerContent(props) {
  var nav = props;
  const [userImg, setUserImg] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [appVersion, setVersion] = useState("0.0.0");
  useEffect(() => {
    checkData();
  });

  const checkData = () => {
    let version = DeviceInfo.getVersion();
    setVersion(version);
    getUserData("userData").then((res) => {
      console.log("userDatauserDatauserDatauserData", res);
      if (res != null) {
        setEmail(res["Email"]);
        setPhone(`${res["ISDCode"]} ${res["Mobile"]}`);
        setName(res["name"]);
        setCity(res["City"]);
        setUserImg(res["userImg"]);
      } else {
        // console.log("yes 2")
        checkData();
        return;
      }
    });
  };
  const redirect = (page) => {
    console.log(nav.navigation);
    console.log(page);
    if (page == "Log Out") {
      //  askLogoutPermission();
    } else if (page == "Rate Us") {
      // rateApp();
    } else {
      nav.navigation.navigate(page);
    }
  };

  function rateApp() {
    const options = {
      // AppleAppID: "2193813192",
      GooglePackageName: "com.incubermax.eazypark",
      // AmazonPackageName: "com.mywebsite.myapp",
      // OtherAndroidURL: "http://www.randomappstore.com/app/47172391",
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
      fallbackPlatformURL: "http://incubermax.com/",
    };
    Rate.rate(options, (success, errorMessage) => {
      if (success) {
        // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
        console.log(success);
      }
      if (errorMessage) {
        // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
        console.error(`Example page Rate.rate() error: ${errorMessage}`);
      }
    });
  }

  const askLogoutPermission = () => {
    Alert.alert("Please Confirm!", "Do you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          deleteData("userData");
          storeUserData("userData", { isIntroPage: false });
          RNRestart.Restart();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View {...props} style={{ flex: 1 }}>
        <View style={styles.drawerContent}>
          <View style={styles.mainTop}>
            <View style={styles.profileView}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("Profile")}
              >
                {userImg == undefined || userImg == "" ? (
                  <Image style={styles.proImg} source={profileImg} />
                ) : (
                  <Image style={styles.proImg} source={{ uri: userImg }} />
                )}
              </TouchableOpacity>
              <Image
                // onPress={() => props.navigation.navigate('Profile')}
                style={styles.medalimg}
                source={medal_blue}
              />
              <View style={{ paddingLeft: 25 }}>
                {name != "" ? (
                  <Text
                    // onPress={() => props.navigation.navigate('Profile')}
                    style={{
                      marginTop: 5,
                      fontFamily: fonts.regular,
                      fontSize: 16,
                      color: colorCodes.colorWhite,
                    }}
                  >
                    {name}
                  </Text>
                ) : (
                  <Text
                    // onPress={() => props.navigation.navigate('Profile')}
                    style={{
                      marginTop: 5,
                      fontFamily: fonts.regular,
                      fontSize: 16,
                      color: colorCodes.colorWhite,
                    }}
                  >
                    {phone}
                  </Text>
                )}
                {name != "" ? (
                  <Text
                    // onPress={() => props.navigation.navigate('Profile')}
                    style={{
                      marginTop: 5,
                      fontFamily: fonts.regular,
                      fontSize: 14,
                      color: "#D8F6F2",
                      width: 160,
                    }}
                  >
                    {phone}
                  </Text>
                ) : (
                  <Text
                    // onPress={() => props.navigation.navigate('Profile')}
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 12,
                      color: "#D8F6F2",
                      width: 160,
                    }}
                  >
                    {email}
                  </Text>
                )}
                {city != "" ? (
                  <Text
                    // onPress={() => props.navigation.navigate('Profile')}
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 12,
                      color: "#D8F6F2",
                    }}
                  >
                    {city}
                    {/* {((city).length > 25) ?
                        (((city).substring(0, 25 - 3)) + '...') :
                        city} */}
                  </Text>
                ) : null}
              </View>
            </View>
            {/* <View style={styles.greenBtn}>
                            <GreenButton name="Leaderboard" buttonHandle={() => redirect('LeaderBoard')} />
                        </View> */}
          </View>

          <FlatList
            data={menuData}
            renderItem={({ item }) => {
              return (
                <MenuButton
                  name={item.name}
                  leftimg={item.leftimg}
                  buttonHandle={() => redirect(item.buttonHandle)}
                  nav={nav}
                />
              );
            }}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
      <View style={styles.bottomDrawerSection}>
        <Text style={styles.versionText}>v{appVersion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    marginTop: -4,
  },
  userInfoSection: {
    paddingLeft: 20,
    backgroundColor: colorCodes.primaryColor,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  Text: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  Text: {
    fontWeight: "bold",
    marginRight: 3,
  },
  bottomDrawerSection: {
    marginTop: 10,
    marginBottom: 5,
    borderTopColor: "#f4f4f4",
    justifyContent: "space-between",
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

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
  versionText: {
    fontFamily: "Segoe_UI_Regular",
    color: "#ddd",
    textAlign: "center",
  },
  greenBtn: { marginLeft: 30, marginRight: 20, marginBottom: 30, marginTop: 5 },
  proImg: {
    width: 60,
    height: 60,
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 0.1,
  },
  medalimg: {
    width: 23,
    height: 30,
    zIndex: 100,
    left: 65,
    top: 20,
    position: "absolute",
  },
  mainTop: { backgroundColor: colorCodes.primaryColor },
  profileView: {
    width: "100%",
    alignItems: "flex-start",
    padding: 20,
    flexDirection: "row",
  },
});
