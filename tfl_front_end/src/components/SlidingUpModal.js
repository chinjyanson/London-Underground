import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const SlidingUpModal = () => {
  const [visible, setVisible] = useState(false);
  const modalHeight = 400;
  const translateY = useSharedValue(modalHeight);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      if (translateY.value > modalHeight / 2) {
        translateY.value = withSpring(modalHeight, { damping: 50 });
        setTimeout(() => setVisible(false), 300);  // Close the modal when sliding down
      } else {
        translateY.value = withSpring(0, { damping: 50 });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(translateY.value, [0, modalHeight], [0, modalHeight], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const openModal = () => {
    setVisible(true);
    translateY.value = withSpring(0, { damping: 50 });
  };

  const closeModal = () => {
    translateY.value = withSpring(modalHeight, { damping: 50 });
    setTimeout(() => setVisible(false), 300);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.button}>
        <Text style={styles.buttonText}>Open Sliding Modal</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.modal, animatedStyle]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>This is a sliding up modal!</Text>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    height: 400,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'flex-end',
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
