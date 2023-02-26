import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const Header = ({ props, title }) => {
  return (
    <View style={styles.body}>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Image
          style={styles.img}
          source={require("../../assets/imgs/backbutton.png")}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  title: { fontFamily: "Segoe_UI_semi_Bold" },
  img: { width: 25, height: 25, marginRight: 10 },
});

export default Header;
