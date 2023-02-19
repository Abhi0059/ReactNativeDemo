import ActionTypes from '../types';

export const animateTabY = param => ({
  type: ActionTypes.ANIMATE_TAB_Y,
  payload: param,
});

export const triigerAddedToCardSheet = param => ({
  type: ActionTypes.TRIGGER_ADDED_TO_CARD_SHEET,
  payload: param,
});
