import React from "react";
import DrawerMenu from "./menu";
import { AppStackNavigator } from "../../screens";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerType="front"
      initialRouteName={"Stack"}
      drawerContent={(props) => <DrawerMenu {...props} />}
    >
      <Drawer.Screen name="Stack" component={AppStackNavigator} />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
