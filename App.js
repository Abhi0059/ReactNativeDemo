import React from "react";
import Source from "./source/navigator";
import "react-native-gesture-handler";
import { SafeAreaView, StyleSheet } from "react-native";
class App extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Source />
      </SafeAreaView>
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

export default App;
