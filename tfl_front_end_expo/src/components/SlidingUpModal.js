import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SlidingModal = () => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // Start off-screen
  const lastTranslateY = useRef(SCREEN_HEIGHT); // Keep track of last position with a ref
  const [modalPosition, setModalPosition] = useState('closed'); // closed, half, full

  useEffect(() => {
    modalPosition === 'closed' && snapToPosition('closed');
  });

  // Define the snap points for the modal
  const SNAP_POINTS = {
    closed: SCREEN_HEIGHT - 100,
    half: SCREEN_HEIGHT / 2,
    full: 160,
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
      {/* Your modal content goes here */}
    </Animated.View>
  );
};

export default SlidingModal;
