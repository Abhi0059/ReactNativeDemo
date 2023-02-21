import * as React from "react";
import {
  View,
  useWindowDimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import RequestPass from "../requestPass";
import PastRequest from "../passRequest";
export default function RequestPassTab(props) {
  const FirstRoute = () => (
    <RequestPass props={props} setIndexnNow={setIndexnNow} />
  );

  const SecondRoute = () => <PastRequest props={props} />;

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "New Pass Request " },
    { key: "second", title: "View Request" },
  ]);

  function setIndexnNow() {
    console.log("setIndexnNow");
    setIndex(1);
  }

  return (
    <View style={style.body}>
      <View style={styles.body}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            style={styles.img}
            source={require("../../../assets/imgs/backbutton.png")}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{"Request Pass"}</Text>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
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
      />
    </View>
  );
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
