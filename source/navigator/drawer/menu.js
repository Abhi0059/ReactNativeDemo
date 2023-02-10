import React from "react";
import { View, StyleSheet, Text } from "react-native";

class DrawerMenu extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Drawer </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});

export default DrawerMenu;
