import React, { useState } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { find_optimal_path } from '../api/api';
import { GOOGLE_PLACES_API_KEY } from '@env';

const TrainMap = ({ pathData, setPathData }) => {
  const [startingLocation, setStartingLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [startingCoordinates, setStartingCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  console.log(startingCoordinates);

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

  // Dynamically generate the HTML content for the WebView
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
  
      /* You can add extra styles here if needed */
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
      const map = L.map('map').setView([51.505, -0.09], 13); // Default map view
  
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);
  
      // Function to create a static pixel icon for stations
      function createStationIcon() {
        return L.icon({
          iconUrl: 'https://bradshaw.onourlines.co.uk/w/images/thumb/7/75/Underground_roundel.svg/640px-Underground_roundel.svg.png',  // A small icon (you can change this to any image)
          iconSize: [20, 20],      // Fixed size of the icon in pixels
          iconAnchor: [10, 10],    // Anchor the icon in the center
          popupAnchor: [0, -10]    // Offset the popup so it appears above the icon
        });
      }
  
      // Add markers for the starting coordinates
      ${startingCoordinates ? `
        map.setView([${startingCoordinates.lat}, ${startingCoordinates.lng}], 13);
        L.marker([${startingCoordinates.lat}, ${startingCoordinates.lng}])
        .addTo(map)
        .bindPopup('Starting Location: ${startingLocation}');
        
        // Draw a dotted line from starting coordinates to the first station in pathStations
        const firstStationCoordinates = ${pathStations}[0] ? ${pathStations}[0].coordinates : null;
        if (firstStationCoordinates) {
          L.polyline([
            [${startingCoordinates.lat}, ${startingCoordinates.lng}], 
            firstStationCoordinates
          ], {
            color: 'blue',
            dashArray: '5, 10',  // Dotted effect
          }).addTo(map);
        }
      ` : ''}
  
      // Add the destination marker if destination coordinates are available
      ${destinationCoordinates ? `
        L.marker([${destinationCoordinates.lat}, ${destinationCoordinates.lng}])
        .addTo(map)
        .bindPopup('Destination: ${destination}');
        
        // Draw a dotted line from the last station to destination
        const lastStation = ${pathStations}.length > 0 ? ${pathStations}[${pathStations}.length - 1] : null;
        if (lastStation && lastStation.coordinates) {
          L.polyline([
            lastStation.coordinates,
            [${destinationCoordinates.lat}, ${destinationCoordinates.lng}]
          ], {
            color: 'blue',
            dashArray: '5, 10',  // Dotted effect
          }).addTo(map);
        }
      ` : ''}
  
      // Add all station markers and connect them with individual polylines
      const stations = ${pathStations};
      stations.forEach((station, index) => {
        const { coordinates, station: stationName, line, color } = station;
        
        // Add marker with the static pixel icon
        const marker = L.marker(coordinates, {
          icon: createStationIcon()  // Use the static pixel icon
        }).addTo(map);
        
        // Add popup to each station marker
        marker.bindPopup(\`Station: \${stationName} <br> Line: \${line || 'N/A'}\`);
  
        // Draw individual polylines for each segment between two consecutive stations
        if (index > 0) {
          const prevStation = stations[index - 1];
          const prevCoordinates = prevStation.coordinates;
          const segmentColor = station.color || 'black';  // Use the station color or default to black
          
          L.polyline([prevCoordinates, coordinates], {
            color: segmentColor,
            weight: 4,  // Adjust the weight (thickness) of the line
            opacity: 0.8
          }).addTo(map);
        }
      });
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
            setStartingCoordinates({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
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
            key: GOOGLE_PLACES_API_KEY,
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
