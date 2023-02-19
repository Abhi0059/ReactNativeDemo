import { NavigationActions } from "react-navigation";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  //if else
  console.log(routeName, params);
  _navigator.navigate(routeName, params);
}

export default {
  navigate,
  setTopLevelNavigator,
};
