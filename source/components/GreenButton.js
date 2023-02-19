import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import colorCodes from "../themes/colorCodes";
import fonts from "../themes/fonts";

const GreenButton = (props) => {
  return (
    <SafeAreaView>
      <TouchableOpacity style={Styles.button} onPress={props.buttonHandle}>
        <Text style={Styles.buttonText}>{props.name}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  button: { backgroundColor: colorCodes.greenBtn, borderRadius: 5 },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    height: 40,
    textAlignVertical: "center",
    color: colorCodes.textColor,
    fontFamily: fonts.semiBold,
    textTransform: "uppercase",
  },
});

export default GreenButton;
