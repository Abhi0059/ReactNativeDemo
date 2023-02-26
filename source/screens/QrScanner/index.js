import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {w, h, f} from '../../theme/responsive';

class QrScanning extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scanner: true,
      isKeyboardVisible: false,
    };
    this.scanner;
  }

  componentDidMount = async () => {
    // this.props.navigation.addListener('focus', () => {
    //   this.scanner?.reactivate;
    // });
  };

  onSuccess = (e) => {
    const {route, navigation} = this.props;
    const {setSearchedFacility} = route.params || {};
    console.log('onSuccess', e);
    setSearchedFacility(e.data);
    navigation.goBack();
    // Linking.openURL(e.data).catch(err =>
    //     console.error('An error occured', err)
    // );
    // alert("CODE SCanned:>> " + e.data)
    //checkIn(e.data)
    //this.scanPass(e.data, 'scanned');
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View
            style={{
              flexDirection: 'row',
              position: 'relative',
              zIndex: 100,
              elevation: 5,
              flex: 1,
              width: '100%',
              height: h(10),
              padding: 20,
            }}>
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={() => {
                console.log('first');
                this.props.navigation.goBack();
              }}>
              <Image
                style={styles.logo}
                source={require('../../../assets/imgs/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cameraView}>
            <QRCodeScanner
              // ref={(node) => {
              //   this.scanner = node;
              // }}
              onRead={(e) => this.onSuccess(e)}
              //reactivate={true}
              //reactivateTimeout={3000}
              flashMode={RNCamera.Constants.FlashMode.off}
              showMarker={true}
              markerStyle={{borderColor: '#3E3DB7', borderRadius: 15}}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const SearchButton = ({handler}) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        backgroundColor: '#3e3db7',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 10,
        marginLeft: 5,
        borderRadius: 10,
      }}>
      <Text style={{fontFamily: 'Segoe_UI_semi_Bold', color: '#fff'}}>
        Check Out
      </Text>
    </TouchableOpacity>
  );
};

const ReprintButton = ({handler}) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        backgroundColor: '#3e3db7',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 10,
        marginLeft: 5,
        borderRadius: 10,
      }}>
      <Text style={{fontFamily: 'Segoe_UI_semi_Bold', color: '#fff'}}>
        Reprint
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logo: {height: 40, width: 40, tintColor: '#000000'},
  centerText: {
    flex: 1,
    fontSize: 14,
    color: '#01313C',
    marginTop: 5,
    position: 'absolute',
    zIndex: 31,
    fontFamily: 'Segoe_UI_semi_Regular',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  inputBox: {
    borderRadius: 5,
    backgroundColor: '#e5e5fb',
    paddingLeft: 20,
    width: '55%',
    fontFamily: 'Segoe_UI_semi_Bold',
  },
  itemText: {
    paddingLeft: 20,
    fontFamily: 'Segoe_UI_semi_Bold',
  },
  cameraView: {
    width: w(100),
    height: h(65),
  },
  scrollView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listView: {
    width: '100%',
    alignItems: 'center',
  },
  itemContainer: {
    width: '100%',
    height: h(10),
    padding: 5,
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
});

export default QrScanning;
