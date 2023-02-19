import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import colorCodes from "../themes/colorCodes";
import fonts from "../themes/fonts";

const GradientButton = (props) => {
  return (
    <SafeAreaView>
      <TouchableOpacity style={[Styles.button]} onPress={props.buttonHandle}>
        <LinearGradient
          useAngle={true}
          angle={260}
          style={{ borderRadius: props.fullBtn ? 0 : 5 }}
          colors={[colorCodes.gradientColor1, colorCodes.gradientColor2]}
        >
          <Text style={Styles.buttonText}>{props.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  button: { width: "100%" },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    padding: 11,
    textAlignVertical: "center",
    color: colorCodes.colorWhite,
    fontFamily: fonts.semiBold,
    textTransform: "uppercase",
  },
});

export default GradientButton;
