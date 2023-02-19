import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
var backbutton = require("../../assets/imgs/backbutton.png");
import Accordion from "react-native-collapsible-accordion";
const MenuButton = (props) => {
  const [more, setmore] = useState(false);
  return (
    <View>
      {props.name == "My Pass" ? (
        <Accordion
          onChangeVisibility={(value) => {
            setmore(value);
          }}
          renderHeader={() => (
            <View style={styles.menuView}>
              <Image style={styles.menuIcon} source={props.leftimg} />
              <Text style={styles.menuText}>{props.name}</Text>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                  transform: [{ rotate: more ? "270deg" : "180deg" }],
                }}
                source={backbutton}
              />
            </View>
          )}
          renderContent={() => (
            <View style={{ marginLeft: 20, marginRight: 20 }}>
              <TouchableOpacity
                onPress={() => props.nav.navigation.navigate("RequestPassTab")}
                style={[
                  styles.menuView,
                  {
                    borderLeftColor: "#770EC1",
                    borderLeftWidth: 3,
                    borderBottomColor: "#ddd",
                    borderBottomWidth: 0.5,
                  },
                ]}
              >
                <Text style={styles.menuText}>- Request Pass</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => props.nav.navigation.navigate("MyPass")}
                style={[
                  styles.menuView,
                  {
                    borderLeftColor: "#770EC1",
                    borderLeftWidth: 3,
                    borderBottomColor: "#ddd",
                    borderBottomWidth: 0.5,
                  },
                ]}
              >
                <Text style={styles.menuText}>- View Pass</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => props.nav.navigation.navigate('ViewInOut')}
                style={[
                  styles.menuView,
                  {
                    borderLeftColor: '#770EC1',
                    borderLeftWidth: 3,
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 0.5,
                  },
                ]}>
                <Text style={styles.menuText}>- View In/Out</Text>
              </TouchableOpacity> */}

              {/* <SubMenu name="Request Pass" action={'requestPass'} />
                            props.nav.navigation("MyPass")
                            <SubMenu name="View Pass" action={'viewPass'} />
                            <SubMenu name="View In/Out" action={'viewInOut'} /> */}
            </View>
          )}
        />
      ) : (
        <TouchableOpacity style={styles.menuView} onPress={props.buttonHandle}>
          <Image style={styles.menuIcon} source={props.leftimg} />
          <Text style={styles.menuText}>{props.name}</Text>
          <Image style={styles.menuIconBack} source={backbutton} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const SubMenu = ({ name, action }) => {
  console.log(action);
  return (
    <TouchableOpacity
      style={[
        styles.menuView,
        {
          borderLeftColor: "#770EC1",
          borderLeftWidth: 3,
          borderBottomColor: "#770EC1",
        },
      ]}
    >
      <Text style={styles.menuText}>- {name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuView: {
    flexDirection: "row",
    marginLeft: 10,
    padding: 15,
    borderBottomWidth: 0.5,
    marginRight: 15,
    justifyContent: "space-between",
    borderBottomColor: "#00000029",
  },
  menuText: {
    color: "#01313C",
    fontFamily: "Segoe_UI_Regular",
    marginTop: 5,
    textAlign: "left",
    width: "75%",
    marginLeft: 20,
  },
  menuIcon: {
    width: 25,
    height: 25,
    tintColor: "#000000",
  },
  menuIconBack: {
    width: 20,
    height: 20,
    transform: [{ rotate: "180deg" }],
    alignSelf: "flex-end",
  },
});
export default MenuButton;
