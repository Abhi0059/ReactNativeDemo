import React, {useEffect} from 'react';
import {Text, StyleSheet, View, Keyboard} from 'react-native';
import * as Animatable from 'react-native-animatable';
var loaderIcon = require('../../assets/icon.png');
function Loader(props) {
  useEffect(() => {
    Keyboard.dismiss();
  }, []);
  return (
    <View animation="slideInDown" style={[style.main]}>
      <View>
        <Animatable.Image
          animation="bounceIn"
          iterationCount={5000}
          duration={1500}
          source={loaderIcon}
          style={style.img}></Animatable.Image>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  main: {
    flex: 1,
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 300,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#770ec118',
  },
  img: {
    width: 80,
    height: 80,
    zIndex: 350,
    borderRadius: 150,
    resizeMode: 'center',
    opacity: 1,
  },
});
export default Loader;
