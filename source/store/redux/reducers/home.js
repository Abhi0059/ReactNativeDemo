import Actiontypes from '../types';

const initailState = {
  animatedTabY: 0,
  addedToCardSheet: false,
};

const home = (state = initailState, action) => {
  switch (action.type) {
    case Actiontypes.ANIMATE_TAB_Y: {
      return Object.assign({}, state, {
        animatedTabY: action.payload,
      });
    }

    case Actiontypes.TRIGGER_ADDED_TO_CARD_SHEET: {
      return Object.assign({}, state, {
        addedToCardSheet: action.payload,
      });
    }
    default:
      return state;
  }
};

export default home;
