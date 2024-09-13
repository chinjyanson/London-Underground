import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

const TrainMap = ({ stations, routeCoordinates }) => {
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
        // Initialize the map
        const map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        // Parse the data passed from React Native
        const stations = ${stationsData};
        const routeCoordinates = ${routeData};

        // Draw the route
        L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);

        var polygon = L.polygon([
          [51.509, -0.08],
          [51.503, -0.06],
          [51.51, -0.047]
        ]).addTo(map);

        // Add station markers
        stations.forEach(station => {
          L.marker([station.lat, station.lng]).addTo(map)
            .bindPopup(station.name);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TrainMap;
