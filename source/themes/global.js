import {StyleSheet, Dimensions} from 'react-native';
import colorCodes from './colorCodes';
import fonts from './fonts';

const global = StyleSheet.create({
  header: {
    backgroundColor: 'red',
    height: 55,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colorCodes.titleColor,
  },
  backBtn: {
    width: 20,
    height: 20,
    marginTop: 2,
    marginRight: 10,
  },
  backBtnIcon: {
    fontSize: 20,
    lineHeight: 20,
    color: colorCodes.backButtonColor,
  },
  whiteButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    padding: 15,
    marginTop: 20,
  },
  whiteButton: {
    alignItems: 'center',
    backgroundColor: colorCodes.colorWhite,
    width: '100%',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  whiteButtonText: {
    padding: 12,
    height: 50,
    width: 250,
    textAlign: 'center',
    color: colorCodes.titleColor,
    fontFamily: fonts.semiBold,
  },
  welcomeText: {
    color: colorCodes.titleColor,
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
  appName: {
    color: colorCodes.textColor,
    width: 250,
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  appTitle: {
    color: colorCodes.titleColor,
    paddingTop: 15,
    width: 250,
    fontFamily: fonts.regular,
  },
  errText: {
    textAlign: 'center',
    alignItems: 'center',
    color: colorCodes.colorWhite,
    fontFamily: fonts.regular,
    backgroundColor: 'black',
    fontSize: 12,
    alignSelf: 'center',
  },
  loaderStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center',
    backgroundColor: '#00000059',
    paddingTop: 30,
    padding: 8,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
  },

  OtpErrorText: {
    textAlign: 'center',
    alignItems: 'center',
    color: colorCodes.colorWhite,
    fontFamily: fonts.regular,
    backgroundColor: 'black',
    fontSize: 12,
    alignSelf: 'center',
    marginTop: -10,
    marginBottom: 20,
  },
  textBox: {
    width: '80%',
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colorCodes.titleColor,
    backgroundColor: colorCodes.colorWhite,
    paddingLeft: 15,
  },
});

export default global;
