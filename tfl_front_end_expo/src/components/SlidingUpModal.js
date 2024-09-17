import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View, Text } from 'react-native';
import JourneyLog from './ModalContent'; // Import your JourneyLog component

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SlidingModal = ({ pathData }) => {
  console.log(pathData);
  const timeTaken = pathData.total_time_in_minutes;
  const JourneyPath = pathData.path;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // Start off-screen
  const lastTranslateY = useRef(SCREEN_HEIGHT); // Keep track of last position with a ref
  const [modalPosition, setModalPosition] = useState('closed'); // closed, half, full

  useEffect(() => {
    modalPosition === 'closed' && snapToPosition('closed');
  });

  // Define the snap points for the modal
  const SNAP_POINTS = {
    closed: SCREEN_HEIGHT - 50,
    half: SCREEN_HEIGHT / 2,
    full: 200,
  };

  // Function to smoothly snap to the nearest modal position
  const snapToPosition = (position) => {
    setModalPosition(position);
    Animated.spring(translateY, {
      toValue: SNAP_POINTS[position], // Snap to the specified position
      useNativeDriver: true,
      friction: 8, // Adjust for a smoother spring animation
    }).start(() => {
      lastTranslateY.current = SNAP_POINTS[position]; // Update lastTranslateY after animation
    });
  };

  // PanResponder for controlling the modal (dragging it)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // Calculate the new translateY dynamically based on gesture movement
        const newTranslateY = Math.max(lastTranslateY.current + gestureState.dy, 0);
        translateY.setValue(newTranslateY);
      },
      onPanResponderRelease: (event, gestureState) => {
        const newPosition = lastTranslateY.current + gestureState.dy;

        // Calculate the difference between the current position and each snap point
        const diffToClosed = Math.abs(newPosition - SNAP_POINTS.closed);
        const diffToHalf = Math.abs(newPosition - SNAP_POINTS.half);
        const diffToFull = Math.abs(newPosition - SNAP_POINTS.full);

        // Snap to the closest position (closed, half, or full)
        if (diffToClosed < diffToHalf && diffToClosed < diffToFull) {
          snapToPosition('closed');
        } else if (diffToHalf < diffToClosed && diffToHalf < diffToFull) {
          snapToPosition('half');
        } else {
          snapToPosition('full');
        }
      },
    })
  ).current;


  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: '100%',
        height: SCREEN_HEIGHT,
        backgroundColor: 'white',
        transform: [{ translateY }],
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      }}
      {...panResponder.panHandlers}
    >

      {/* Journey Log */}
      <JourneyLog timeTaken={timeTaken} journeyPath={JourneyPath} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    width: '100%',
    height: '100%', // Make it cover the screen
    backgroundColor: 'white',
    // transform: [{ translateY }],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    padding: 20,
    zindex: 1000,
    elevation: 1000,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default SlidingModal;
