import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import PassCard from "../../components/PassCard";
import { apiName } from "../../../Config";
import { httpCall } from "../../utils/RestApi";
import { getUserData } from "../../utils/CommanServices";
import { Base64 } from "js-base64";

class PassRequest extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requestPassList: [],
      loadingText: "Searching for pass...",
      loader: false,
    };
  }

  componentDidMount() {
    this.getRequestPass();
  }

  showLoader = (param) => {
    this.setState({
      loader: param,
    });
  };

  getRequestPass = () => {
    getUserData("userData").then((data) => {
      let req = { userid: Base64.decode(data.UserId) };
      httpCall(apiName.GetPassRequetsList, req).then((res) => {
        console.log("GetPassRequetsList", res);
        if (res.respCode == 1 && res.data.length) {
          this.setState({
            loadingText: "",
            requestPassList: res.data,
          });
        } else if (res.respCode == 1 && !res.data.length) {
          this.setState({
            loadingText: "No pass found",
            requestPassList: [],
          });
        } else {
          this.setState({
            loadingText: "No pass found",
            requestPassList: [],
          });
        }
      });
    });
  };

  render() {
    const { loader, loadingText, requestPassList } = this.state;
    const { navigation } = this.props;
    return (
      <View style={style.body}>
        {loader ? <Loader /> : null}
        <ScrollView>
          {requestPassList.length > 0 ? (
            requestPassList.map((pass) => (
              <PassCard
                key={pass.bookingid}
                requestid={pass.requestid}
                vehRegNumber={pass.vehRegNumber}
                fromdate={pass.fromdate}
                todate={pass.todate}
                pnr={pass.pnr}
                bookingstatus={pass.bookingstatus}
                bookingtype={pass.bookingtype}
                vehicleType={pass.vehicleType}
                facility={pass.facility}
                pass={pass}
                setLoader={(value) => {
                  this.showLoader(value);
                }}
                navigation={navigation}
                status={pass.status}
              />
            ))
          ) : (
            <View>
              <Text style={style.loadingText}>{loadingText}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

// const PassRequest = ({ props }) => {
//   const [requestPassList, setRequestPassList] = useState([]);
//   const [loadingText, setLoadingText] = useState("Searching for pass...");
//   const [loader, setLoader] = useState(false);

//   useEffect(() => {
//     //getRequestPass();
//   }, []);

//   const getRequestPass = () => {
//     getUserData("userData").then((data) => {
//       let req = { userid: Base64.decode(data.UserId) };
//       httpCall(apiName.GetPassRequetsList, req).then((res) => {
//         console.log("GetPassRequetsList", res);
//         if (res.respCode) {
//           setRequestPassList(res.data);
//           if (res.data.length === 0) setLoadingText("No pass found");
//           else setLoadingText("");
//         } else {
//           setRequestPassList([]);
//           setLoadingText("No Pass found");
//         }
//       });
//     });
//   };

//   return (
//     <View style={style.body}>
//       {loader ? <Loader /> : null}
//       <ScrollView>
//         {requestPassList.length > 0 ? (
//           requestPassList.map((pass) => (
//             <PassCard
//               key={pass.bookingid}
//               requestid={pass.requestid}
//               vehRegNumber={pass.vehRegNumber}
//               fromdate={pass.fromdate}
//               todate={pass.todate}
//               pnr={pass.pnr}
//               bookingstatus={pass.bookingstatus}
//               bookingtype={pass.bookingtype}
//               vehicleType={pass.vehicleType}
//               facility={pass.facility}
//               pass={pass}
//               setLoader={setLoader}
//               props={props}
//               status={pass.status}
//             />
//           ))
//         ) : (
//           <View>
//             <Text style={style.loadingText}>{loadingText}</Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

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
});

export default PassRequest;
