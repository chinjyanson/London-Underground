import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import TrainMap from './src/components/TrainMap';
// import LocationTextBox from './src/components/LocationTextBox';
import SlidingUpModal from './src/components/SlidingUpModal';

const ParentComponent = () => {
  const [pathData, setPathData] = useState(null); // Lift the state up to App

  return (
      <SafeAreaView style={styles.container}>
        {/* <LocationTextBox /> */}
        <TrainMap
          setPathData={setPathData}
          pathData={pathData}
        />
        {pathData && pathData.path ? (  // Ensure pathData is valid before rendering
          <SlidingUpModal pathData={pathData} />
        ) : (
          <View></View> // return empty view if nothing selected yet
        )}

      </SafeAreaView>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ParentComponent;