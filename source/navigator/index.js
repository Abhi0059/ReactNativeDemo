import React from "react";
import AppNavigator from "./drawer";
import { AuthStackNavigator } from "../screens";
import { NavigationContainer } from "@react-navigation/native";

class Source extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer>
        {/* <AuthStackNavigator /> */}
        <AppNavigator />
      </NavigationContainer>
    );
  }
}

export default Source;
