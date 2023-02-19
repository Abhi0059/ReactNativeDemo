import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import colorCodes from "../themes/colorCodes";
import fonts from "../themes/fonts";

const Banner = (props) => {
  return (
    <View style={styles.mainView}>
      {props.name != "" ? (
        <Text style={styles.welcmTxt}>Welcome, {props.name}</Text>
      ) : (
        <Text style={styles.welcmTxt}>Welcome to EazyPark™</Text>
      )}
      <Text style={styles.infoText}>
        Find and park vehicle just in few steps
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    padding: 8,
    paddingLeft: 20,
    backgroundColor: colorCodes.primaryColor,
  },
  welcmTxt: {
    textAlign: "left",
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  infoText: { textAlign: "left", color: "#FFFFFF", fontFamily: fonts.regular },
});
export default Banner;
