import "./source/utils/ignoreWarnings";
import React from "react";
import Source from "./source/navigator";
import "react-native-gesture-handler";
import { SafeAreaView, StyleSheet } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
//import firebase from "firebase";
import { Provider } from "react-redux";
import store from "./source/store";
const firebaseConfig = {};
class App extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <Provider store={store}>
        <MenuProvider>
          <SafeAreaView style={styles.container}>
            <Source />
          </SafeAreaView>
        </MenuProvider>
      </Provider>
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
