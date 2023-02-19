import Actiontypes from "../types";

const initailState = {
  loader: false,
};

const loader = (state = initailState, action) => {
  switch (action.type) {
    case Actiontypes.SHOW_LOADER: {
      return Object.assign({}, state, {
        loader: true,
      });
    }
    case Actiontypes.HIDE_LOADER: {
      return Object.assign({}, state, {
        loader: false,
      });
    }
    case Actiontypes.TRIGGER_LOADER: {
      return Object.assign({}, state, {
        loader: action.payload,
      });
    }
    default:
      return state;
  }
};

export default loader;
