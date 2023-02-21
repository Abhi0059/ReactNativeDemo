import React, { useState } from "react";
import colorCodes from "../../themes/colorCodes";
import fonts from "../../themes/fonts";
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
  Linking,
} from "react-native";
import Share from "react-native-share";
var backbutton = require("../../../assets/imgs/backbutton.png");
var uploadLicense = require("../../../assets/imgs/improvment.png");
var verifyVehicle = require("../../../assets/imgs/connectUs.png");
var addVehicle = require("../../../assets/imgs/topQuestions.png");
import DropDownPicker from "react-native-dropdown-picker";
var greybackbutton = require("../../../assets/imgs/backbutton.png");
import Accordion from "react-native-collapsible-accordion";
import Textarea from "react-native-textarea";
import CommanServices from "../../utils/comman";
var commanService = new CommanServices();
var nav;
const ContactUs = (props) => {
  nav = props;
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showConnectUs, setShowConnectUs] = useState(false);
  const [showImprovements, setShowImprovements] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [subject, setSubject] = useState("Regarding App Improvement");
  const [msg, setMsg] = useState("");

  const openEmail = async () => {
    const shareOptions = {
      title: "Share via",
      message: "Type your message here...",
      email: "incubermax@gmail.com",
      subject: "Support at Eazy Park",
      social: Share.Social.EMAIL,
    };
    const shareResponse = await Share.shareSingle(shareOptions);
  };

  const callUs = () => {
    Linking.openURL("tel:18000000000");
  };

  return (
    <SafeAreaView style={{ backgroundColor: colorCodes.colorWhite }}>
      <StatusBar
        backgroundColor={colorCodes.colorWhite}
        barStyle={"dark-content"}
        translucent={false}
      />
      <View>
        <ScrollView style={{ height: "100%" }}>
          <View>
            <View style={styles.header}>
              <View
                style={styles.headerTitleWrapper}
                onPress={() => props.navigation.replace("Dashboard")}
              >
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => props.navigation.replace("Dashboard")}
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
                  {"Contact Us"}
                </Text>
              </View>
            </View>
            <View>
              <View
                style={{ paddingBottom: 50, marginRight: 20, marginLeft: 15 }}
              >
                <View style={styles.container}>
                  <Accordion
                    onChangeVisibility={(value) => {
                      setShowMoreInfo(value);
                    }}
                    renderHeader={() => (
                      <View style={styles.wrapDropDownHeader}>
                        <View style={{ paddingLeft: 10 }}>
                          <Image
                            style={{
                              width: 30,
                              height: 30,
                              resizeMode: "contain",
                            }}
                            source={addVehicle}
                          />
                        </View>
                        <Text style={styles.moreInfoText}>Top Questions</Text>
                        <View
                          style={{
                            width: "100%",
                            alignItems: "flex-end",
                            paddingRight: 170,
                          }}
                        >
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                              resizeMode: "contain",
                              transform: [
                                { rotate: showMoreInfo ? "270deg" : "180deg" },
                              ],
                            }}
                            source={greybackbutton}
                          />
                        </View>
                      </View>
                    )}
                    renderContent={() => (
                      <View>
                        <Accordion
                          onChangeVisibility={(value) => {
                            // setShowMoreInfo(value)
                          }}
                          renderHeader={() => (
                            <View
                              style={[
                                {
                                  borderLeftWidth: 3,
                                  borderLeftColor: colorCodes.primaryColor,
                                  marginLeft: 12,
                                  marginTop: 5,
                                  marginBottom: 5,
                                  borderTopLeftRadius: 3,
                                  borderBottomLeftRadius: 3,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.moreInfoText,
                                  { fontFamily: fonts.semiBold },
                                ]}
                              >
                                1. Not able to book parking using app?
                              </Text>
                              {/* <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 10, }}>
                                <Image
                                  style={{
                                    width: 25,
                                    height: 25, resizeMode: 'contain',
                                    transform: [{ rotate: showMoreInfo ? '270deg' : '180deg' }],
                                  }}
                                  source={greybackbutton}
                                />
                              </View> */}
                            </View>
                          )}
                          renderContent={() => (
                            <View
                              style={{
                                marginLeft: 10,
                                backgroundColor: "#eee",
                                paddingBottom: 10,
                              }}
                            >
                              <Text
                                style={{
                                  marginLeft: 10,
                                  fontFamily: fonts.regular,
                                }}
                              >
                                The car owner enters the vehicle number in the
                                app and books a spot. When he reaches the
                                parking lot, a sensor will read the license
                                plate and feed it in the database. The app will
                                then guide the owner to the dedicated spot.
                                Parking fee can be paid through the app itself.
                              </Text>
                            </View>
                          )}
                        />

                        <Accordion
                          onChangeVisibility={(value) => {
                            // setShowMoreInfo(value)
                          }}
                          renderHeader={() => (
                            <View
                              style={[
                                {
                                  borderLeftWidth: 3,
                                  borderLeftColor: colorCodes.primaryColor,
                                  marginLeft: 12,
                                  marginTop: 5,
                                  marginBottom: 5,
                                  borderTopLeftRadius: 3,
                                  borderBottomLeftRadius: 3,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.moreInfoText,
                                  { fontFamily: fonts.semiBold },
                                ]}
                              >
                                2. Not able to scan QR code during entry/exit?
                              </Text>
                              {/* <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 10 }}>
                                <Image
                                  style={{
                                    width: 25,
                                    height: 25, resizeMode: 'contain',
                                    transform: [{ rotate: showMoreInfo ? '270deg' : '180deg' }],
                                  }}
                                  source={greybackbutton}
                                />
                              </View> */}
                            </View>
                          )}
                          renderContent={() => (
                            <View
                              style={{
                                marginLeft: 10,
                                backgroundColor: "#eee",
                                paddingBottom: 10,
                                marginBottom: 5,
                              }}
                            >
                              <Text
                                style={{
                                  marginLeft: 10,
                                  fontFamily: fonts.regular,
                                }}
                              >
                                Your phone's camera may have trouble scanning
                                the code if it's tilted at an angle. Make sure
                                it's level with the surface that the code is
                                printed on.
                              </Text>
                            </View>
                          )}
                        />

                        <Accordion
                          onChangeVisibility={(value) => {
                            // setShowMoreInfo(value)
                          }}
                          renderHeader={() => (
                            <View
                              style={[
                                {
                                  borderLeftWidth: 3,
                                  borderLeftColor: colorCodes.primaryColor,
                                  marginTop: 5,
                                  marginBottom: 5,
                                  borderTopLeftRadius: 3,
                                  borderBottomLeftRadius: 3,
                                  marginLeft: 12,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.moreInfoText,
                                  { fontFamily: fonts.semiBold },
                                ]}
                              >
                                3. Money debited but did not receive
                                confirmation message?
                              </Text>
                              {/* <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 10 }}>
                                <Image
                                  style={{
                                    width: 25,
                                    height: 25, resizeMode: 'contain',
                                    transform: [{ rotate: showMoreInfo ? '270deg' : '180deg' }],
                                  }}
                                  source={greybackbutton}
                                />
                              </View> */}
                            </View>
                          )}
                          renderContent={() => (
                            <View
                              style={{
                                marginLeft: 10,
                                backgroundColor: "#eee",
                                paddingBottom: 10,
                                marginBottom: 5,
                              }}
                            >
                              <Text
                                style={{
                                  marginLeft: 10,
                                  fontFamily: fonts.regular,
                                }}
                              >
                                In case the order doesn't go through (i.e - you
                                don't receive an order confirmation email) but
                                you've still received a message from your bank
                                or wallet provider stating that the amount has
                                been debited, don't worry! The best course of
                                action to take is to contact the bank or the
                                wallet service provider.
                              </Text>
                            </View>
                          )}
                        />

                        <Accordion
                          onChangeVisibility={(value) => {
                            // setShowMoreInfo(value)
                          }}
                          renderHeader={() => (
                            <View
                              style={[
                                {
                                  borderLeftWidth: 3,
                                  borderLeftColor: colorCodes.primaryColor,
                                  marginTop: 5,
                                  marginBottom: 5,
                                  borderTopLeftRadius: 3,
                                  borderBottomLeftRadius: 3,
                                  marginLeft: 12,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.moreInfoText,
                                  { fontFamily: fonts.semiBold },
                                ]}
                              >
                                4. Want to cancel/modify booking?
                              </Text>
                              {/* <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 10 }}>
                                <Image
                                  style={{
                                    width: 25,
                                    height: 25, resizeMode: 'contain',
                                    transform: [{ rotate: showMoreInfo ? '270deg' : '180deg' }],
                                  }}
                                  source={greybackbutton}
                                />
                              </View> */}
                            </View>
                          )}
                          renderContent={() => (
                            <View
                              style={{
                                marginLeft: 10,
                                backgroundColor: "#eee",
                                paddingBottom: 10,
                                marginBottom: 5,
                              }}
                            >
                              <Text
                                style={{
                                  marginLeft: 10,
                                  fontFamily: fonts.regular,
                                }}
                              >
                                Yes you do have the option to rebook through
                                Booking.com - provided the inventory is
                                available. Always keep in mind that even if you
                                cancel, your room does not automatically reload
                                back onto Booking.com.
                              </Text>
                            </View>
                          )}
                        />

                        <Accordion
                          onChangeVisibility={(value) => {
                            // setShowMoreInfo(value)
                          }}
                          renderHeader={() => (
                            <View
                              style={[
                                {
                                  borderLeftWidth: 3,
                                  borderLeftColor: colorCodes.primaryColor,
                                  marginTop: 5,
                                  marginBottom: 5,
                                  borderTopLeftRadius: 3,
                                  borderBottomLeftRadius: 3,
                                  marginLeft: 12,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.moreInfoText,
                                  { fontFamily: fonts.semiBold },
                                ]}
                              >
                                5. Not able to pay via online?
                              </Text>
                              {/* <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 10 }}>
                                <Image
                                  style={{
                                    width: 25,
                                    height: 25, resizeMode: 'contain',
                                    transform: [{ rotate: showMoreInfo ? '270deg' : '180deg' }],
                                  }}
                                  source={greybackbutton}
                                />
                              </View> */}
                            </View>
                          )}
                          renderContent={() => (
                            <View
                              style={{
                                marginLeft: 10,
                                backgroundColor: "#eee",
                                paddingBottom: 10,
                                marginBottom: 5,
                              }}
                            >
                              <Text
                                style={{
                                  marginLeft: 10,
                                  fontFamily: fonts.regular,
                                }}
                              >
                                If you can't make even a single payment within
                                India, It should not happen because nowadays
                                nearly all debit cards support online payments
                              </Text>
                            </View>
                          )}
                        />
                      </View>
                    )}
                  />
                </View>
                {/* <TouchableOpacity style={{
                  borderWidth: 1,
                  flexDirection: 'row',
                  elevation: 5,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 1,
                  shadowColor: "#00000029",
                  borderColor: '#00000029',
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  height: 60,
                  marginLeft: 10,
                  backgroundColor: '#FFF',
                  borderBottomLeftRadius: 5, marginTop: 5, alignItems: 'center', alignContent: 'center',
                }}
                  onPress={() => { this.continue(); }}
                >
                  <View style={{ paddingLeft: 10 }}>
                    <Image
                      style={{
                        width: 30,
                        height: 30, resizeMode: 'contain',
                      }}
                      source={addVehicle}
                    />
                  </View>
                  <Text style={{ padding: 10, fontFamily: 'Segoe_UI_Bold', fontSize: 14, color: '#01313C', marginTop: -3, paddingLeft: 30 }}>Top Questions</Text>
                  <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 180 }}>
                    <Image
                      style={{
                        width: 30,
                        height: 30, resizeMode: 'contain',
                        transform: [{ rotate: '180deg' }],
                      }}
                      source={greybackbutton}
                    />
                  </View>
                </TouchableOpacity> */}

                <View style={{ marginRight: 30, marginLeft: 30 }}>
                  {/* <TouchableOpacity style={{
                      borderWidth: 1,
                      flexDirection: 'row',
                      elevation: 5,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.8,
                      shadowRadius: 1,
                      shadowColor: "#00000029",
                      borderColor: '#00000029',
                      borderTopRightRadius: 5,
                      borderTopLeftRadius: 5,
                      borderBottomRightRadius: 5,
                      height: 60,
                      // width: 180,
                      marginLeft: 10,
                      backgroundColor: '#FFF',
                      borderBottomLeftRadius: 5, marginTop: 5, alignItems: 'center', alignContent: 'center',
                    }}
                    onPress={() => { this.continue(); }}
                    >
                      <View style={{ paddingLeft: 10 }}>
                        <Image
                          style={{
                            width: 30,
                            height: 30, resizeMode: 'contain',
                          }}
                          source={addVehicle}
                        />
                      </View>
                      <Text style={{ padding: 10, fontFamily: 'Segoe_UI_Bold', fontSize: 14, color: '#01313C', marginTop: -3, paddingLeft: 30 }}>Top Questions</Text>
                      <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 180 }}>
                        <Image
                          style={{
                            width: 30,
                            height: 30, resizeMode: 'contain',
                            transform: [{ rotate: '180deg' }],
                          }}
                          source={greybackbutton}
                        />
                      </View>
                    </TouchableOpacity> */}
                </View>
                <Accordion
                  onChangeVisibility={(value) => {
                    setShowConnectUs(value);
                  }}
                  renderHeader={() => (
                    <View
                      style={[
                        styles.wrapDropDownHeader,
                        {
                          borderLeftWidth: 3,
                          borderLeftColor: colorCodes.primaryColor,
                        },
                      ]}
                    >
                      <View style={{ paddingLeft: 10 }}>
                        <Image
                          style={{
                            width: 25,
                            height: 25,
                            resizeMode: "contain",
                          }}
                          source={verifyVehicle}
                        />
                      </View>
                      <Text style={styles.moreInfoText}>Connect Us</Text>
                      <View
                        style={{
                          width: "100%",
                          alignItems: "flex-end",
                          paddingRight: 150,
                        }}
                      >
                        <Image
                          style={{
                            width: 25,
                            height: 25,
                            resizeMode: "contain",
                            transform: [
                              { rotate: showConnectUs ? "270deg" : "180deg" },
                            ],
                          }}
                          source={greybackbutton}
                        />
                      </View>
                    </View>
                  )}
                  renderContent={() => (
                    <View>
                      <Accordion
                        onChangeVisibility={(value) => {
                          // setShowMoreInfo(value)
                        }}
                        renderHeader={() => (
                          <View
                            style={[
                              {
                                borderLeftWidth: 3,
                                borderLeftColor: colorCodes.primaryColor,
                                marginTop: 5,
                                marginBottom: 5,
                                borderTopLeftRadius: 3,
                                borderBottomLeftRadius: 3,
                                marginLeft: 12,
                              },
                            ]}
                          >
                            <Text style={[styles.moreInfoText]}>Email</Text>
                          </View>
                        )}
                        renderContent={() => (
                          <View
                            style={{
                              marginLeft: 10,
                              backgroundColor: "#eee",
                              paddingBottom: 10,
                              marginBottom: 5,
                            }}
                          >
                            <Text
                              style={{
                                marginLeft: 10,
                                fontFamily: fonts.regular,
                              }}
                            >
                              For any issues or concerns please mail us at
                            </Text>
                            <Text
                              onPress={() => openEmail()}
                              style={{
                                marginLeft: 10,
                                fontFamily: fonts.regular,
                                color: colorCodes.primaryColor,
                              }}
                            >
                              incubermax@gmail.com
                            </Text>
                          </View>
                        )}
                      />
                      {/* 
                      <Accordion
                        onChangeVisibility={(value) => {
                          // setShowMoreInfo(value)
                        }}
                        renderHeader={() => (
                          <View style={[{ borderLeftWidth: 3, borderLeftColor: colorCodes.primaryColor, marginTop: 5, marginBottom: 5, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, marginLeft: 12 }]}>
                            <Text style={[styles.moreInfoText]}>Call
                     </Text>
                          </View>
                        )}
                        renderContent={() => (
                          <View style={{ marginLeft: 10, backgroundColor: '#eee', paddingBottom: 10, marginBottom: 5 }}>
                            <Text style={{
                              marginLeft: 10,
                              fontFamily: fonts.regular
                            }}>You can call us at our toll free number </Text>
                            <Text onPress={() => callUs()} style={{
                              marginLeft: 10,
                              fontFamily: fonts.regular,
                              color: colorCodes.primaryColor
                            }}>1800 000 0000</Text>
                          </View>
                        )}
                      /> */}

                      {/* <Accordion
                        onChangeVisibility={(value) => {
                          // setShowMoreInfo(value)
                        }}
                        renderHeader={() => (
                          <View style={[{ borderLeftWidth: 3, borderLeftColor: colorCodes.primaryColor, marginTop: 5, marginBottom: 5, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, marginLeft: 12 }]}>
                            <Text style={[styles.moreInfoText]}>Raise Ticket
                     </Text>
                          </View>
                        )}
                        renderContent={() => (
                          <View style={{ marginLeft: 10, backgroundColor: '#eee', paddingBottom: 10, marginBottom: 5 }}>
                            <Text style={{
                              marginLeft: 10,
                              fontFamily: fonts.regular
                            }}>You can call us at our toll free number 1800 000 0000</Text>
                          </View>
                        )}
                      /> */}
                    </View>
                  )}
                />

                <Accordion
                  onChangeVisibility={(value) => {
                    setShowImprovements(value);
                  }}
                  renderHeader={() => (
                    <View
                      style={[
                        styles.wrapDropDownHeader,
                        {
                          borderLeftWidth: 3,
                          borderLeftColor: colorCodes.primaryColor,
                        },
                      ]}
                    >
                      <View style={{ paddingLeft: 10 }}>
                        <Image
                          style={{
                            width: 25,
                            height: 25,
                            resizeMode: "contain",
                          }}
                          source={uploadLicense}
                        />
                      </View>
                      <Text style={styles.moreInfoText}>Improvement</Text>
                      <View
                        style={{
                          width: "100%",
                          alignItems: "flex-end",
                          paddingRight: 165,
                        }}
                      >
                        <Image
                          style={{
                            width: 25,
                            height: 25,
                            resizeMode: "contain",
                            transform: [
                              {
                                rotate: showImprovements ? "270deg" : "180deg",
                              },
                            ],
                          }}
                          source={greybackbutton}
                        />
                      </View>
                    </View>
                  )}
                  renderContent={() => (
                    <View
                      style={{
                        marginLeft: 10,
                        backgroundColor: "#eee",
                        paddingBottom: 10,
                        marginBottom: 5,
                      }}
                    >
                      <View style={{ padding: 20 }}>
                        <Text
                          style={{
                            fontFamily: fonts.semiBold,
                            color: colorCodes.textColor,
                          }}
                        >
                          Subject
                        </Text>
                        {/* <TextInput
                          style={{ height: 40, borderColor: '#00000029', borderWidth: 1, fontFamily: fonts.regular, color: colorCodes.textColor }}
                          onChangeText={(text) => setSubject({ text })}
                          value={subject}
                          maxLength={50}
                        /> */}
                        <DropDownPicker
                          customArrowUp={() => (
                            <Image
                              onPress={() => this.select(index, item)}
                              style={{
                                width: 15,
                                height: 15,
                                transform: [{ rotate: "90deg" }],
                              }}
                              source={backbutton}
                            />
                          )}
                          customArrowDown={() => (
                            <Image
                              onPress={() => this.select(index, item)}
                              style={{
                                width: 15,
                                height: 15,
                                transform: [{ rotate: "270deg" }],
                              }}
                              source={backbutton}
                            />
                          )}
                          items={[
                            {
                              label: "Regarding App Improvement",
                              value: "Regarding App Improvement",
                            },
                            {
                              label: "Regarding User Experience",
                              value: "User Experience",
                            },
                            {
                              label: "General Feedback",
                              value: "General Feedback",
                            },
                            {
                              label: "Other Observations",
                              value: "Other Observations",
                            },
                          ]}
                          defaultValue={subject}
                          containerStyle={{ height: 40 }}
                          style={{
                            borderColor: "#00000029",
                            borderWidth: 1,
                            fontFamily: fonts.regular,
                            color: colorCodes.textColor,
                          }}
                          itemStyle={{
                            justifyContent: "flex-start",
                          }}
                          dropDownStyle={{
                            borderColor: "#00000029",
                            borderWidth: 1,
                            fontFamily: fonts.regular,
                            color: colorCodes.textColor,
                          }}
                          onChangeItem={(item) => setSubject(item.value)}
                        />
                      </View>
                      <View style={{ padding: 20, marginTop: -25 }}>
                        <Text
                          style={{
                            fontFamily: fonts.semiBold,
                            color: colorCodes.textColor,
                          }}
                        >
                          Message
                        </Text>
                        <Textarea
                          containerStyle={{
                            height: 100,
                            fontFamily: fonts.regular,
                            color: colorCodes.textColor,
                            borderColor: "#00000029",
                            borderWidth: 1,
                            borderRadius: 5,
                          }}
                          style={{
                            fontFamily: fonts.regular,
                            color: colorCodes.textColor,
                            padding: 5,
                          }}
                          onChangeText={(text) => setMsg({ text })}
                          maxLength={500}
                          multiline={true}
                          placeholder={"Enter your message here .  .  ."}
                          placeholderTextColor={"#c7c7c7"}
                          underlineColorAndroid={"transparent"}
                        />
                      </View>
                      <View
                        style={{
                          width: "100%",
                          alignItems: "center",
                          alignContent: "center",
                          marginTop: 20,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            flexDirection: "row",
                            elevation: 5,
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.8,
                            shadowRadius: 1,
                            shadowColor: "#00000029",
                            borderColor: "#00000029",
                            borderTopRightRadius: 5,
                            borderTopLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            height: 50,
                            marginLeft: 10,
                            width: 100,
                            backgroundColor: "#FFF",
                            borderBottomLeftRadius: 5,
                            marginTop: -25,
                            alignItems: "center",
                            alignContent: "center",
                          }}
                          onPress={() => {
                            submit(subject, msg);
                          }}
                        >
                          <Text
                            style={{
                              padding: 10,
                              fontFamily: "Segoe_UI_Bold",
                              fontSize: 14,
                              color: "#01313C",
                              marginTop: -3,
                              paddingLeft: 25,
                            }}
                          >
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
                {/* 
                <Accordion
                  onChangeVisibility={(value) => {
                    setShowFeedback(value)
                  }}
                  renderHeader={() => (
                    <View style={[styles.wrapDropDownHeader, { borderLeftWidth: 3, borderLeftColor: colorCodes.primaryColor }]}>
                      <View style={{ paddingLeft: 10 }}>
                        <Image
                          style={{
                            width: 25,
                            height: 25, resizeMode: 'contain',
                          }}
                          source={uploadRcBook}
                        />
                      </View>
                      <Text style={styles.moreInfoText}>Feedbacks</Text>
                      <View style={{ width: '100%', alignItems: 'flex-end', paddingRight: 145 }}>
                        <Image
                          style={{
                            width: 25,
                            height: 25, resizeMode: 'contain',
                            transform: [{ rotate: showFeedback ? '270deg' : '180deg' }],
                          }}
                          source={greybackbutton}
                        />
                      </View>
                    </View>
                  )}
                  renderContent={() => (
                    <View style={{ marginLeft: 10, backgroundColor: '#eee', paddingBottom: 10, marginBottom: 5 }}>
                      <Text style={{
                        marginLeft: 10,
                        fontFamily: fonts.regular
                      }}>If you can't make even a single payment within India, It should not happen because nowadays nearly all debit cards support online payments</Text>
                    </View>
                  )}
                /> */}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const submit = async (subject, msg) => {
  console.log(msg);
  const shareOptions = {
    title: "Share via",
    message: msg.text,
    email: "incubermax@gmail.com",
    subject: subject,
    social: Share.Social.EMAIL,
  };
  const shareResponse = await Share.shareSingle(shareOptions);
  commanService.createSimpleToast("Details Saved", "success");
  nav.navigation.navigate("Dashboard");
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colorCodes.colorWhite,
    height: 60,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
  wrapDropDownHeader: {
    borderWidth: 1,
    flexDirection: "row",
    // elevation: 5,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 1,
    // shadowColor: "#00000029",
    borderWidth: 1,
    borderColor: "#00000029",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: 39,
    marginLeft: 10,
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 5,
    marginTop: 5,
    alignItems: "center",
    alignContent: "center",
  },
  moreInfoText: {
    padding: 10,
    fontFamily: "Segoe_UI_Bold",
    fontSize: 14,
    color: "#01313C",
    marginTop: -3,
    paddingLeft: 20,
  },
});

export default ContactUs;
