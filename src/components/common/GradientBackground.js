import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const GradientBackground = ({ children, variant = 'default' }) => {
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create smooth floating animation for gradient orbs
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(animatedValue1, {
            toValue: 1,
            duration: 15000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue1, {
            toValue: 0,
            duration: 15000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(animatedValue2, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue2, {
            toValue: 0,
            duration: 20000,
            useNativeDriver: true,
          }),
        ]),
        // Subtle pulse effect
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 10000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const translateY1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const translateX1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const translateY2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const translateX2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const getBackgroundColor = () => {
    switch (variant) {
      case 'purple':
        return '#1B1464';
      case 'blue':
        return '#0A0E27';
      case 'mesh':
        return '#0A0E27';
      case 'premium':
        return '#0A0E27';
      default:
        return '#0A0E27';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {/* Base gradient layer */}
      <View style={styles.baseGradient} />
      
      {/* Animated gradient orbs for depth */}
      <Animated.View
        style={[
          styles.orb,
          styles.orb1,
          {
            transform: [
              { translateY: translateY1 },
              { translateX: translateX1 },
              { scale: pulseAnim },
            ],
          },
        ]}
      />
      
      <Animated.View
        style={[
          styles.orb,
          styles.orb2,
          {
            transform: [
              { translateY: translateY2 },
              { translateX: translateX2 },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.orb,
          styles.orb3,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Grid pattern overlay for texture */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} style={styles.gridLine} />
        ))}
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#000000',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  orb: {
    position: 'absolute',
    borderRadius: 1000,
  },
  orb1: {
    width: width * 1.2,
    height: width * 1.2,
    top: -width * 0.3,
    left: -width * 0.2,
    backgroundColor: '#5B63F5',
    opacity: 0.12,
  },
  orb2: {
    width: width * 1.5,
    height: width * 1.5,
    bottom: -width * 0.5,
    right: -width * 0.4,
    backgroundColor: '#7C3AED',
    opacity: 0.08,
  },
  orb3: {
    width: width * 0.8,
    height: width * 0.8,
    top: height * 0.3,
    right: -width * 0.3,
    backgroundColor: '#4B6CB7',
    opacity: 0.06,
  },
  gridOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.02,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 30,
  },
});

export default GradientBackground;