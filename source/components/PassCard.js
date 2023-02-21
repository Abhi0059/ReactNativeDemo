import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import QRCode from "react-native-qrcode-svg";
import { h, w } from "../theme/responsive";
const PassCard = ({
  vehRegNumber,
  fromdate,
  todate,
  pnr,
  bookingstatus,
  bookingtype,
  vehicleType,
  facility,
  pass,
  setLoader,
  props,
  status,
  bookingid,
  showQrCode,
  setBooking,
  requestid,
}) => {
  const [time, setTime] = useState({ fromdate: "", todate: "" });
  const [showQr, setshowQr] = useState(false);
  const [qrCode, setqrCode] = useState(null);
  useEffect(() => {
    var from = getTime(fromdate, "from");
    var to = getTime(todate, "to");
    setTime({ fromdate: from, todate: to });
  }, []);

  function getTime(time, type) {
    var d1 = new Date("Tue Jan 01 2021 00:00:00 GMT+0530 (IST)"),
      d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() + time);
    if (type == "to") {
      let currentTime = new Date();
      let diff = (currentTime.getTime() - d1.getTime()) / 1000;
      diff /= 60;
    }
    return d2.toDateString();
  }

  // function getQr(bookingid) {
  //   setLoader(true);
  //   getUserData('userData').then((data) => {
  //     let req = {userid: Base64.decode(data.UserId), bookingid: bookingid};
  //     httpCall(apiName.getQRCode, req).then((res) => {
  //       if (res.respCode) {
  //         if (res.code != null) {
  //           setqrCode(res.code);
  //           setshowQr(true);
  //           setLoader(false);
  //         } else {
  //           alert('QR_Code not found');
  //           setLoader(false);
  //         }
  //       } else {
  //       }
  //     });
  //   });
  // }
  let qrCodePass = `data:image/png;base64,${bookingid ? bookingid : requestid}`;
  return (
    <TouchableOpacity
      style={styles.body}
      onPress={() =>
        props.navigation.navigate("PassDetails", {
          props: props,
          pass: pass,
          fromdate: time.fromdate,
          todate: time.todate,
        })
      }
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.vehNo}>{vehRegNumber}</Text>
        <Status bookingstatus={bookingstatus} status={status} />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={[styles.time, { marginTop: 5 }]}>
            {"Facility Name: " + facility?.name}
          </Text>
          {bookingstatus ? (
            <Text style={[styles.time, { marginTop: 5 }]}>
              {"Valid till: " + time.todate}
            </Text>
          ) : (
            <Text style={[styles.time, { marginTop: 5 }]}>
              {"Note: Request sent to facility for Approval."}
            </Text>
          )}
        </View>

        {bookingstatus ? (
          <TouchableOpacity
            onPress={() => {
              setBooking(bookingid ? bookingid : requestid);
              showQrCode(true);
            }}
          >
            <QRCode
              value={bookingid ? bookingid : requestid}
              logo={{ uri: qrCodePass }}
              logoSize={50}
              size={50}
              logoBackgroundColor="transparent"
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* <ImageView
        images={[{uri: 'data:image/png;base64,' + bookingid}]}
        imageIndex={0}
        visible={showQr}
        onRequestClose={() => setshowQr(false)}
      /> */}
    </TouchableOpacity>
  );
};

const Status = ({ bookingstatus, status }) => {
  let finalStatus = "";
  let color;
  console.log(status);
  if (status != undefined) {
    if (status === 0) {
      finalStatus = "Requested";
      color = styles.requested;
    } else {
      finalStatus = "Rejected";
      color = styles.rejected;
    }
  } else {
    if (bookingstatus) {
      finalStatus = "Active";
      color = styles.active;
    } else {
      finalStatus = "Requested";
      color = styles.requested;
    }
  }
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={color}> </Text>
      <Text style={styles.time}>{finalStatus}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#fff",
    margin: 3,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  vehNo: { fontFamily: "Segoe_UI_semi_Bold", fontSize: 16 },
  time: { fontFamily: "Segoe_UI_Regular", color: "#01313C", fontSize: 11 },
  active: {
    backgroundColor: "green",
    borderRadius: 50,
    width: 10,
    height: 10,
    marginRight: 4,
    marginTop: 2,
  },
  rejected: {
    backgroundColor: "red",
    borderRadius: 50,
    width: 10,
    height: 10,
    marginRight: 4,
    marginTop: 2,
  },
  requested: {
    backgroundColor: "yellow",
    borderRadius: 50,
    width: 10,
    height: 10,
    marginRight: 4,
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

  img: { height: 45, width: 45 },
});

export default PassCard;
