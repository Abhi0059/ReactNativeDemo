import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import GradientButton from "../../components/GradientButton";
import { apiName } from "../../../Config";
import { httpCall, httpGet } from "../../utils/RestApi";
import DatePicker from "react-native-date-picker";
import moment from "moment";

import {
  getUserData,
  storeUserData,
  launch_Camera,
  getBase64,
  launch_Image_Library,
} from "../../utils/CommanServices";
import Toast from "react-native-simple-toast";
import { Base64 } from "js-base64";
import Overlay from "react-native-modal-overlay";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";

class RequestPass extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      defaultVehicle: {},
      facilityid: 0,
      facName: "",
      facAddress: "",
      // const [defaultLocation, setDefaultLocation] = useState({
      //   facilityid: 0,
      //   facName: "",
      //   facAddress: "",
      // });
      docFieldName: "",
      formDataToSend: {},
      docFileName: "",
      modalVisible: false,
      modalLocationVisible: false,
      vehList: [],
      LocList: [],
      selectedLocList: {},
      locationSearchText: "",
      searchingText: "please search and select facility",
      towerNoText: "",
      flatNoText: "",
      docImg: "",
      docInfo: {},
      nameText: "",
      loader: false,
      openStartDate: false,
      openEndDate: false,
      startDate: new Date(),
      endDate: new Date(),
      facilityidSearch: "",
      template: [],
    };
  }
  componentDidMount() {
    this.getVehicles();
  }

  getVehicles = () => {
    getUserData("userData").then((data) => {
      let vehDef = { vehNo: data.defaultVehicle, vehType: data.vehicleType };

      httpGet(apiName.getVehicle + Base64.decode(data.UserId)).then((res) => {
        if (res.respCode) {
          this.setState({
            vehList: res.details,
            defaultVehicle: vehDef,
          });
        } else {
          this.setState({
            vehList: [],
            defaultVehicle: vehDef,
          });
        }
      });
    });
  };

  openModal = () => {
    this.setState({ modalVisible: true });
  };

  openLocationModal = () => {
    console.log("openLocationModal");
    this.setState({ modalLocationVisible: true });
  };

  setSearchedFacility = (id) => {
    this.setState(
      {
        formDataToSend: {},
        facilityidSearch: id,
      },
      () => {
        this.getFacilities(id);
      }
    );
  };

  goToQrScanner = () => {
    const { navigation } = this.props;
    navigation.navigate("QrScanner", {
      setSearchedFacility: this.setSearchedFacility,
    });
  };
  setVehicle = (item) => {
    console.log("item", item);
    getUserData("userData").then((res) => {
      var a = res;
      a["defaultVehicle"] = item["vehRegNumber"];
      a["vehicleType"] = item["vehicleType"];
      storeUserData("userData", a);
      let vehDef = {
        vehNo: item["vehRegNumber"],
        vehType: item["vehicleType"],
      };

      this.setState({
        defaultVehicle: vehDef,
        modalVisible: false,
      });
    });
  };

  setLocation = (item) => {
    // let LocDef = {
    //   facilityid: item.facilityid,
    //   facName: item.name,
    //   facAddress: item.address,
    // };
    console.log("setLocation", item);
    this.setState({
      selectedLocList: item,
      facilityidSearch: item.facilityid,
      facilityid: item.facilityid,
      facName: item.name,
      facAddress: item.address,
      modalLocationVisible: false,
    });
  };

  getFacilities = (id) => {
    const { locationSearchText } = this.state;
    const { template } = this.state;
    this.setState({
      searchingText: "Searching facilities...",
    });

    getUserData("userData").then((data) => {
      let req = {
        userid: Base64.decode(data.UserId),
        search: id ? id : locationSearchText,
      };
      httpCall(apiName.GetFacilityListForPass, req).then((res) => {
        if (res.respCode) {
          if (res.list.length === 0) {
            this.setState({
              searchingText: "No facility found.",
            });
          } else {
            this.setState({
              searchingText: "",
              LocList: res.list,
            });
          }
          template &&
            template.map((data, index) => {
              const { fieldlabel, fieldvalue, fieldtype, mandatory } = data;
              this.setState({
                formDataToSend: {
                  ...this.state.formDataToSend,
                  [fieldvalue]: "",
                },
              });
            });
        } else {
          this.setState({
            LocList: [],
            searchingText: "No facility found.",
          });
        }
      });
    });
  };

  onSubmit = () => {
    const { template } = this.state;
    for (let i = 0; i < template.length; i++) {
      const { mandatory, fieldlabel, fieldtype, fieldvalue } = template[i];
      const toastMessage =
        fieldtype === "input"
          ? `Please enter ${fieldlabel}`
          : `Please select document`;
      if (mandatory == true && !formDataToSend[fieldvalue]?.trim()) {
        Toast.show(toastMessage);

        return;
      }
    }
    submit();
  };

  submit = () => {
    const { facilityidSearch, defaultVehicle, docFileName } = this.state;
    var findDate = moment("Tue Jan 01 2021 00:00:00 GMT+0530 (IST)");
    var start = moment(startDate);
    var end = moment(endDate);
    let startDateTosend = start.diff(findDate, "minutes");

    let endDateTosend = end.diff(findDate, "minutes");

    console.log("startDateTosend", startDateTosend, "", endDateTosend); // 44700
    console.log("first", LocList);

    getUserData("userData").then((data) => {
      let req = {
        userId: Base64.decode(data.UserId),
        facilityid: facilityidSearch,
        VehRegNumber: defaultVehicle.vehNo,
        bookingtype: "M",
        fromdate: startDateTosend + 1440,
        todate: endDateTosend + 43800 + 1440,
        docname1: docFileName,
      };
      req = { ...req, ...this.state.formDataToSend };
      console.log("toastMessage", req);

      // setLoader(true);
      httpCall(apiName.SendPassRequets, req).then((res) => {
        if (res.respCode == 1) {
          console.log("res of apiName.SendPassRequets", res);
          // setLocList(res.list)
          // if (res.list.length === 0) setSearchingText("No facility found")
          // else setSearchingText("")
          // setLoader(false);
          Toast.show("Request Sent");
          // alert('Request Sent');
          //setIndexnNow();
          //props.navigation.goBack();
        } else {
          //  setLoader(false);
          // alert(res.message);
          Toast.show(res.message);
          // setLocList([])
          // setSearchingText("No facility found.")
        }
      });
    });
  };

  launchCamera = () => {
    console.log("launchCamera");
    SheetManager.hideAll();
    launch_Camera().then((res) => {
      console.log("Response:>>>>", res);
      if (res.assets) {
        this.setState({
          docImg: res.assets[0].uri,
        });

        getBase64(res.assets[0].uri).then((ress) => {
          console.log(ress);
          // const image = {baseImg: ress, docName: res.assets[0].fileName};
          this.setState({
            formDataToSend: {
              ...this.state.formDataToSend,
              [docFieldName]: ress,
            },
            docFileName: res.assets[0].fileName,
          });

          //setDocInfo(image);
        });
      }
    });
  };

  onChangelocationSearchText = (value) => {
    this.setState({
      locationSearchText: value,
    });
  };

  render() {
    const {
      loader,
      modalVisible,
      defaultVehicle,
      facilityid,
      facName,
      facAddress,
      docFieldName,
      formDataToSend,
      docFileName,
      modalLocationVisible,
      vehList,
      LocList,
      selectedLocList,
      locationSearchText,
      searchingText,
      towerNoText,
      flatNoText,
      docImg,
      docInfo,
      nameText,
      openStartDate,
      openEndDate,
      startDate,
      endDate,
      facilityidSearch,
      template,
    } = this.state;

    const { navigation } = this.props;

    return (
      <View style={style.body}>
        {loader ? <Loader /> : null}
        {/* {//choosevehicle Popup} */}
        <Overlay
          visible={modalVisible}
          onClose={() => this.setState({ modalVisible: false })}
          closeOnTouchOutside
          animationType={"zoomIn"}
          childrenWrapperStyle={{ borderWidth: 1, borderRadius: 5 }}
        >
          <View style={{ width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: "Segoe_UI_semi_Bold",
                  color: "#707070",
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
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../../../assets/imgs/close.png")}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ marginTop: 10, marginBottom: 20 }}>
              {vehList.map((veh) => (
                <VehicleList
                  vehRegNumber={veh.vehRegNumber}
                  vehicleType={veh.vehicleType}
                  defaultVehicle={defaultVehicle}
                  setVehicle={this.setVehicle}
                  data={veh}
                  key={veh.id}
                />
              ))}
            </ScrollView>
          </View>
        </Overlay>

        {/* {//chooseLocation Popup} */}
        <Overlay
          visible={modalLocationVisible}
          onClose={() =>
            this.setState({
              modalLocationVisible: false,
            })
          }
          closeOnTouchOutside
          animationType={"zoomIn"}
          childrenWrapperStyle={{ borderWidth: 1, borderRadius: 5 }}
        >
          <View style={{ width: "100%", height: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: "Segoe_UI_semi_Bold",
                  color: "#707070",
                  fontSize: 16,
                  paddingLeft: 20,
                }}
              >
                Search Location
              </Text>
              <TouchableOpacity
                style={{ position: "absolute", right: 0, top: -5 }}
                onPress={() => {
                  this.setState({
                    modalLocationVisible: false,
                  });
                }}
              >
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../../../assets/imgs/close.png")}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingTop: 30,
                marginBottom: 10,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TextInput
                onChangeText={(value) => this.onChangelocationSearchText(value)}
                value={locationSearchText}
                style={{
                  borderWidth: 0.5,
                  borderRadius: 5,
                  width: "68%",
                  height: 45,
                  borderColor: "#707070",
                  color: "#01313C",
                  paddingLeft: 10,
                  fontFamily: "Segoe_UI_semi_Bold",
                }}
              />
              <GradientButton
                name="   Search   "
                buttonHandle={() => this.getFacilities("")}
              />
            </View>
            <ScrollView style={{ marginTop: 10, marginBottom: 20 }}>
              {LocList.length > 0 ? (
                LocList.map((loc) => (
                  <LocationList
                    name={loc.name}
                    address={loc.address}
                    facilityid={loc.facilityid}
                    data={loc}
                    key={loc.facilityid}
                    setLocation={setLocation}
                  />
                ))
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    color: "#01313C",
                    fontFamily: "Segoe_UI_semi_Bold",
                  }}
                >
                  {searchingText}
                </Text>
              )}
            </ScrollView>
          </View>
        </Overlay>

        {/* {//Choose upload way Popup} */}
        <ActionSheet id="upload_sheet">
          <View style={{ flexDirection: "column" }}>
            <View style={style.menuView}>
              <Image
                style={style.menuIcon}
                source={require("../../../assets/imgs/camera.png")}
              />
              <Text style={style.menuText} onPress={() => this.launchCamera()}>
                Upload From Camera
              </Text>
              <Image
                style={style.menuIconBack}
                source={require("../../../assets/imgs/whitebackbutton.png")}
              />
            </View>
            <View style={style.menuView}>
              <Image
                style={style.menuIcon}
                source={require("../../../assets/imgs/gallery.png")}
              />
              <Text style={style.menuText} onPress={() => this.launchGallery()}>
                Upload From Gallery
              </Text>
              <Image
                style={style.menuIconBack}
                source={require("../../../assets/imgs/whitebackbutton.png")}
              />
            </View>
          </View>
        </ActionSheet>

        <ScrollView>
          <SelectVehicle data={defaultVehicle} openModal={this.openModal} />
          <Pressable
            onPress={() => {
              navigation.navigate("AddVehicle", { from: "RequestPass" });
            }}
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "blue",
                fontFamily: "Segoe_UI_semi_Bold",
                textDecorationLine: "underline",
              }}
            >
              Add New Vehicle
            </Text>
          </Pressable>
          {/* {defaultLocation.facilityid == 0 ? (
          <View style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <TouchableOpacity
              onPress={() => openLocationModal()}
              editable={false}
              style={{
                borderWidth: 0.5,
                borderRadius: 5,
                height: 50,
                borderColor: '#707070',
                color: '#01313C',
                paddingLeft: 10,
                fontFamily: 'Segoe_UI_semi_Bold',
              }}></TouchableOpacity>
          </View>
        ) : (
          <SelectLocation
            openModal={openLocationModal}
            defaultLocation={defaultLocation}
          />
        )} */}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              marginTop: 15,
              justifyContent: "space-evenly",
            }}
          >
            <View style={{ width: "45%" }}>
              <GradientButton
                name="Scan QR"
                buttonHandle={() => this.goToQrScanner()}
              />
            </View>

            <View style={{ width: "45%" }}>
              <GradientButton
                name="Search facility"
                buttonHandle={() => this.openLocationModal()}
              />
            </View>
          </View>

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Segoe_UI_semi_Bold",
                color: "grey",
                fontSize: 12,
              }}
            >
              Search/Scan QR for the facility you are requesting
            </Text>
          </View>

          {openStartDate ? (
            <DatePicker
              modal
              minimumDate={new Date("2021-01-01")}
              //maximumDate={currentDate}
              open={openStartDate}
              date={startDate}
              mode={"date"}
              onConfirm={(date) => {
                this.setState({
                  startDate: date,
                  openStartDate: false,
                });
              }}
              onCancel={() => {
                this.setState({
                  openStartDate: false,
                });
              }}
            />
          ) : (
            <View />
          )}

          {openEndDate ? (
            <DatePicker
              modal
              minimumDate={startDate}
              //maximumDate={currentDate}
              open={openEndDate}
              date={endDate}
              mode={"date"}
              onConfirm={(date) => {
                this.setState({
                  endDate: date,
                  openEndDate: false,
                });
              }}
              onCancel={() => {
                this.setState({
                  openEndDate: false,
                });
              }}
            />
          ) : (
            <View />
          )}

          {facilityidSearch ? (
            <View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#000000",
                    fontFamily: "Segoe_UI_semi_Bold",
                    marginTop: 15,
                  }}
                >
                  {LocList.length
                    ? `Facility Name - ${selectedLocList["name"]}`
                    : ""}
                </Text>
              </View>
              {/* <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <View style={{width: '40%'}}>
                <Text
                  style={{
                    color: '#707070',
                    fontFamily: 'Segoe_UI_semi_Bold',
                    marginTop: 10,
                  }}>
                  Start Date
                </Text>
                <Pressable
                  onPress={() => {
                    setOpenStartDate(true);
                  }}
                  style={{
                    borderWidth: 0.5,
                    borderColor: '#707070',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  <Text>{moment(startDate).format('DD-MMM-YYYY')}</Text>
                </Pressable>
              </View>
              <View style={{width: '40%'}}>
                <Text
                  style={{
                    color: '#707070',
                    fontFamily: 'Segoe_UI_semi_Bold',
                    marginTop: 10,
                  }}>
                  End Date
                </Text>
                <Pressable
                  onPress={() => {
                    setOpenEndDate(true);
                  }}
                  style={{
                    borderWidth: 0.5,
                    borderColor: '#707070',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  <Text>{moment(endDate).format('DD-MMM-YYYY')}</Text>
                </Pressable>
              </View>
            </View> */}
              {template && template.length ? (
                template.map((data, index) => {
                  const { fieldlabel, fieldvalue, fieldtype, mandatory } = data;
                  if (fieldtype === "input") {
                    return (
                      <View
                        style={{
                          marginLeft: 20,
                          marginRight: 20,
                          marginTop: 10,
                        }}
                      >
                        <TextInput
                          // onLayout={() => {
                          //   setFormData({...formDataToSend, [fieldvalue]: ''});
                          // }}
                          onChangeText={(value) => {
                            this.setState({
                              formDataToSend: {
                                ...formDataToSend,
                                [fieldvalue]: value,
                              },
                            });
                          }}
                          value={formDataToSend?.[fieldvalue]}
                          placeholder={fieldlabel}
                          style={{
                            borderWidth: 0.5,
                            borderRadius: 5,
                            borderColor: "#707070",
                            color: "#01313C",
                            paddingLeft: 10,
                            fontFamily: "Segoe_UI_semi_Bold",
                          }}
                        />
                      </View>
                    );
                  } else {
                    return (
                      <View
                      // onLayout={() => {
                      //   setFormData({...formDataToSend, [fieldvalue]: ''});
                      // }}
                      >
                        <Text
                          style={{
                            marginLeft: 20,
                            color: "#707070",
                            fontFamily: "Segoe_UI_semi_Bold",
                            marginTop: 15,
                          }}
                        >
                          Upload Id Proof
                        </Text>
                        <View
                          style={{
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 10,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                docFieldName: fieldvalue,
                              });

                              SheetManager.show("upload_sheet");
                            }}
                            editable={false}
                            style={{
                              borderWidth: 0.5,
                              borderRadius: 5,
                              height: 50,
                              borderColor: "#707070",
                              color: "#01313C",
                              paddingLeft: 10,
                              fontFamily: "Segoe_UI_semi_Bold",
                            }}
                          >
                            <Text
                              style={{
                                color: "#707070",
                                fontFamily: "Segoe_UI_semi_Bold",
                                marginTop: 15,
                              }}
                            >
                              Click here to open camera
                            </Text>
                          </TouchableOpacity>
                          {docImg ? (
                            <Image
                              style={{
                                width: 80,
                                height: 80,
                                overflow: "hidden",
                                borderWidth: 0.1,
                              }}
                              source={{ uri: docImg }}
                            />
                          ) : null}
                        </View>
                      </View>
                    );
                  }
                })
              ) : (
                <View />
              )}
              <View style={{ margin: 20, marginTop: 30 }}>
                <GradientButton
                  name="Request Pass"
                  buttonHandle={() => this.onSubmit()}
                />
              </View>
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </View>
    );
  }
}

// const RequestPass = ({ props, setIndexnNow }) => {
//   const [defaultVehicle, setDefaultVehicle] = useState({});
//   const [defaultLocation, setDefaultLocation] = useState({
//     facilityid: 0,
//     facName: "",
//     facAddress: "",
//   });
//   const [docFieldName, setDocFieldName] = useState("");
//   const [formDataToSend, setFormData] = useState({});
//   const [docFileName, setDocFileName] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalLocationVisible, setModalLocationVisible] = useState(false);
//   const [vehList, setVehList] = useState([]);
//   const [LocList, setLocList] = useState([]);
//   const [selectedLocList, setSelectedLocList] = useState({});
//   const [locationSearchText, onChangelocationSearchText] = React.useState("");
//   const [searchingText, setSearchingText] = useState(
//     "please search and select facility"
//   );
//   const [towerNoText, onChangeTowerNo] = useState("");
//   const [flatNoText, onChangeFlatNo] = useState("");
//   const [docImg, setDocImg] = useState("");
//   const [docInfo, setDocInfo] = useState({});
//   const [nameText, onChangeNameText] = React.useState("");
//   const [loader, setLoader] = useState(false);
//   const [openStartDate, setOpenStartDate] = useState(false);
//   const [openEndDate, setOpenEndDate] = useState(false);
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//   const [facilityidSearch, setfacilityidSearch] = React.useState("");
//   const { template } = selectedLocList;
//   useEffect(() => {
//     //getVehicles();
//   }, []);

//   function getVehicles() {
//     getUserData("userData").then((data) => {
//       let vehDef = { vehNo: data.defaultVehicle, vehType: data.vehicleType };
//       setDefaultVehicle(vehDef);
//       httpGet(apiName.getVehicle + Base64.decode(data.UserId)).then((res) => {
//         if (res.respCode) {
//           setVehList(res.details);
//         } else {
//           setVehList([]);
//         }
//       });
//     });
//   }

//   function openModal() {
//     setModalVisible(true);
//   }

//   function openLocationModal() {
//     setModalLocationVisible(true);
//   }

//   function setVehicle(item) {
//     console.log("item", item);
//     getUserData("userData").then((res) => {
//       var a = res;
//       a["defaultVehicle"] = item["vehRegNumber"];
//       a["vehicleType"] = item["vehicleType"];
//       storeUserData("userData", a);
//       let vehDef = {
//         vehNo: item["vehRegNumber"],
//         vehType: item["vehicleType"],
//       };
//       setDefaultVehicle(vehDef);
//       setModalVisible(false);
//     });
//   }

//   function setLocation(item) {
//     let LocDef = {
//       facilityid: item.facilityid,
//       facName: item.name,
//       facAddress: item.address,
//     };
//     console.log("setLocation", item);
//     setSelectedLocList(item);
//     setfacilityidSearch(item.facilityid);
//     setDefaultLocation(LocDef);
//     setModalLocationVisible(false);
//   }

//   const getFacilities = (id) => {
//     setSearchingText("Searching facilities...");
//     getUserData("userData").then((data) => {
//       let req = {
//         userid: Base64.decode(data.UserId),
//         search: id ? id : locationSearchText,
//       };
//       httpCall(apiName.GetFacilityListForPass, req).then((res) => {
//         if (res.respCode) {
//           setLocList(res.list);

//           if (res.list.length === 0) {
//             setSearchingText("No facility found");
//           } else {
//             setSearchingText("");
//           }
//           template &&
//             template.map((data, index) => {
//               const { fieldlabel, fieldvalue, fieldtype, mandatory } = data;
//               setFormData({ ...formDataToSend, [fieldvalue]: "" });
//             });
//         } else {
//           setLocList([]);
//           setSearchingText("No facility found.");
//         }
//       });
//     });
//   };

//   function onSubmit() {
//     for (let i = 0; i < template.length; i++) {
//       const { mandatory, fieldlabel, fieldtype, fieldvalue } = template[i];
//       const toastMessage =
//         fieldtype === "input"
//           ? `Please enter ${fieldlabel}`
//           : `Please select document`;
//       if (mandatory == true && !formDataToSend[fieldvalue]?.trim()) {
//         Toast.show(toastMessage);

//         return;
//       }
//     }
//     submit();
//   }

//   function submit() {
//     var findDate = moment("Tue Jan 01 2021 00:00:00 GMT+0530 (IST)");
//     var start = moment(startDate);
//     var end = moment(endDate);
//     let startDateTosend = start.diff(findDate, "minutes");

//     let endDateTosend = end.diff(findDate, "minutes");

//     console.log("startDateTosend", startDateTosend, "", endDateTosend); // 44700
//     console.log("first", LocList);

//     getUserData("userData").then((data) => {
//       let req = {
//         userId: Base64.decode(data.UserId),
//         facilityid: facilityidSearch,
//         VehRegNumber: defaultVehicle.vehNo,
//         bookingtype: "M",
//         fromdate: startDateTosend + 1440,
//         todate: endDateTosend + 43800 + 1440,
//         docname1: docFileName,
//       };
//       req = { ...req, ...formDataToSend };
//       console.log("toastMessage", req);

//       setLoader(true);
//       httpCall(apiName.SendPassRequets, req).then((res) => {
//         if (res.respCode == 1) {
//           console.log(res);
//           // setLocList(res.list)
//           // if (res.list.length === 0) setSearchingText("No facility found")
//           // else setSearchingText("")
//           setLoader(false);
//           Toast.show("Request Sent");
//           // alert('Request Sent');
//           setIndexnNow();
//           //props.navigation.goBack();
//         } else {
//           setLoader(false);
//           // alert(res.message);
//           Toast.show(res.message);
//           // setLocList([])
//           // setSearchingText("No facility found.")
//         }
//       });
//     });
//   }

//   function launchCamera() {
//     console.log("launchCamera");
//     SheetManager.hideAll();
//     launch_Camera().then((res) => {
//       console.log("Response:>>>>", res);
//       if (res.assets) {
//         setDocImg(res.assets[0].uri);
//         getBase64(res.assets[0].uri).then((ress) => {
//           console.log(ress);
//           // const image = {baseImg: ress, docName: res.assets[0].fileName};
//           setFormData({ ...formDataToSend, [docFieldName]: ress });
//           //setDocInfo(image);
//           setDocFileName(res.assets[0].fileName);
//         });
//       }
//     });
//   }

//   function confirm() {
//     if (defaultLocation.facilityid == 0) {
//       alert("Select Facility to continue");
//       return;
//     }

//     if (nameText == "") {
//       alert("Please Enter Name to contine");
//       return;
//     }
//     Alert.alert(
//       "Please Confirm!",
//       "Your request will be sent to facility for approval.",
//       [
//         {
//           text: "Cancel",
//           onPress: () => console.log("Cancel Pressed"),
//           style: "cancel",
//         },
//         { text: "Submit", onPress: () => submit() },
//       ]
//     );
//   }

//   function setSearchedFacility(id) {
//     setFormData({});

//     getFacilities(id);
//     setfacilityidSearch(id);
//   }
//   function goToQrScanner() {
//     props.navigation.navigate("QrScanner", {
//       setSearchedFacility: setSearchedFacility,
//     });

//     // if (defaultLocation.facilityid == 0) {
//     //   alert('Select Facility to continue');
//     //   return;
//     // }

//     // if (nameText == '') {
//     //   alert('Please Enter Name to contine');
//     //   return;
//     // }
//     // Alert.alert(
//     //   'Please Confirm!',
//     //   'Your request will be sent to facility for approval.',
//     //   [
//     //     {
//     //       text: 'Cancel',
//     //       onPress: () => console.log('Cancel Pressed'),
//     //       style: 'cancel',
//     //     },
//     //     {text: 'Submit', onPress: () => submit()},
//     //   ],
//     // );
//   }
//   function launchGallery() {
//     console.log("launchGallery");
//     SheetManager.hideAll();
//     launch_Image_Library().then((res) => {
//       console.log("Response:>>>>", res);
//       if (res.assets) {
//         setDocImg(res.assets[0].uri);
//         getBase64(res.assets[0].uri).then((ress) => {
//           console.log(ress);

//           const image = { baseImg: ress, docName: res.assets[0].fileName };
//           setFormData({ ...formDataToSend, [docFieldName]: ress });
//           //setDocInfo(image);
//           setDocFileName(res.assets[0].fileName);
//         });
//       }
//     });
//   }
//   console.log("data to send", formDataToSend);
//   return (
//     <View style={style.body}>
//       {loader ? <Loader /> : null}
//       {/* {//choosevehicle Popup} */}
//       <Overlay
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         closeOnTouchOutside
//         animationType={"zoomIn"}
//         childrenWrapperStyle={{ borderWidth: 1, borderRadius: 5 }}
//       >
//         <View style={{ width: "100%" }}>
//           <View style={{ flexDirection: "row" }}>
//             <Text
//               style={{
//                 fontFamily: "Segoe_UI_semi_Bold",
//                 color: "#707070",
//                 fontSize: 16,
//                 paddingLeft: 20,
//               }}
//             >
//               Choose Vehicle
//             </Text>
//             <TouchableOpacity
//               style={{ position: "absolute", right: 0, top: -5 }}
//               onPress={() => {
//                 setModalVisible(false);
//               }}
//             >
//               <Image
//                 style={{ width: 30, height: 30 }}
//                 source={require("../../../assets/imgs/close.png")}
//               />
//             </TouchableOpacity>
//           </View>
//           <ScrollView style={{ marginTop: 10, marginBottom: 20 }}>
//             {vehList.map((veh) => (
//               <VehicleList
//                 vehRegNumber={veh.vehRegNumber}
//                 vehicleType={veh.vehicleType}
//                 defaultVehicle={defaultVehicle}
//                 setVehicle={setVehicle}
//                 data={veh}
//                 key={veh.id}
//               />
//             ))}
//           </ScrollView>
//         </View>
//       </Overlay>

//       {/* {//chooseLocation Popup} */}
//       <Overlay
//         visible={modalLocationVisible}
//         onClose={() => setModalLocationVisible(false)}
//         closeOnTouchOutside
//         animationType={"zoomIn"}
//         childrenWrapperStyle={{ borderWidth: 1, borderRadius: 5 }}
//       >
//         <View style={{ width: "100%", height: "100%" }}>
//           <View style={{ flexDirection: "row" }}>
//             <Text
//               style={{
//                 fontFamily: "Segoe_UI_semi_Bold",
//                 color: "#707070",
//                 fontSize: 16,
//                 paddingLeft: 20,
//               }}
//             >
//               Search Location
//             </Text>
//             <TouchableOpacity
//               style={{ position: "absolute", right: 0, top: -5 }}
//               onPress={() => {
//                 setModalLocationVisible(false);
//               }}
//             >
//               <Image
//                 style={{ width: 30, height: 30 }}
//                 source={require("../../../assets/imgs/close.png")}
//               />
//             </TouchableOpacity>
//           </View>
//           <View
//             style={{
//               flexDirection: "row",
//               paddingTop: 30,
//               marginBottom: 10,
//               justifyContent: "space-between",
//               width: "100%",
//             }}
//           >
//             <TextInput
//               onChangeText={onChangelocationSearchText}
//               value={locationSearchText}
//               style={{
//                 borderWidth: 0.5,
//                 borderRadius: 5,
//                 width: "68%",
//                 height: 45,
//                 borderColor: "#707070",
//                 color: "#01313C",
//                 paddingLeft: 10,
//                 fontFamily: "Segoe_UI_semi_Bold",
//               }}
//             />
//             <GradientButton
//               name="   Search   "
//               buttonHandle={() => getFacilities("")}
//             />
//           </View>
//           <ScrollView style={{ marginTop: 10, marginBottom: 20 }}>
//             {LocList.length > 0 ? (
//               LocList.map((loc) => (
//                 <LocationList
//                   name={loc.name}
//                   address={loc.address}
//                   facilityid={loc.facilityid}
//                   data={loc}
//                   key={loc.facilityid}
//                   setLocation={setLocation}
//                 />
//               ))
//             ) : (
//               <Text
//                 style={{
//                   textAlign: "center",
//                   color: "#01313C",
//                   fontFamily: "Segoe_UI_semi_Bold",
//                 }}
//               >
//                 {searchingText}
//               </Text>
//             )}
//           </ScrollView>
//         </View>
//       </Overlay>

//       {/* {//Choose upload way Popup} */}
//       <ActionSheet id="upload_sheet">
//         <View style={{ flexDirection: "column" }}>
//           <View style={style.menuView}>
//             <Image
//               style={style.menuIcon}
//               source={require("../../../assets/imgs/camera.png")}
//             />
//             <Text style={style.menuText} onPress={() => launchCamera()}>
//               Upload From Camera
//             </Text>
//             <Image
//               style={style.menuIconBack}
//               source={require("../../../assets/imgs/whitebackbutton.png")}
//             />
//           </View>
//           <View style={style.menuView}>
//             <Image
//               style={style.menuIcon}
//               source={require("../../../assets/imgs/gallery.png")}
//             />
//             <Text style={style.menuText} onPress={() => launchGallery()}>
//               Upload From Gallery
//             </Text>
//             <Image
//               style={style.menuIconBack}
//               source={require("../../../assets/imgs/whitebackbutton.png")}
//             />
//           </View>
//         </View>
//       </ActionSheet>

//       <ScrollView>
//         <SelectVehicle data={defaultVehicle} openModal={openModal} />
//         <Pressable
//           onPress={() => {
//             props.navigation.navigate("AddVehicle", { from: "RequestPass" });
//           }}
//           style={{
//             width: "100%",
//             justifyContent: "center",
//             alignItems: "center",
//             marginTop: 10,
//           }}
//         >
//           <Text
//             style={{
//               color: "blue",
//               fontFamily: "Segoe_UI_semi_Bold",
//               textDecorationLine: "underline",
//             }}
//           >
//             Add New Vehicle
//           </Text>
//         </Pressable>
//         {/* {defaultLocation.facilityid == 0 ? (
//           <View style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
//             <TouchableOpacity
//               onPress={() => openLocationModal()}
//               editable={false}
//               style={{
//                 borderWidth: 0.5,
//                 borderRadius: 5,
//                 height: 50,
//                 borderColor: '#707070',
//                 color: '#01313C',
//                 paddingLeft: 10,
//                 fontFamily: 'Segoe_UI_semi_Bold',
//               }}></TouchableOpacity>
//           </View>
//         ) : (
//           <SelectLocation
//             openModal={openLocationModal}
//             defaultLocation={defaultLocation}
//           />
//         )} */}
//         <View
//           style={{
//             flexDirection: "row",
//             width: "100%",
//             marginTop: 15,
//             justifyContent: "space-evenly",
//           }}
//         >
//           <View style={{ width: "45%" }}>
//             <GradientButton
//               name="Scan QR"
//               buttonHandle={() => goToQrScanner()}
//             />
//           </View>

//           <View style={{ width: "45%" }}>
//             <GradientButton
//               name="Search facility"
//               buttonHandle={() => openLocationModal()}
//             />
//           </View>
//         </View>

//         <View
//           style={{
//             width: "100%",
//             justifyContent: "center",
//             alignItems: "center",
//             marginTop: 5,
//           }}
//         >
//           <Text
//             style={{
//               fontFamily: "Segoe_UI_semi_Bold",
//               color: "grey",
//               fontSize: 12,
//             }}
//           >
//             Search/Scan QR for the facility you are requesting
//           </Text>
//         </View>

//         {openStartDate ? (
//           <DatePicker
//             modal
//             minimumDate={new Date("2021-01-01")}
//             //maximumDate={currentDate}
//             open={openStartDate}
//             date={startDate}
//             mode={"date"}
//             onConfirm={(date) => {
//               setStartDate(date);
//               setOpenStartDate(false);
//             }}
//             onCancel={() => {
//               setOpenStartDate(false);
//             }}
//           />
//         ) : (
//           <View />
//         )}

//         {openEndDate ? (
//           <DatePicker
//             modal
//             minimumDate={startDate}
//             //maximumDate={currentDate}
//             open={openEndDate}
//             date={endDate}
//             mode={"date"}
//             onConfirm={(date) => {
//               setEndDate(date);
//               setOpenEndDate(false);
//             }}
//             onCancel={() => {
//               setOpenEndDate(false);
//             }}
//           />
//         ) : (
//           <View />
//         )}

//         {facilityidSearch ? (
//           <View>
//             <View
//               style={{
//                 width: "100%",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 marginTop: 5,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 16,
//                   color: "#000000",
//                   fontFamily: "Segoe_UI_semi_Bold",
//                   marginTop: 15,
//                 }}
//               >
//                 {LocList.length
//                   ? `Facility Name - ${selectedLocList["name"]}`
//                   : ""}
//               </Text>
//             </View>
//             {/* <View
//               style={{
//                 width: '100%',
//                 flexDirection: 'row',
//                 justifyContent: 'space-evenly',
//               }}>
//               <View style={{width: '40%'}}>
//                 <Text
//                   style={{
//                     color: '#707070',
//                     fontFamily: 'Segoe_UI_semi_Bold',
//                     marginTop: 10,
//                   }}>
//                   Start Date
//                 </Text>
//                 <Pressable
//                   onPress={() => {
//                     setOpenStartDate(true);
//                   }}
//                   style={{
//                     borderWidth: 0.5,
//                     borderColor: '#707070',
//                     padding: 10,
//                     borderRadius: 5,
//                   }}>
//                   <Text>{moment(startDate).format('DD-MMM-YYYY')}</Text>
//                 </Pressable>
//               </View>
//               <View style={{width: '40%'}}>
//                 <Text
//                   style={{
//                     color: '#707070',
//                     fontFamily: 'Segoe_UI_semi_Bold',
//                     marginTop: 10,
//                   }}>
//                   End Date
//                 </Text>
//                 <Pressable
//                   onPress={() => {
//                     setOpenEndDate(true);
//                   }}
//                   style={{
//                     borderWidth: 0.5,
//                     borderColor: '#707070',
//                     padding: 10,
//                     borderRadius: 5,
//                   }}>
//                   <Text>{moment(endDate).format('DD-MMM-YYYY')}</Text>
//                 </Pressable>
//               </View>
//             </View> */}
//             {template && template.length ? (
//               template.map((data, index) => {
//                 const { fieldlabel, fieldvalue, fieldtype, mandatory } = data;
//                 if (fieldtype === "input") {
//                   return (
//                     <View
//                       style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}
//                     >
//                       <TextInput
//                         // onLayout={() => {
//                         //   setFormData({...formDataToSend, [fieldvalue]: ''});
//                         // }}
//                         onChangeText={(value) => {
//                           setFormData({
//                             ...formDataToSend,
//                             [fieldvalue]: value,
//                           });
//                         }}
//                         value={formDataToSend?.[fieldvalue]}
//                         placeholder={fieldlabel}
//                         style={{
//                           borderWidth: 0.5,
//                           borderRadius: 5,
//                           borderColor: "#707070",
//                           color: "#01313C",
//                           paddingLeft: 10,
//                           fontFamily: "Segoe_UI_semi_Bold",
//                         }}
//                       />
//                     </View>
//                   );
//                 } else {
//                   return (
//                     <View
//                     // onLayout={() => {
//                     //   setFormData({...formDataToSend, [fieldvalue]: ''});
//                     // }}
//                     >
//                       <Text
//                         style={{
//                           marginLeft: 20,
//                           color: "#707070",
//                           fontFamily: "Segoe_UI_semi_Bold",
//                           marginTop: 15,
//                         }}
//                       >
//                         Upload Id Proof
//                       </Text>
//                       <View
//                         style={{
//                           marginLeft: 20,
//                           marginRight: 20,
//                           marginTop: 10,
//                         }}
//                       >
//                         <TouchableOpacity
//                           onPress={() => {
//                             setDocFieldName(fieldvalue);
//                             SheetManager.show("upload_sheet");
//                           }}
//                           editable={false}
//                           style={{
//                             borderWidth: 0.5,
//                             borderRadius: 5,
//                             height: 50,
//                             borderColor: "#707070",
//                             color: "#01313C",
//                             paddingLeft: 10,
//                             fontFamily: "Segoe_UI_semi_Bold",
//                           }}
//                         >
//                           <Text
//                             style={{
//                               color: "#707070",
//                               fontFamily: "Segoe_UI_semi_Bold",
//                               marginTop: 15,
//                             }}
//                           >
//                             Click here to open camera
//                           </Text>
//                         </TouchableOpacity>
//                         {docImg ? (
//                           <Image
//                             style={{
//                               width: 80,
//                               height: 80,
//                               overflow: "hidden",
//                               borderWidth: 0.1,
//                             }}
//                             source={{ uri: docImg }}
//                           />
//                         ) : null}
//                       </View>
//                     </View>
//                   );
//                 }
//               })
//             ) : (
//               <View />
//             )}
//             <View style={{ margin: 20, marginTop: 30 }}>
//               <GradientButton
//                 name="Request Pass"
//                 buttonHandle={() => onSubmit()}
//               />
//             </View>
//           </View>
//         ) : (
//           <View />
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
        // backgroundColor: '#00000059',
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 3,
        flex: 1,
      }}
    >
      <ActivityIndicator size="large" color="#770EC1" />
    </View>
  );
};

const LocationList = ({ name, address, facilityid, data, setLocation }) => {
  return (
    <TouchableOpacity onPress={() => setLocation(data)}>
      <View style={{ paddingLeft: 20, paddingTop: 30, borderRadius: 10 }}>
        <Text style={{ fontFamily: "Segoe_UI_semi_Bold" }}>{name}</Text>
        <Text style={{ fontFamily: "Segoe_UI_Regular", paddingTop: 5 }}>
          {address}
        </Text>
        {/* <Image source={vehicleType == 1 ? require("../../../assets/imgs/Sccoter_big.png") : require("../../../assets/imgs/carVector.png")} style={{
          width: 90,
          height: 90,
          position: 'absolute',
          resizeMode: 'contain',
          right: 30,
        }} /> */}
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
  );
};

const VehicleList = ({
  vehRegNumber,
  vehicleType,
  defaultVehicle,
  setVehicle,
  data,
}) => {
  return (
    <TouchableOpacity onPress={() => setVehicle(data)}>
      <View
        style={{
          paddingLeft: 20,
          paddingTop: 30,
          borderRadius: 10,
          backgroundColor:
            defaultVehicle.vehNo == vehRegNumber ? "#CFFCB2" : "#FFF",
        }}
      >
        <Text style={{ fontFamily: "Segoe_UI_semi_Bold" }}>
          Registration No
        </Text>
        <Text style={{ fontFamily: "Segoe_UI_Regular", paddingTop: 5 }}>
          {vehRegNumber}
        </Text>
        <Image
          source={
            vehicleType == 1
              ? require("../../../assets/imgs/Sccoter_big.png")
              : require("../../../assets/imgs/carVector.png")
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
  );
};

const SelectLocation = ({ openModal, defaultLocation }) => {
  return (
    <TouchableOpacity
      onPress={() => openModal()}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 20,
        marginRight: 20,
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
        paddingBottom: 10,
      }}
    >
      <View>
        <View style={{ flexDirection: "row" }}>
          <Text style={style.loadingText}>{defaultLocation.facName}</Text>
          <Image
            style={[style.imgBook, { marginTop: 9 }]}
            source={require("../../../assets/imgs/bookDetails.png")}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Image
            style={style.imgLoc}
            source={require("../../../assets/imgs/location.png")}
          />
          <Text style={[style.vehText, { marginRight: 40 }]}>
            {defaultLocation.facAddress}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SelectVehicle = ({ data, openModal }) => {
  return (
    <TouchableOpacity
      onPress={() => openModal()}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 20,
        marginRight: 20,
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
        paddingBottom: 10,
        marginTop: 10,
      }}
    >
      <View>
        <View style={{ flexDirection: "row" }}>
          <Text style={style.vehText}>Vehicle No</Text>
          <Image
            style={style.imgBook}
            source={require("../../../assets/imgs/bookDetails.png")}
          />
        </View>
        <Text style={style.loadingText}>{data.vehNo}</Text>
      </View>
      <Image
        style={style.img}
        source={
          data.vehType == 1
            ? require("../../../assets/imgs/Sccoter_big.png")
            : require("../../../assets/imgs/carVector.png")
        }
      />
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  body: { padding: 10, flex: 1, backgroundColor: "#fff", marginTop: 10 },
  loadingText: {
    fontFamily: "Segoe_UI_semi_Bold",
    color: "#01313C",
    fontSize: 16,
    marginTop: 3,
  },
  vehText: { fontFamily: "Segoe_UI_Regular", color: "#04093F", fontSize: 14 },
  img: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    position: "absolute",
    right: 0,
    top: -30,
  },
  imgBook: { width: 15, height: 15, resizeMode: "contain", marginLeft: 10 },
  imgLoc: {
    width: 15,
    height: 15,
    resizeMode: "contain",
    marginRight: 5,
    marginTop: 2,
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
});

export default RequestPass;
