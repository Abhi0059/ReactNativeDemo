import ActionTypes from '../types';

export const storeUserDetail = param => ({
  type: ActionTypes.STORE_USER_DETAIL,
  payload: param,
});

export const storeDeviceToken = param => ({
  type: ActionTypes.STORE_DEVICE_TOKEN,
  payload: param,
});

export const userLogout = () => ({
  type: ActionTypes.USER_LOGOUT,
});

export const increaseCartCount = () => ({
  type: ActionTypes.INCREASE_CART_COUNT,
});

export const decreaseCartCount = param => ({
  type: ActionTypes.DECREASE_CART_COUNT,
  payload: param,
});

export const updateCartCount = param => ({
  type: ActionTypes.UPDATE_CART_COUNT,
  payload: param,
});

export const storeProfilePercentage = param => ({
  type: ActionTypes.STORE_PROFILE_PERCENTAGE,
  payload: param,
});
export const storeCartCount = param => ({
  type: ActionTypes.STORE_CART_COUNT,
  payload: param,
});

export const setReportComponentDetails = param => ({
  type: ActionTypes.SET_REPORT_COMPONENT_DETAILS,
  payload: param,
});

export const reportOn = param => ({
  type: ActionTypes.REPORT_ON,
  payload: param,
});

export const triggerReportBottomSheet = param => ({
  type: ActionTypes.TRIGGER_REPORT_BOTTOM_SHEET,
  payload: param,
});

export const triggerSubmitReportBottomSheet = param => ({
  type: ActionTypes.TRIGGER_SUBMIT_REPORT_BOTTOM_SHEET,
  payload: param,
});
