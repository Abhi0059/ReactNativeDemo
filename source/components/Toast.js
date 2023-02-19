import React from "react";
import { Text, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import colorCodes from "../themes/colorCodes";
import fonts from "../themes/fonts";
const Toast = (props) => {
  return (
    <Animatable.View
      animation="slideInDown"
      style={[
        style.main,
        { backgroundColor: props.type == "S" ? "#0FD14B" : "#ff3333" },
      ]}
    >
      <Text style={style.textStyle}>{props.msg}</Text>
    </Animatable.View>
  );
};

const style = StyleSheet.create({
  main: {
    position: "absolute",
    width: "100%",
    zIndex: 300,
    padding: 10,
    opacity: 0.9,
  },
  textStyle: {
    fontFamily: fonts.semiBold,
    color: colorCodes.colorWhite,
    marginLeft: 10,
  },
});
export default Toast;
