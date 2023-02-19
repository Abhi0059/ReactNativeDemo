import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import * as Animatable from "react-native-animatable";
import colorCodes from "../themes/colorCodes";
// import CommanServices from '../../services/comman';
import WhiteButton from "./WhiteButton";
import fonts from "../themes/fonts";
// var commanService = new CommanServices();
import {
  createSimpleToast,
  getUserData,
  storeUserData,
} from "../services/CommanServices";
var intro1 = require("../../assets/imgs/intro1.png");
var intro2 = require("../../assets/imgs/intro2.png");
var intro3 = require("../../assets/imgs/intro3.png");
var data = [
  {
    id: 0,
    title: "Register a Vehicle",
    img: intro1,
    description:
      "Register only once and enjoy parking booking facilities there after",
  },
  {
    id: 1,
    title: "Find A Parking",
    img: intro2,
    description:
      "Based on your location we will show nearest parkings or you can search the city name on the map to find parkings",
  },
  {
    id: 2,
    title: "Pay fast and securely",
    img: intro3,
    description:
      "Pay using our secure online payment options like UPI, Internet Banking etc.",
  },
];
const { width } = Dimensions.get("window");

const IntroCard = (props) => {
  const [entries, setEntries] = useState(data);
  const [activeSlide, setActiveSlide] = useState(0);
  const _carousel = useRef(null);

  const skipPage = () => {
    getUserData("userData").then((res) => {
      let d = { isIntroPage: false };
      storeUserData("userData", { ...res, ...d });
    });
    props.navigation.replace("Login");
  };

  const _renderItem = ({ item, index }) => {
    return (
      <View style={styles.main}>
        <View style={styles.imgView}>
          <Animatable.Image
            animation="zoomIn"
            style={styles.imgStyle}
            source={item.img}
          />
        </View>
        <Animatable.View animation="slideInUp" style={styles.contentView}>
          <View>
            <Text style={styles.descriptionTitle}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          {activeSlide == 2 ? (
            <WhiteButton name="Get Started" buttonHandle={skipPage} />
          ) : (
            <View style={styles.bottomBtns}>
              <TouchableOpacity
                onPress={() => {
                  skipPage();
                }}
              >
                <Text style={styles.skipButton}>SKIP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  _carousel.current.snapToNext();
                }}
              >
                <Text style={styles.nextButton}>NEXT</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animatable.View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.main}>
      <Carousel
        ref={_carousel}
        data={entries}
        renderItem={_renderItem}
        sliderWidth={width}
        itemWidth={width}
        autoplay={false}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.pageDotStyle}
        dotStyle={{ backgroundColor: "rgba(255, 255, 255, 0.92)" }}
        inactiveDotStyle={{}}
        inactiveDotOpacity={0.3}
        inactiveDotScale={1}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },
  imgView: { flex: 2, justifyContent: "center", alignItems: "center" },
  contentView: {
    flex: 2,
    borderTopRightRadius: 15,
    paddingBottom: 30,
    paddingLeft: 35,
    paddingRight: 35,
    borderTopLeftRadius: 15,
    backgroundColor: colorCodes.primaryColor,
    justifyContent: "space-between",
  },
  imgStyle: { width: 340, height: 225, resizeMode: "contain" },
  descriptionTitle: {
    fontFamily: fonts.bold,
    fontSize: 25,
    color: colorCodes.colorWhite,
    textAlign: "center",
    paddingTop: 30,
  },
  description: {
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colorCodes.colorWhite,
    paddingTop: 30,
  },
  bottomBtns: { flexDirection: "row", justifyContent: "space-between" },
  skipButton: {
    alignSelf: "center",
    textAlign: "left",
    color: colorCodes.colorWhite,
    fontFamily: fonts.regular,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 30,
  },
  nextButton: {
    textAlign: "right",
    color: colorCodes.colorWhite,
    fontFamily: fonts.regular,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 15,
  },
  pageDotStyle: { position: "absolute", left: 0, bottom: 80, width: "100%" },
});

export default IntroCard;
