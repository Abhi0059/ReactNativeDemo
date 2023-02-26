import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import Header from "../../components/Header";
import PassCard from "../../components/PassCard";
import { apiName } from "../../../Config";
import { httpCall } from "../../utils/RestApi";
import { getUserData } from "../../utils/CommanServices";
import { Base64 } from "js-base64";
import Accordion from "react-native-collapsible-accordion";
import { h, w } from "../../theme/responsive";
import QRCode from "react-native-qrcode-svg";
var backbutton = require("../../../assets/imgs/backbutton.png");

const MyPass = (props) => {
  const [passList, setPassList] = useState([]);
  const [requestPassList, setRequestPassList] = useState([]);
  const [requestpassCount, setrequestpassCount] = useState(0);
  const [loadingText, setLoadingText] = useState("Searching for pass...");
  const [loader, setLoader] = useState(false);
  const [more, setmore] = useState(false);
  const [showQr, setshowQr] = useState(false);
  const [booking, setBooking] = useState("");
  useEffect(() => {
    getPass();
    getRequestPass();
  }, []);

  const getPass = () => {
    setLoader(true);
    getUserData("userData").then((data) => {
      let req = { userid: Base64.decode(data.UserId) };
      httpCall(apiName.GetPassList, req).then((res) => {
        console.log("GetPassList", res);
        if (res.respCode) {
          let data = res.bookings.sort((a, b) =>
            a.todate < b.todate ? 1 : -1
          );
          setPassList(data);
          if (data.length === 0) setLoadingText("No pass found");
          else setLoadingText("");
          setLoader(false);
        } else {
          setPassList([]);
          setLoadingText("No Pass found");
          setLoader(false);
        }
      });
    });
  };

  const getRequestPass = () => {
    getUserData("userData").then((data) => {
      let req = { userid: Base64.decode(data.UserId) };
      httpCall(apiName.GetPassRequetsList, req).then((res) => {
        if (res.respCode) {
          setrequestpassCount(res.data.length);
          setRequestPassList(res.data);
        } else {
          setrequestpassCount(0);
          setRequestPassList([]);
        }
      });
    });
  };
  console.log("my passes ");
  return (
    <View style={style.body}>
      {loader ? <Loader /> : null}
      <Header props={props} title={"View Pass"} />
      <ScrollView>
        {passList.length > 0 ? (
          passList.map((pass) => (
            <PassCard
              key={pass.bookingid}
              bookingid={pass.bookingid}
              vehRegNumber={pass.vehRegNumber}
              fromdate={pass.fromdate}
              todate={pass.todate}
              pnr={pass.pnr}
              bookingstatus={pass.bookingstatus}
              bookingtype={pass.bookingtype}
              vehicleType={pass.vehicleType}
              facility={pass.facility}
              pass={pass}
              setLoader={setLoader}
              props={props}
              status={undefined}
              showQrCode={setshowQr}
              setBooking={setBooking}
            />
          ))
        ) : (
          <View>
            <Text style={style.loadingText}>{loadingText}</Text>
          </View>
        )}
      </ScrollView>
      {showQr ? (
        <View style={style.qrCodeOverlay}>
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
                setshowQr(false);
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
              value={booking}
              logo={{ uri: "data:image/png;base64," + booking }}
              logoSize={w(90)}
              size={w(90)}
              logoBackgroundColor="transparent"
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const Loader = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        textAlign: "center",
        alignContent: "center",
        backgroundColor: "#00000059",
        width: "110%",
        height: "110%",
        position: "absolute",
        zIndex: 3,
        flex: 1,
      }}
    >
      <ActivityIndicator size="large" color="#770EC1" />
    </View>
  );
};

const style = StyleSheet.create({
  body: { padding: 10, flex: 1, backgroundColor: "#fff" },
  loadingText: { textAlign: "center", fontFamily: "Segoe_UI_semi_Bold" },
  menuText: {
    color: "#01313C",
    fontFamily: "Segoe_UI_Regular",
    marginTop: 5,
    textAlign: "left",
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
  menuView: {
    flexDirection: "row",
    borderWidth: 1,
    marginBottom: 15,
    borderColor: "#00000029",
    borderRadius: 10,
    padding: 10,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    borderBottomColor: "#00000029",
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

export default MyPass;
