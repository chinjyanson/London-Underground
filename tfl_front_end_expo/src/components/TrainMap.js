import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { find_optimal_path } from '../api/api';

const TrainMap = () => {
  const [startingLocation, setStartingLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [pathData, setPathData] = useState(null); // Store path data returned from API

  const handleFindPath = async () => {
    if (!startingLocation || !destination) {
      Alert.alert('Error', 'Please enter both starting location and destination.');
      return;
    }

    try {
      const data = await find_optimal_path(startingLocation, destination); // Call the API
      setPathData(data); // Save the entire path data to state
    } catch (error) {
      Alert.alert('Error', 'Failed to find the path.');
      console.error('API call failed:', error);
    }
  };

  const pathStations = pathData ? JSON.stringify(pathData.path) : '[]'; // Extract path

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Leaflet Map</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        #map {
          width: 100%;
          height: 100vh;
          margin: 0;
          padding: 0;
        }
        body, html { margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        // Initialize the map
        const map = L.map('map').setView([51.505, -0.09], 13);
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        // Parse the stations data passed from React Native
        const stations = ${pathStations};

        // Loop over the stations and add them to the map
        stations.forEach(station => {
          const { coordinates, station: stationName, line } = station;
          
          // Create a marker for each station
          const marker = L.circleMarker(coordinates, {
            radius: 8,
            color: line ? 'blue' : 'green', // Color based on the line availability
            fillColor: '#f03',
            fillOpacity: 0.7,
          }).addTo(map);

          // Bind a popup with station name and line information
          marker.bindPopup(\`Station: \${stationName} <br> Line: \${line || 'N/A'}\`);
        });

        // Draw a polyline between all stations to show the route
        const routeCoordinates = stations.map(station => station.coordinates);
        L.polyline(routeCoordinates, { color: 'red' }).addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* WebView displaying the map */}
      <View style={styles.webViewContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webView}
        />
      </View>

      {/* Input for Starting Location and Destination */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Starting Location"
          placeholderTextColor="#888"
          value={startingLocation}
          onChangeText={text => setStartingLocation(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Destination"
          placeholderTextColor="#888"
          value={destination}
          onChangeText={text => setDestination(text)}
        />
        <Button title="Find Path" onPress={handleFindPath} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  inputContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default TrainMap;
