import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, PanResponder, Dimensions } from 'react-native';

// Get the device height to dynamically control the modal's height
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SlidingUpModal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT / 2)).current; // Start halfway up

  // PanResponder for controlling the modal (swipe up to expand, swipe down to close)
  const panResponderForModal = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        translateY.setValue(Math.max(gesture.dy + SCREEN_HEIGHT / 2, 0)); // Limit dragging upward
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > SCREEN_HEIGHT / 4) {
          // If the modal is dragged down more than a quarter, close it
          closeModal();
        } else if (gesture.dy < -50) {
          // If the modal is swiped up more than a certain threshold, fully expand it
          Animated.spring(translateY, {
            toValue: 0, // Fully expanded (covers the entire screen)
            useNativeDriver: true,
          }).start();
        } else {
          // Snap it back to the half-open state
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT / 2, // Set it back to halfway up
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Open modal in a partially visible state (halfway up)
  const openModal = () => {
    setVisible(true);
    Animated.spring(translateY, {
      toValue: SCREEN_HEIGHT / 2, // Initially show the modal halfway up
      useNativeDriver: true,
    }).start();
  };

  // Close the modal fully
  const closeModal = () => {
    Animated.spring(translateY, {
      toValue: SCREEN_HEIGHT, // Move it completely off-screen
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  // Expose openModal to parent component via ref
  useEffect(() => {
    openModal(); // Automatically open modal when component mounts
  }, []);

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modal,
            { height: SCREEN_HEIGHT, transform: [{ translateY }] }, // Dynamic height to cover full screen
          ]}
          {...panResponderForModal.panHandlers}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.closeText} onPress={closeModal}>
              Close
            </Text>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>This is a full-screen sliding up modal!</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', // Dark overlay behind the modal
  },
  modal: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#007BFF',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
  },
});

export default SlidingUpModal;
