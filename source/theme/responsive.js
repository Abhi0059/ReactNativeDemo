import React from "react";
import { Dimensions, PixelRatio, Platform } from "react-native";

const H = Dimensions.get("window").height;
const W = Dimensions.get("window").width;

const f = (scale) => {
  let FONT_SIZE = 12 * scale;
  let FONT_SIZE_Requests = 12 * scale;
  if (PixelRatio.get() <= 1.5 && PixelRatio.get() > 1) {
    FONT_SIZE = 9 * scale;
    FONT_SIZE_Requests = 9 * scale;
    return FONT_SIZE;
  } else if (PixelRatio.get() <= 1) {
    FONT_SIZE = 9 * scale;
    FONT_SIZE_Requests = 9 * scale;
    return FONT_SIZE;
  } else if (
    PixelRatio.get() > 1.5 &&
    PixelRatio.get() >= 2 &&
    PixelRatio.get() < 3
  ) {
    FONT_SIZE = 10 * scale;
    FONT_SIZE_Requests = 10 * scale;
    return FONT_SIZE;
  } else if (PixelRatio.get() >= 3) {
    FONT_SIZE = 11 * scale;
    FONT_SIZE_Requests = 11 * scale;
    return FONT_SIZE;
  } else {
    return FONT_SIZE;
  }
};

const w = (widthPercent) => {
  const screenWidth = Dimensions.get("window").width;
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
const h = (heightPercent) => {
  const screenHeight = Dimensions.get("window").height;
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
const isIphoneXorAbove = () => {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
};

export { w, h, f, H, W, isIphoneXorAbove };
