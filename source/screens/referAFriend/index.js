import React, { Component } from "react";
import {
  BackHandler,
  SafeAreaView,
  Image,
  StatusBar,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import global from "../../themes/global";
var close = require("../../../assets/imgs/close.png");
import Overlay from "react-native-modal-overlay";
import CommanServices from "../../utils/comman";
var commanService = new CommanServices();
var money = require("../../../assets/imgs/money.png");
const { width } = Dimensions.get("window");
var dummy1 = require("../../../assets/imgs/dummy1.jpg");
var dummy2 = require("../../../assets/imgs/dummy2.jpg");
var dummy3 = require("../../../assets/imgs/dummy3.jpg");
var dummy4 = require("../../../assets/imgs/dummy4.jpg");
var dummy5 = require("../../../assets/imgs/dummy5.jpg");
var success = require("../../../assets/imgs/success.png");
var threeDots = require("../../../assets/imgs/threeDots.png");
var backbutton = require("../../../assets/imgs/backbutton.png");
var parkingImg2 = require("../../../assets/imgs/parkingImg2.png");
import Popover from "react-native-popover-view";
import { url, apiName } from "../../../Config";
import RestApi from "../../utils/restapii";
import fonts from "../../themes/fonts";
import colorCodes from "../../themes/colorCodes";
var restApi = new RestApi();

export default class ReferAFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      mobile: "",
      active: 0,
      xTabOne: 0,
      xTabTwo: 0,
      translateX: new Animated.Value(0),
      translateXTabOne: new Animated.Value(0),
      translateXTabTwo: new Animated.Value(width),
      translateY: -1000,
      refCode: "",
      users: [
        {
          id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
          title: "9214000059",
        },
        {
          id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
          title: "9915159090",
        },
        {
          id: "58694a0f-3da1-471f-bd96-145571e29d72",
          title: "9465573210",
        },
      ],
      pastDetails: [
        {
          id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
          title: "9999999999",
        },
        {
          id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
          title: "9214005959",
        },
      ],
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.getData();
  }

  handleSlide = (type) => {
    let {
      active,
      xTabOne,
      xTabTwo,
      translateX,
      translateXTabOne,
      translateXTabTwo,
    } = this.state;
    Animated.spring(translateX, {
      toValue: type,
      duration: 100,
    }).start();
    if (active === 0) {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: 0,
          duration: 100,
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: width,
          duration: 100,
        }).start(),
      ]);
    } else {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: -width,
          duration: 100,
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: 0,
          duration: 100,
        }).start(),
      ]);
    }
  };

  getData() {
    commanService.getData("userData").then((res) => {
      console.log(res);
      var a = res;
      console.log("first", res["RefCode"]);
      this.setState({
        name: res["name"],
        mobile: res["Mobile"],
        refCode: res["RefCode"],
      });
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    this.props.navigation.replace("Home");
    return true;
  };

  goToDetails(item) {
    this.props.navigation.navigate("ParkingDetails", { data: item });
  }

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",

          shadowColor: "#00000057",
          borderColor: "#00000057",
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
          borderBottomRightRadius: 5,
          height: 60,

          borderBottomLeftRadius: 5,
          marginTop: 5,
          alignItems: "center",
          alignContent: "center",
        }}
        // onPress={() => this.goToDetails(item)}
      >
        {/* <View style={{ width: 50, height: 100, paddingLeft: 20,backgroundColor:'blue' }} > */}
        {/* <Image
                        style={{
                            width: 100,
                            height: 100, resizeMode: 'contain',
                        }}
                        source={parkingImg1}
                    /> */}
        {/* </View> */}
        <View
          style={{
            marginTop: 0,
            marginLeft: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Image
            style={{
              width: 60,
              height: 60,
              resizeMode: "contain",
              marginRight: 20,
              borderRadius: 200 / 2,
              overflow: "hidden",
              borderWidth: 0.1,
            }}
            source={dummy1}
          />
          <Text
            style={{
              fontFamily: "Segoe_UI_Regular",
              fontSize: 16,
              color: "#04093F",
              textAlign: "left",
              marginLeft: -80,
              marginTop: -20,
            }}
          >
            {item.title}
          </Text>

          <View style={{ flexDirection: "column", paddingRight: 30 }}>
            <Text
              style={{
                fontFamily: "Segoe_UI_Regular",
                fontSize: 14,
                color: "#04093F",
                lineHeight: 22,
                marginTop: -5,
              }}
            >
              Pending
            </Text>
          </View>
        </View>

        {/* <View
          style={{
            position: 'absolute',
            width: '90%',
            paddingLeft: 85,
            top: 30,
          }}>
          <Rating
                        type='star'
                        ratingCount={5}
                        imageSize={10}
                        startingValue={3}
                        style={{ left: -65, }}
                        readonly={true}
                    // onFinishRating={this.ratingCompleted}
                    />
          <Text
            style={{
              fontFamily: 'Segoe_UI_Regular',
              fontSize: 12,
              color: '#04093F',
            }}>
            {'Pune'}
          </Text>
          <Text
            style={{
              fontFamily: 'Segoe_UI_Bold',
              fontSize: 16,
              color: '#04093F',
              paddingTop: 5,
            }}>
            {'₹50.00'}
          </Text>
        </View> */}
      </TouchableOpacity>
    );
  };

  _renderPastItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          // borderWidth: 1,
          // margin:20,
          // elevation: 5,
          // shadowOffset: { width: 0, height: 1 },
          // shadowOpacity: 0.8,
          // shadowRadius: 1,
          shadowColor: "#00000057",
          borderColor: "#00000057",
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
          borderBottomRightRadius: 5,
          height: 60,
          // width: 320,
          // marginBottom: 5,
          borderBottomLeftRadius: 5,
          marginTop: 5,
          alignItems: "center",
          alignContent: "center",
        }}
        // onPress={() => this.goToDetails(item)}
      >
        {/* <View style={{ width: 50, height: 100, paddingLeft: 20,backgroundColor:'blue' }} > */}
        {/* <Image
                        style={{
                            width: 100,
                            height: 100, resizeMode: 'contain',
                        }}
                        source={parkingImg1}
                    /> */}
        {/* </View> */}
        <View
          style={{
            marginTop: 0,
            marginLeft: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Image
            style={{
              width: 60,
              height: 60,
              resizeMode: "contain",
              marginRight: 20,
              borderRadius: 200 / 2,
              overflow: "hidden",
              borderWidth: 0.1,
            }}
            source={dummy1}
          />
          <Text
            style={{
              fontFamily: "Segoe_UI_Regular",
              fontSize: 16,
              color: "#04093F",
              textAlign: "left",
              marginLeft: -80,
              marginTop: -20,
            }}
          >
            {item.title}
          </Text>
          {/* <Text style={{ fontFamily: 'Segoe_UI_Bold', fontSize: 16, color: '#04093F' }}>{item.distance.toFixed(2)+"Km"}</Text> */}
          {/* <Image
                    style={{
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                      marginRight: -100
        
                    }}
                    source={medal_blue}
                  /> */}
          <View style={{ flexDirection: "column", paddingRight: 30 }}>
            {/* <Text style={{ fontFamily: 'Segoe_UI_Bold', fontSize: 16, color: '#04093F', lineHeight: 22 }}>280</Text> */}
            <Text
              style={{
                fontFamily: "Segoe_UI_Regular",
                fontSize: 14,
                color: "#04093F",
                lineHeight: 22,
                marginTop: -5,
              }}
            >
              Completed
            </Text>
          </View>
        </View>

        {/* <View
          style={{
            position: 'absolute',
            width: '90%',
            paddingLeft: 85,
            top: 30,
          }}>
          <Rating
                        type='star'
                        ratingCount={5}
                        imageSize={10}
                        startingValue={3}
                        style={{ left: -65, }}
                        readonly={true}
                    // onFinishRating={this.ratingCompleted}
                    />
          <Text
            style={{
              fontFamily: 'Segoe_UI_Regular',
              fontSize: 12,
              color: '#04093F',
            }}>
            {'Pune'}
          </Text>
          <Text style={{ fontFamily: 'Segoe_UI_Bold', fontSize: 16, color: '#04093F', paddingTop: 5 }}>{'₹50.00'}</Text>
        </View> */}
      </TouchableOpacity>
    );
  };

  render() {
    let {
      xTabOne,
      xTabTwo,
      translateX,
      active,
      translateXTabOne,
      translateXTabTwo,
      translateY,
      refCode,
    } = this.state;
    return (
      <SafeAreaView>
        {this.state.showLoader ? (
          <View style={global.loaderStyle}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : null}
        <StatusBar
          backgroundColor={"#fff"}
          barStyle={"dark-content"}
          translucent={false}
        />
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
                {"Refer & Earn Terms & Conditions"}
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
            <Text style={[styles.tcHeading, { marginTop: 10 }]}>
              Please find below the conditions for refer and earn.
            </Text>
            {/* <Text style={[styles.tcHeading]}>To cancel before parking start time:</Text> */}
            <Text style={styles.tcPara}>
              1. Customers will be eligible to earn free parking/scratch
              car/discount vouchers or anything similar on successful referral
            </Text>
            <Text style={styles.tcPara}>
              {
                "2. Management has right to decide the reward models from the above mentioned options"
              }
            </Text>
            <Text style={styles.tcPara}>
              3. Customers will be receiving the reward only after successful
              referrals will complete a parking payment with us.{" "}
            </Text>
            <Text style={styles.tcPara}>
              4. Customer will not receive any reward if referral does not
              complete a successful parking payment
            </Text>
            <Text style={styles.tcPara}>
              5. Referral should book and pay for parking using mobile app. Any
              other form of booking will not be eligible for earning referral
              bonus.{" "}
            </Text>
            <Text style={styles.tcPara}>
              5. Referral should book and pay for parking using mobile app. Any
              other form of booking will not be eligible for earning referral
              bonus.{" "}
            </Text>
            <Text style={styles.tcPara}>
              6. Customer will be applicable to get a 1 hour of free parking (up
              to 30 rs) for each 2 successful referrals.{" "}
            </Text>
            <Text style={styles.tcPara}>
              {
                "7. Customer will be receiving voucher to use that for upcoming parking bookings."
              }
            </Text>
            <Text style={styles.tcPara}>
              8. Reward vouchers will come with a finite timeline for use. If
              customers will not use that within mentioned time, then voucher
              will be invalid.{" "}
            </Text>
            {/* <Text style={styles.tcPara}>4. Management reserved the right to cancel and confirmed booking in case of any unwanted circumstances occur in the premises</Text>
                        <Text style={styles.tcHeading}>CANCELLATION FEES</Text>
                        <Text style={styles.tcPara}>Cancellation fees vary by city and by product. </Text> */}
            {/* <Text style={styles.tcHeading}> 3. LINKED SITES</Text>
                        <Text style={styles.tcPara}>This Site may contain links to other independent third-party Web sites ("Linked Sites”).</Text>

                        <Text style={styles.tcHeading}>4. FORWARD LOOKING STATEMENTS</Text>
                        <Text style={styles.tcPara}>All materials reproduced on this site speak as of the original date of publication or filing.</Text> */}
            {/* </ScrollView> */}
          </View>
        </Overlay>
        <View style={styles.header}>
          <View
            style={styles.headerTitleWrapper}
            onPress={() => this.props.navigation.replace("Home")}
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => this.props.navigation.replace("Home")}
            >
              <Image
                onPress={() => this.select(index, item)}
                style={{
                  width: 25,
                  height: 25,
                  position: "absolute",
                }}
                source={backbutton}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerTitleText,
                { zIndex: 100, marginTop: 7, color: "#01313C" },
              ]}
            >
              {"Refer and Earn"}
            </Text>
          </View>
        </View>
        <ScrollView>
          <View>
            <View style={{ alignItems: "center" }}>
              <Image
                source={success}
                style={{
                  width: 150,
                  height: 150,
                  resizeMode: "contain",
                  zIndex: 300,
                }}
              />
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    marginTop: -20,
                    textTransform: "uppercase",
                    textAlign: "center",
                    color: colorCodes.textColor,
                  }}
                >
                  Refer & Earn{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    marginTop: -19,
                    fontSize: 16,
                    textTransform: "uppercase",
                    textAlign: "center",
                    color: colorCodes.textColor,
                  }}
                >
                  FREE PARKING
                </Text>
              </View>
            </View>
            <View
              style={{
                paddingTop: 5,
                paddingBottom: 10,
                marginLeft: 40,
                marginRight: 40,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderWidth: 1,
                  flexDirection: "row",
                  elevation: 1,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 1,
                  shadowColor: "#00000029",
                  borderColor: "#00000029",
                  borderTopRightRadius: 50,
                  borderTopLeftRadius: 50,
                  borderBottomRightRadius: 50,
                  height: 60,
                  // width: 180,
                  padding: 25,
                  marginLeft: 10,
                  backgroundColor: "#FFF",
                  borderBottomLeftRadius: 50,
                  marginTop: 5,
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      padding: 0,
                      fontFamily: fonts.semiBold,
                      fontSize: 14,
                      color: colorCodes.textColor,
                      marginTop: -3,
                      paddingLeft: 20,
                    }}
                  >
                    {refCode}
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    alignItems: "flex-end",
                    position: "absolute",
                    right: 15,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (refCode) {
                        commanService.share(
                          "Refer Code for EazyPark™",
                          "Refer Code for EazyPark™ is " + refCode,
                          refCode
                        );
                      }
                    }}
                    style={{
                      borderWidth: 0,
                      borderColor: "#A3BCD5",
                      backgroundColor: "#FFF",
                      borderTopRightRadius: 5,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.bold,
                        color: colorCodes.primaryColor,
                        padding: 7,
                        paddingRight: 15,
                        paddingLeft: 15,
                        fontSize: 16,
                      }}
                    >
                      Refer
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{ marginLeft: 10, marginRight: 10, paddingBottom: 10 }}
            >
              {/* <TouchableOpacity
                onPress={() => {
                  this.setState({modalprivacyVisible: true});
                }}
                style={{
                  flexDirection: 'row',
                  height: 30,
                  backgroundColor: '#FFF',
                  borderBottomLeftRadius: 5,
                  marginTop: 5,
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    padding: 0,
                    fontFamily: 'Segoe_UI_Regular',
                    fontSize: 12,
                    color: colorCodes.textColor,
                    color: colorCodes.textColor,
                    marginTop: -43,
                    textAlign: 'center',
                  }}>
                  Win Parking after successful referral completion.
                </Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{
                  zIndex: 200,
                  justifyContent: "center",
                  alignContent: "center",
                  alignSelf: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  onPress={() => {
                    this.setState({ modalprivacyVisible: true });
                  }}
                  style={{
                    padding: 0,
                    fontFamily: "Segoe_UI_Bold",
                    fontSize: 12,
                    color: colorCodes.textColor,

                    textAlign: "center",
                    borderBottomWidth: 1,
                    borderColor: "#00000029",
                  }}
                >
                  Terms and conditions
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  paddingTop: -120,
                  marginRight: 10,
                  borderBottomWidth: 1,
                  borderColor: "#00000029",
                  paddingBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    color: colorCodes.textColor,
                    padding: 7,
                    paddingLeft: 13,
                  }}
                >
                  Successful Refer Count:{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    color: colorCodes.textColor,
                    fontSize: 16,
                    marginTop: 5,
                    marginLeft: -3,
                  }}
                >
                  0
                </Text>
              </View>
            </View>

            {/* <View style={{marginLeft: 15}}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  color: colorCodes.textColor,
                  textAlign: 'center',
                }}>
                Referal Table{' '}
              </Text>
              <View style={{flex: 1}}>
                <View
                  style={{
                    width: '90%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      marginBottom: 20,
                      height: 36,
                      position: 'relative',
                    }}>
                    <Animated.View
                      style={{
                        position: 'absolute',
                        width: '50%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        // backgroundColor: "#FFF",
                        borderRadius: 4,
                        transform: [
                          {
                            translateX,
                          },
                        ],
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: active === 0 ? 4 : 2,
                        borderBottomColor: active === 0 ? '#770EC1' : '#D8F6F2',
                        // borderRadius: 4,
                        borderRightWidth: 0,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      onLayout={(event) =>
                        this.setState({
                          xTabOne: event.nativeEvent.layout.x,
                        })
                      }
                      onPress={() =>
                        this.setState({active: 0}, () =>
                          this.handleSlide(xTabOne),
                        )
                      }>
                      <Text
                        style={{
                          color: active === 0 ? '#770EC1' : '#01313C',
                          fontFamily: 'Segoe_UI_Regular',
                        }}>
                        Pending
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: active === 1 ? 4 : 2,
                        borderBottomColor: active === 1 ? '#770EC1' : '#D8F6F2',
                        borderLeftWidth: 0,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                      onLayout={(event) =>
                        this.setState({
                          xTabTwo: event.nativeEvent.layout.x,
                        })
                      }
                      onPress={() =>
                        this.setState({active: 1}, () =>
                          this.handleSlide(xTabTwo),
                        )
                      }>
                      <Text
                        style={{
                          color: active === 1 ? '#770EC1' : '#01313C',
                          fontFamily: 'Segoe_UI_Regular',
                        }}>
                        Completed
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView>
                    <Animated.View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: [
                          {
                            translateX: translateXTabOne,
                          },
                        ],
                      }}
                      onLayout={(event) =>
                        this.setState({
                          translateY: event.nativeEvent.layout.height,
                        })
                      }>
                      <View>
                        <FlatList
                          data={this.state.users}
                          renderItem={this._renderItem}
                          keyExtractor={(item) => item.id}
                        />
                      </View>
                    </Animated.View>

                    <Animated.View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: [
                          {
                            translateX: translateXTabTwo,
                          },
                          {
                            translateY: -translateY,
                          },
                        ],
                      }}>
                      <View>
                        <FlatList
                          data={this.state.pastDetails}
                          renderItem={this._renderPastItem}
                          keyExtractor={(item) => item.id}
                        />
                      </View>
                    </Animated.View>
                  </ScrollView>
                </View>
              </View>
            </View> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colorCodes.colorWhite,
    height: 50,
    alignItems: "flex-start",
    justifyContent: "center",
    // paddingHorizontal: 20
  },
  headerTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    // top: -70,
    left: 10,
  },
  headerTitleText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colorCodes.colorWhite,
  },
  backBtn: {
    width: 20,
    height: 20,
    marginTop: 2,
    marginRight: 10,
    zIndex: 100,
  },
  backBtnIcon: {
    fontSize: 20,
    lineHeight: 20,
    color: colorCodes.backButtonColor,
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
