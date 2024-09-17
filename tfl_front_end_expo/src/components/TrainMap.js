import React, { useState } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { find_optimal_path, get_all_stations } from '../api/api';
import { GOOGLE_PLACES_API_KEY } from '@env';

const TrainMap = ({ pathData, setPathData }) => {
  const [startingLocation, setStartingLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [allPath, setAllPath] = useState(null);
  const [startingCoordinates, setStartingCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [showAllStations, setShowAllStations] = useState(false);
  const [showZones, setShowZones] = useState(false);

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

  const handleAllPath = async () => {
    if (!allPath) {
      try {
        const data = await get_all_stations(); // Call the API to get all stations
        console.log('API response:', data);
        setAllPath(data); // Save all stations data to state
      } catch (error) {
        Alert.alert('Error', 'Failed to get all stations.');
        console.error('API call failed:', error);
      }
    }
    setShowAllStations(!showAllStations); // Toggle the visibility state
  };

  const handleShowZones = async () => {
    setShowZones(!showZones);
  };

  // const pathStations = pathData ? JSON.stringify(pathData.path) : '[]'; // Extract path
  // const allStations = allPath ? JSON.stringify(allPath) : '[]';
  // Dynamically generate the HTML content for the WebView
  const generateHTML = () => {
    const pathStations = pathData ? JSON.stringify(pathData.path) : '[]';
    const allStations = allPath ? JSON.stringify(allPath) : '[]';

    return `
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
          const map = L.map('map', {
              zoomControl: false  // Disable the zoom control
          }).setView([51.505, -0.09], 13); // Default map view
      
          // Add tile layer (OpenStreetMap)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            minZoom: 11
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

          if (${showZones}) {
            let zone1polygon, zone2polygon, zone3polygon;

            const Zone1 = [
              [51.5090, -0.1979],  // Notting Hill Gate
              [51.5181, -0.1783],  // Paddington
              [51.5250, -0.1632],
              [51.5291, -0.1332],  // Euston
              [51.5308, -0.1238],  // King's Cross St Pancras
              [51.5252, -0.0875],  // Old Street
              [51.5150, -0.0723],  // Aldgate East
              [51.5102, -0.0766],  // Tower Hill
              [51.4941, -0.0997],  // Elephant & Castle
              [51.4854, -0.1226],  // Vauxhall
              [51.4914, -0.1933],  // Earl's Court
            ];

            const Zone2 = [
              [51.5235, -0.2597], // North Acton
              [51.4951, -0.2546], // Turnham Green
              [51.4592, -0.2110], // East Putney
              [51.4526, -0.1476], // Clapham South
              [51.5004, 0.0043], // North Greenwich
              [51.5830, -0.0726], // Seven Sisters
              [51.5707, -0.0961], // Manor House 
              [51.5655, -0.1348], // Archway
              [51.5560, -0.1774], // Hampstead
              [51.5491, -0.2215], // Willesden Green
              [51.5323, -0.2443], // Willesden Junction
            ];

            const Zone3 = [
              [51.5523, -0.2968], // Wembley Central
              [51.5365, -0.2968], // Perivale
              [51.4990, -0.3150], // Northfields
              [51.4770, -0.2852], // Kew Gardens
              [51.4153, -0.1920], // South Wimbledon
              [51.5020, 0.0627], // Random location
              [51.5389, 0.0512], // East Ham
              [51.5683, 0.0082], //Leytonstone
              [51.6070, -0.1242], // Bounds Green
              [51.6009, -0.1925], //Fincheley Central
              [51.5833, -0.2264], // Hendon Central
              
            ];
            zone1polygon = L.polygon(Zone1, {
              color: 'red',
              fillColor: 'red',
              fillOpacity: 0.25,
              opacity: 0.3
              }).addTo(map);
            zone1polygon.bindPopup('Zone 1');
            zone2polygon = L.polygon(Zone2, {
              color: 'blue',
              fillColor: 'blue',
              fillOpacity: 0.25,
              opacity: 0.3
            }).addTo(map);
            zone2polygon.bindPopup('Zone 2');
            zone3polygon = L.polygon(Zone3, {
              color: 'green',
              fillColor: 'green',
              fillOpacity: 0.25,
              opacity: 0.3
            }).addTo(map);
            zone3polygon.bindPopup('Zone 3');

            zone2polygon.bringToFront();
            zone1polygon.bringToFront();
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

          let stationsLayerGroup;

          function toggleStations(showStations) {
            if (stationsLayerGroup) {
              map.removeLayer(stationsLayerGroup);
            }
            
            if (showStations) {
              stationsLayerGroup = L.layerGroup();  // Create a layer group to hold stations and polylines
              const stations = ${allStations};
              for (const stationName in stations) {
                if (stations.hasOwnProperty(stationName)) {
                  const stationInfo = stations[stationName];
                  const { coordinates, color, name } = stationInfo;
          
                  // Add marker with the static pixel icon and line color
                  const marker = L.marker(coordinates, {
                    icon: createStationIcon()
                  });
                  
                  // Add popup to each station marker
                  marker.bindPopup(\`Station: \${name} <br> Line: \${stationInfo.line.join(', ')}\  \${stationInfo.coordinates}\`);
                  stationsLayerGroup.addLayer(marker);
                  
                  // Draw polylines between neighbours
                  for (const neighbourName in stationInfo.neighbours) {
                    if (stationInfo.neighbours.hasOwnProperty(neighbourName)) {
                      const neighbourInfo = stationInfo.neighbours[neighbourName];
                      const neighbourCoordinates = neighbourInfo.coordinates;
          
                      const polyline = L.polyline([coordinates, neighbourCoordinates], {
                        color: stationInfo.color || 'black',  // Use the station color
                        weight: 4,
                        opacity: 0.8
                      });
                      stationsLayerGroup.addLayer(polyline);
                    }
                  }
                }
              }
              stationsLayerGroup.addTo(map);  // Add all markers and polylines at once
            }
          }

          // Initial call to toggle stations based on showAllStations state
          toggleStations(${showAllStations});


          // Add individual station markers and polylines from pathStations
          const pathStations = ${pathStations};
          pathStations.forEach((station, index) => {
            const { coordinates, station: stationName, line, color } = station;
            
            // Add marker with the static pixel icon
            const marker = L.marker(coordinates, {
              icon: createStationIcon()  // Use the static pixel icon
            }).addTo(map);
            
            // Add popup to each station marker
            marker.bindPopup(\`Station: \${stationName} <br> Line: \${line || 'N/A'}\`);
      
            // Draw individual polylines for each segment between two consecutive stations
            if (index > 0) {
              const prevStation = pathStations[index - 1];
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
  };

  

  return (
    <View style={styles.container}>
      {/* WebView displaying the map */}
      <View style={styles.webViewContainer}>
      <WebView 
          originWhitelist={['*']} 
          source={{ html: generateHTML() }} 
          style={styles.webView}
          key={showZones} // Key ensures WebView is re-rendered when showZones is toggled
        />
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
        <View style={styles.showZonesContainer}>
          <Button title={showZones ? "Hide Zones" : "Show Zones"} onPress={handleShowZones}/>
        </View>
        <View style={styles.showAllStationsContainer}>
        <Button title={showAllStations ? "Hide All Stations" : "Show All Stations"} onPress={handleAllPath} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  showZonesContainer: {
    position: 'absolute',
    top: 160,
    right: 0,
    width: 155,
    zindex: 10,
  },
  showAllStationsContainer: {
    position: 'absolute',
    top: 200,
    right: 0,
    width: 155,
    zindex: 10,
  },
  container: {
    flex: 1,
    position: 'relative',
    zindex: 0,
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
