import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
} from "react-native";
import colorCodes from "../themes/colorCodes";
import fonts from "../themes/fonts";
import { Rating, AirbnbRating } from "react-native-ratings";
var parkingImg1 = require("../../assets/imgs/parkingImg1.png");
const ParkingCard = (props) => {
  const doAction = () => {
    console.log("action");
  };
  return (
    <SafeAreaView>
      <TouchableOpacity style={Styles.cardMain} onPress={props.clickHandler}>
        <View style={Styles.imgView}>
          <Image
            style={{
              width: 75,
              height: 75,
              resizeMode: "contain",
            }}
            source={parkingImg1}
          />
        </View>
        <View style={Styles.infoView}>
          <Text style={Styles.parkingName}>{props.name}</Text>
          <Rating
            type="custom"
            ratingCount={5}
            imageSize={14}
            startingValue={5}
            size={5}
            style={{ width: 65 }}
            starContainerStyle={{ backgroundColor: "green" }}
            readonly={true}
            tintColor={colorCodes.colorWhite}
            ratingColor={colorCodes.yellowStarColor}
            // onFinishRating={this.ratingCompleted}
          />
          <Text
            style={Styles.parkingAdressText}
          >{`${props.address}, ${props.city}`}</Text>
        </View>
        <View style={Styles.distanceView}>
          <Text style={Styles.distanceText}>{props.distance.toFixed(2)}km</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  cardMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: colorCodes.colorWhite,
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
  },
  imgView: { width: "25%" },
  infoView: { width: "50%", paddingLeft: 10 },
  distanceView: { width: "25%" },
  distanceText: {
    fontFamily: fonts.semiBold,
    color: colorCodes.textColor,
    fontSize: 16,
    textAlign: "center",
  },
  parkingName: {
    fontFamily: fonts.semiBold,
    color: colorCodes.textColor,
    fontSize: 14,
  },
  parkingAdressText: {
    fontFamily: fonts.semiBold,
    color: colorCodes.textColor,
    fontSize: 12,
  },
});

export default ParkingCard;
