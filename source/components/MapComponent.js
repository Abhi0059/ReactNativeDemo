import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import MapView from "react-native-maps";
var car = require("../../assets/imgs/mycar.png");
var greenPin = require("../../assets/imgs/greenPin.png");
const MapComponent = (props) => {
  const mapView = useRef();
  const [countryCordinates, setCountryCordinates] = useState({
    latitude: 19.280527,
    longitude: 72.8824317,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  });
  const [myCordinates, setmyCordinates] = useState(props.myCordinates);
  const [origin, setorigin] = useState({});
  const [markers, setMarkers] = useState([]);

  const goToInitialRegion = () => {
    setTimeout(() => {
      let initialRegion = Object.assign({}, myCordinates);
      initialRegion["latitudeDelta"] = 0.015;
      initialRegion["longitudeDelta"] = 0.015;
      mapView.current.animateToRegion(initialRegion, 2000);
      setorigin(props.origin);
    }, 1000);
  };

  useEffect(() => {
    setmyCordinates(props.myCordinates);
    setMarkers(props.markers);
    goToInitialRegion();
  }, [origin]);

  return (
    <MapView
      style={{ flex: 1 }}
      region={countryCordinates}
      followUserLocation={true}
      ref={mapView}
      zoomEnabled={true}
      showsUserLocation={false}
      showsMyLocationButton={false}
      showsPointsOfInterest={false}
      showsBuildings={false}
      toolbarEnabled={false}
      showsIndoors={false}
      showsCompass={false}
      showsTraffic={false}
      maxZoomLevel={30}
      minZoomLevel={13}
      onMapReady={goToInitialRegion()}
      onRegionChange={goToInitialRegion()}
      initialRegion={myCordinates}
    >
      {Object.keys(origin).length === 0 ? null : (
        <MapView.Marker coordinate={origin} title={"You are here"}>
          <Image source={car} style={{ width: 70, height: 70 }} />
        </MapView.Marker>
      )}

      {markers.map((marker) => (
        <MapView.Marker
          key={marker.id}
          coordinate={marker.coordinates}
          title={marker.title}
          tracksViewChanges={false}
          // onPress={() => { this.goToDetails(this.state.parkingList[marker.id]) }}
        >
          {/* <Image
                        source={greenPin}
                        style={{ height: 25, width: 25 }}
                    /> */}
        </MapView.Marker>
      ))}
    </MapView>
  );
};

export default MapComponent;
