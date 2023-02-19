import Actiontypes from "../types";

const initailState = {
  userId: "",
  userName: "",
  email: "",
  userLogin: "false",
  mobileNumber: "",
  deviceToken: "",
  token: "",
};

export default User = (state = initailState, action) => {
  switch (action.type) {
    case Actiontypes.STORE_USER_DETAIL: {
      const {
        userId,
        email,
        userName,
        userLogin,
        mobileNumber,
        deviceToken,
        token,
      } = action.payload;
      console.log("user data in redux", action.payload);
      return Object.assign({}, state, {
        userId,
        email,
        address,
        userName,
        mobileNumber,
        deviceToken,
        token,
        userLogin,

        // detailModifiedAfterDemotion: detailModifiedAfterDemotion || "true",
        // isExpertFormSubmitted: isExpertFormSubmitted || "false",
        // languageStrings: JSON.parse(languageStrings || "{}"),
        // stateName: JSON.parse(stateName || "{}"),
        // districtName: JSON.parse(districtName || "{}"),
        // tehsilName: JSON.parse(tehsilName || "{}"),
        // villageName: JSON.parse(villageName || "{}"),
      });
    }
    case Actiontypes.STORE_DEVICE_TOKEN: {
      return Object.assign({}, state, {
        deviceToken: action.payload,
      });
    }

    default:
      return state;
  }
};
