import React, { useState } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { find_optimal_path } from '../api/api';
import Constants from 'expo-constants';

const TrainMap = ({ pathData, setPathData }) => {
  const [startingLocation, setStartingLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [startingCoordinates, setStartingCoordinates] = useState('');
  const [destinationCoordinates, setDestinationCoordinates] = useState('');

  const handleFindPath = async () => {
    if (!startingLocation || !destination) {
      Alert.alert('Error', 'Please enter both starting location and destination.');
      return;
    }

    try {
      const data = await find_optimal_path(startingCoordinates.lng, startingCoordinates.lat, destinationCoordinates.lng, destinationCoordinates.lat); // Call the API
      console.log('API response:', data);
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
        const map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        // L.Marker(${startingCoordinates}).addTo(map).bindPopup('Starting Location: ${startingLocation}');
        // L.Marker(${destinationCoordinates}).addTo(map).bindPopup('Destination: ${destination}');

        const stations = ${pathStations};

        stations.forEach(station => {
          const { coordinates, station: stationName, line } = station;
          const marker = L.circleMarker(coordinates, {
            radius: 8,
            color: line ? 'blue' : 'green',
            fillColor: '#f03',
            fillOpacity: 0.7,
          }).addTo(map);
          marker.bindPopup(\`Station: \${stationName} <br> Line: \${line || 'N/A'}\`);
        });

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
        <WebView originWhitelist={['*']} source={{ html }} style={styles.webView} />
      </View>

      {/* Input for Starting Location and Destination */}
      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          placeholder="Enter Starting Location"
          fetchDetails={true}
          onPress={(data, details = null) => {
            setStartingLocation(details.formatted_address);
            console.log('Starting Location:', details.geometry.location);
            setStartingCoordinates({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
          }}
          query={{
            key: Constants.expoConfig.extra.GOOGLE_API_KEY, // Replace with your Google API key
            language: 'en',
          }}
          styles={{
            textInput: styles.input,
          }}
        />
        <GooglePlacesAutocomplete
          placeholder="Enter Destination"
          fetchDetails={true}
          onPress={(data, details = null) => {
            setDestination(details.formatted_address);
            setDestinationCoordinates({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
          }}
          query={{
            key: Constants.expoConfig.extra.GOOGLE_API_KEY, // Replace with your Google API key
            language: 'en',
          }}
          styles={{
            textInput: styles.input,
          }}
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
