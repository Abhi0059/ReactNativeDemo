import React from "react";
import AppNavigator from "./drawer";
import { AuthStackNavigator } from "../screens";
import { NavigationContainer } from "@react-navigation/native";
import Firebase from "@react-native-firebase/app";
import PushNotification, { Importance } from "react-native-push-notification";
import { getUserData } from "../utils/CommanServices";
import Events from "../../source/utils/event";

const firebaseConfig = {
  messagingSenderId: "964406149632",
  projectId: "eazypark-67b1a",
  apiKey: "AIzaSyC9Vc9SdRjSvjDiL-k56mnM3lkdHMOEESg",
  appId: "1:964406149632:android:08a55a0432813f65438ee5",
  databaseURL: "",
  storageBucket: "",
};
const config = {
  name: "EazyPark",
};

PushNotification.getChannels((ch) => {
  console.log("chhh", ch);
});

//Firebase.initializeApp(firebaseConfig, config);
if (Firebase.app.length > 0) {
  Firebase.initializeApp(firebaseConfig, config);
} else {
  Firebase.app();
}
PushNotification.createChannel(
  {
    channelId: "EazyPark",
    channelName: "EazyPark",
    channelDescription: "EazyPark for parking",
    soundName: "default",
    importance: Importance.HIGH,
    vibrate: true,
  },
  (created) => {
    console.log("created", created);
  }
);
class Source extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userLogin: "",
    };
  }

  componentDidMount() {
    getUserData("userData").then((res) => {
      console.log("userData on start", res);

      this.setState({
        userLogin: res?.isLogin ? "true" : "false",
      });
    });

    Events.on("loginTrue", "lt", () => {
      this.setState({
        userLogin: "true",
      });
    });
  }

  getStack = () => {
    const { userLogin } = this.state;

    if (userLogin === "false") {
      return <AuthStackNavigator />;
    } else if (userLogin === "true") {
      return <AppNavigator />;
    }
  };

  render() {
    return <NavigationContainer>{this.getStack()}</NavigationContainer>;
  }
}

export default Source;
