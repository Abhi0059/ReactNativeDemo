import React, { Component } from "react";
import {
  View,
  useWindowDimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { apiName } from "../../../Config";
import { httpCall } from "../../utils/RestApi";
import { getUserData } from "../../utils/CommanServices";
import { Base64 } from "js-base64";
import { w } from "../../theme/responsive";
import RequestPass from "../requestPass";
import PastRequest from "../passRequest";
import PassCard from "../../components/PassCard";
export default class MyPasses extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "first", title: "New Pass Request" },
        { key: "second", title: "View Request" },
      ],
      requestPassList: [],
      loadingText: "Searching for pass...",
      loader: false,
    };
  }

  componentDidMount() {
    this.getRequestPass();
  }

  getRequestPass = () => {
    getUserData("userData").then((data) => {
      let req = { userid: Base64.decode(data.UserId) };
      httpCall(apiName.GetPassRequetsList, req).then((res) => {
        console.log("GetPassRequetsList", res);
        if (res.respCode == 1 && res.data.length) {
          this.setState({
            loadingText: "",
            requestPassList: res.data,
          });
        } else if (res.respCode == 1 && !res.data.length) {
          this.setState({
            loadingText: "No pass found",
            requestPassList: [],
          });
        } else {
          this.setState({
            loadingText: "No pass found",
            requestPassList: [],
          });
        }
      });
    });
  };

  setIndexnNow = () => {
    this.setState({
      index: 1,
    });
  };

  render() {
    const { routes, index } = this.state;
    const { navigation } = this.props;
    return (
      <View style={style.body}>
        <View style={styles.body}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.img}
              source={require("../../../assets/imgs/backbutton.png")}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{"Request Pass"}</Text>
        </View>

        <TabView
          navigationState={{ index, routes }}
          onIndexChange={(i) => {
            this.setState({
              index: i,
            });
          }}
          initialLayout={{ width: w(100) }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={{ backgroundColor: "#FFF", color: "red" }}
              indicatorStyle={{ backgroundColor: "#770EC1", height: 3.5 }}
              renderLabel={({ route, color }) => (
                <Text
                  style={{
                    color: "#770EC1",
                    fontSize: 14,
                    fontFamily: "Segoe_UI_semi_Bold",
                  }}
                >
                  {route.title}
                </Text>
              )}
            />
          )}
          renderScene={({ route }) => {
            switch (route.key) {
              case "first": {
                return (
                  <RequestPass
                    props={this.props}
                    navigation={navigation}
                    setIndexnNow={this.setIndexnNow}
                  />
                );
              }
              case "second": {
                return (
                  <PastRequest props={this.props} navigation={navigation} />
                );
              }
              default:
                break;
            }
          }}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  body: { padding: 10, flex: 1, backgroundColor: "#fff" },
});

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
