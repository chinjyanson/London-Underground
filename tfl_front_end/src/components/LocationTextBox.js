import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const LocationTextBox = ({location_placeholder}) => {
  const [text, setText] = useState(''); // State to hold the input value

  const handleInputChange = (newText) => {
    setText(newText);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleInputChange}
        placeholder={location_placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default LocationTextBox;
