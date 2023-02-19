import { combineReducers } from "redux";
import user from "./user";
import home from "./home";
import loader from "./loader";

//const appReducer = combineReducers({user})

const appReducer = combineReducers({
  user,
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    console.log("user logout");
    state = {};
  }
  return appReducer(state, action);
};

export default rootReducer;
