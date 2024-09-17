// JourneyLog.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const JourneyLog = ({ timeTaken, journeyPath }) => {
  const calculateETA = (travelTimeInMinutes) => {
    const currentTime = new Date(); // Get current time
    const etaTime = new Date(currentTime.getTime() + travelTimeInMinutes * 60000); // Add travel time in milliseconds
  
    const etaHours = etaTime.getHours();
    const etaMinutes = etaTime.getMinutes();
  
    return `${etaHours}:${etaMinutes < 10 ? '0' : ''}${etaMinutes}`; // Return formatted ETA
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journey Summary</Text>

      {/* Time Taken Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Time Taken</Text>
        <Text style={styles.infoValue}>{timeTaken} minutes</Text>
      </View>

      {/* ETA Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>ETA</Text>
        <Text style={styles.infoValue}>{calculateETA(timeTaken)}</Text>
      </View>

      {/* Journey Path */}
      <Text style={styles.subHeader}>Journey Path</Text>

      {/* Scrollable Journey Path */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.pathContainer}>
          {journeyPath.map((stop, index) => (
            <View key={index} style={styles.stopContainer}>
              <Text style={styles.stopName}>{stop.station}</Text>
              <Text style={styles.lineName}>{stop.line ? `Line: ${stop.line}` : 'No line info'}</Text>
              <Text style={styles.coordinates}>
                Coordinates: {stop.coordinates[0]}, {stop.coordinates[1]}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#666',
  },
  infoValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    height: '80%', // Ensure the modal or container has enough space
    zindex: 1001,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    maxHeight: 400, // Set a maximum height for the scrollable area
    marginTop: 10,
  },
  pathContainer: {
    paddingBottom: 20,
  },
  stopContainer: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  stopName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lineName: {
    fontSize: 12,
    color: '#888',
  },
  coordinates: {
    fontSize: 12,
    color: '#666',
  },
});

export default JourneyLog;
