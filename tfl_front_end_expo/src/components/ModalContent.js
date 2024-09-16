// JourneyLog.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JourneyLog = ({ timeTaken, journeyPath }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journey Summary</Text>

      {/* Time Taken */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>Time Taken: </Text>
        <Text style={styles.value}>{timeTaken}</Text>
      </View>

      {/* Journey Path */}
      <Text style={styles.subHeader}>Journey Path</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
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
  pathContainer: {
    marginTop: 10,
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
