import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';

const TrainMap = ({ stations, routeCoordinates }) => {
  const [startingLocation, setStartingLocation] = useState('');
  const [destination, setDestination] = useState('');

  const stationsData = JSON.stringify(stations);
  const routeData = JSON.stringify(routeCoordinates);

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
        // Initialize the map and hide the zoom control
        const map = L.map('map', {
          zoomControl: false
        }).setView([51.505, -0.09], 13);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        // Parse the data passed from React Native
        const stations = ${stationsData};
        const routeCoordinates = ${routeData};

        // Draw the route
        L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);

        // Add station markers as circles
        stations.forEach(station => {
          L.circleMarker([station.lat, station.lng], {
            radius: 8,           // Radius of the circle
            color: 'red',        // Color of the border
            fillColor: '#f03',   // Fill color of the circle
            fillOpacity: 0.5     // Opacity of the fill
          }).addTo(map)
            .bindPopup(station.name);  // Popup for the station name
        });

        // Add circle markers for each point in routeCoordinates
        routeCoordinates.forEach(coord => {
          L.circleMarker(coord, {
            radius: 5,           // Radius of the circle (smaller for route points)
            color: 'green',      // Color of the border
            fillColor: '#0f3',   // Fill color of the circle
            fillOpacity: 0.7     // Opacity of the fill
          }).addTo(map);
        });
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

      {/* Textboxes for Starting Location and Destination */}
      <View style={styles.inputContainer} pointerEvents="box-none">
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
    pointerEvents: 'box-none', // Allow the text inputs to be interactable above WebView
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000', // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default TrainMap;
