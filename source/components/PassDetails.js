import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { getUserData } from "../../../services/CommanServices";
import { Base64 } from "js-base64";
import ImageView from "react-native-image-viewing";
import { apiName } from "../../../shared/Config";
import { httpCall } from "../../../services/RestApi";
import { h, w } from "../../../theme/responsive";
const PassDetails = (props) => {
  var pass = props.route.params.pass;
  console.log(pass);
  const [showQr, setshowQr] = useState(false);
  const [qrCode, setqrCode] = useState(null);

  // function getQr(bookingid) {
  //   getUserData('userData').then((data) => {
  //     let req = {userid: Base64.decode(data.UserId), bookingid: bookingid};
  //     httpCall(apiName.getQRCode, req).then((res) => {
  //       if (res.respCode) {
  //         if (res.code != null) {
  //           setqrCode(res.code);
  //           setshowQr(true);
  //         } else {
  //           alert('QR_Code not found');
  //         }
  //       } else {
  //       }
  //     });
  //   });
  // }

  // function showID(bookingid) {
  //   if (bookingid != null) {
  //     setqrCode(bookingid);
  //     setshowQr(true);
  //   } else {
  //     alert('Document not found');
  //   }
  // }
  return (
    <View style={styles.body}>
      <Close action={props.route.params.props} />
      <View style={{ margin: 10 }}>
        {/* <View style={styles.fieldView}>
          <Fields title={'Name'} value={pass.name} />
          <Status bookingstatus={pass.bookingstatus} status={pass.status} />
        </View> */}

        <View style={styles.fieldView}>
          <Fields title={"Vehicle No"} value={pass.vehRegNumber} />
          <Image
            source={
              pass.vehicleType == 1
                ? require("../../../../assets/imgs/Sccoter_big.png")
                : require("../../../../assets/imgs/carVector.png")
            }
            style={styles.img}
          />
        </View>

        {/* <View
          style={{
            width: w(90),
            backgroundColor: 'blue',
            height: h(4),
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: '#000000',
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: w(45), color: '#FFFFFF', marginLeft: 5}}>
              Facility Name
            </Text>
            <Text style={{width: w(45), color: '#FFFFFF', marginLeft: 5}}>
              Pass Validity
            </Text>
          </View>
        </View>

        <View
          style={{
            width: w(90),
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: '#000000',
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: w(45), color: '#000000', marginLeft: 5}}>
              Facility Name
            </Text>
            <Text style={{width: w(45), color: '#000000', marginLeft: 5}}>
              Pass Validity
            </Text>
          </View>
        </View> */}

        <View style={styles.fieldView}>
          <View>
            <Fields title={"Facility Name"} value={pass.facility.name} />
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Image
                source={require("../../../../assets/imgs/blackPin.png")}
                style={styles.locIcon}
              />
              <Text style={[styles.time, { marginTop: 1 }]}>
                {pass.facility.address + ", " + pass.facility.city}
              </Text>
            </View>
          </View>
          {/* <Fields
            title={'Booking Type'}
            value={
              pass.bookingtype == 'Y'
                ? 'Yearly'
                : pass.bookingtype == 'M'
                ? 'Monthly'
                : 'Hourly'
            }
          /> */}
        </View>
        {/* {pass.documentname ? (
          <TouchableOpacity
            onPress={() => showID(pass.document)}
            style={{justifyContent: 'center', margin: 30}}>
            <Image
              style={{height: 50, width: 50, resizeMode: 'contain'}}
              source={require('../../../../assets/imgs/uploadLicense.png')}
            />
            <Text style={[styles.time, {marginTop: 1, fontSize: 14}]}>
              {pass.documentname}
            </Text>
          </TouchableOpacity>
        ) : null} */}

        {/* {pass.bookingstatus ? (
          <View>
            <View style={styles.fieldView}>
              <Fields
                title={'Issue Date'}
                value={props.route.params.fromdate}
              />
              <Fields title={'Valid Till'} value={props.route.params.todate} />
            </View>

            <TouchableOpacity
              onPress={() => getQr(pass.bookingid)}
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                margin: 30,
              }}>
              <Image
                style={styles.qrimg}
                source={require('../../../../assets/imgs/qrcode_icon.png')}
              />
              <Text style={[styles.time, {marginTop: 1}]}>
                {'Click on qr code to enlarge'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.titleTxt}>
              {'Note: Request sent to facility for Approval.'}
            </Text>
          </View>
        )} */}
      </View>

      <ImageView
        images={[{ uri: "data:image/png;base64," + qrCode }]}
        imageIndex={0}
        visible={showQr}
        onRequestClose={() => setshowQr(false)}
      />
    </View>
  );
};

const Fields = ({ title, value }) => {
  return (
    <View>
      <Text style={styles.titleTxt}>{title}</Text>
      <Text style={styles.valueTxt}>{value}</Text>
    </View>
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
      <Text style={bookingstatus ? styles.active : styles.requested}> </Text>
      <Text style={styles.time}>{bookingstatus ? "Active" : "Requested"}</Text>
    </View>
  );
};

const Close = ({ action }) => {
  return (
    <TouchableOpacity
      style={{ padding: 10 }}
      onPress={() => action.navigation.goBack()}
    >
      <Image
        source={require("../../../../assets/imgs/close.png")}
        style={styles.closeIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeIcon: { width: 30, height: 30 },
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
  pending: {
    backgroundColor: "red",
    borderRadius: 50,
    width: 10,
    height: 10,
    marginRight: 4,
    marginTop: 2,
  },
  img: {
    height: 100,
    width: 100,
    resizeMode: "contain",
    position: "absolute",
    right: 0,
    top: -30,
  },
  titleTxt: {
    fontFamily: "Segoe_UI_semi_Bold",
    fontSize: 14,
    color: "#01313C",
  },
  valueTxt: {
    fontFamily: "Segoe_UI_Regular",
    fontSize: 18,
    marginTop: 2,
    color: "#01313C",
  },
  fieldView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  locIcon: { height: 15, width: 15, resizeMode: "contain" },
  qrimg: { height: 120, width: 120 },
  requested: {
    backgroundColor: "yellow",
    borderRadius: 50,
    width: 10,
    height: 10,
    marginRight: 4,
    marginTop: 2,
  },
});

export default PassDetails;
