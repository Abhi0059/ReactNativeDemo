import ActionTypes from "../types";

export const showLoader = () => ({
  type: ActionTypes.SHOW_LOADER,
});
export const hideLoader = () => ({
  type: ActionTypes.HIDE_LOADER,
});

export const triggerLoader = (param) => ({
  type: ActionTypes.TRIGGER_LOADER,
  payload: param,
});
