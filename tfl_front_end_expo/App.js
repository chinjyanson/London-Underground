import React from 'react';
import { View, StyleSheet } from 'react-native';
import TrainMap from './src/components/TrainMap';
// import LocationTextBox from './src/components/LocationTextBox';
import SlidingUpModal from './src/components/SlidingUpModal';

const ParentComponent = () => {
  const routeCoordinates = [
    [51.519858, -0.167832],
    [51.516581, -0.175689],
    [51.512284, -0.187938],
    [51.509128, -0.196104],
    [51.501055, -0.192792],
    [51.494316, -0.182658],
    [51.494094, -0.174138],
    [51.49227, -0.156377],
    [51.496359, -0.143102],
    [51.499544, -0.133608],
    [51.50132, -0.124861],
    [51.507058, -0.122666],
    [51.511006, -0.11426],
    [51.511581, -0.103659],
    [51.512117, -0.094009],
    [51.51151, -0.090432],
    [51.5107, -0.085969],
    [51.509971, -0.076546],
    [51.514246, -0.075689],
    [51.517372, -0.083182],
    [51.518176, -0.088322],
    [51.520275, -0.097993],
    [51.520252, -0.104913],
    [51.530663, -0.123194],
    [51.525604, -0.135829],
    [51.52384, -0.144262],
    [51.522883, -0.15713],
    [51.519858, -0.167832],
    [51.518187, -0.178306],
    [51.519113, -0.188748],
    [51.52111, -0.201065],
    [51.517449, -0.210391],
    [51.513389, -0.217799],
    [51.509669, -0.22453],
    [51.505579, -0.226375],
    [51.502005, -0.226715],
    [51.49339, -0.225033],
  ];

  // TDOO: Replace with real station data
  const stations = [
    { lat: 51.505, lng: -0.09, name: 'Station 1' },
    { lat: 51.51, lng: -0.1, name: 'Station 2' },
    { lat: 51.51, lng: -0.12, name: 'Station 3' }
  ];

  return (
      <View style={styles.container}>
        {/* <LocationTextBox /> */}
        <TrainMap 
          stations={stations}
          routeCoordinates={routeCoordinates}
        />
        <SlidingUpModal />
      </View>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ParentComponent;