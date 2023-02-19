import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import colorCodes from "../themes/colorCodes";
import fonts from "../themes/fonts";

const WhiteButton = (props) => {
  return (
    <SafeAreaView>
      <TouchableOpacity style={Styles.button} onPress={props.buttonHandle}>
        <Text style={Styles.buttonText}>{props.name}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  button: {
    backgroundColor: colorCodes.colorWhite,
    borderRadius: 5,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    height: 50,
    textAlignVertical: "center",
    color: colorCodes.textColor,
    fontFamily: fonts.semiBold,
    textTransform: "uppercase",
  },
});

export default WhiteButton;
