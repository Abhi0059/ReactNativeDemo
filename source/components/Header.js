import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import colorCodes from "../themes/colorCodes";
import fonts from "../themes/fonts";
var backbutton = require("../../assets/imgs/backbutton.png");

const Header = (props) => {
  console.log(props);

  const goBack = () => {
    console.log("TEST");
  };

  return (
    <SafeAreaView>
      <View style={styles.main}>
        <TouchableOpacity style={styles.backbutton} onPress={goBack}>
          <Image style={styles.backimg} source={backbutton} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: { flexDirection: "row", margin: 3 },
  backbutton: {
    position: "relative",
    padding: 10,
    borderRadius: 50,
    marginLeft: 5,
  },
  backimg: { width: 23, height: 23 },
  headerText: {
    fontFamily: fonts.semiBold,
    color: colorCodes.textColor,
    textAlignVertical: "center",
    fontSize: 15,
  },
});

export default Header;
