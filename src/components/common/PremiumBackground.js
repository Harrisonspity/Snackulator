import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const PremiumBackground = ({ children, variant = 'default' }) => {
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create smooth floating animation
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(animatedValue1, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue1, {
            toValue: 0,
            duration: 20000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View style={styles.container}>
      {/* Purple to Blue Gradient Background */}
      <Svg style={StyleSheet.absoluteFillObject} width={width} height={height}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2E3192" stopOpacity="1" />
            <Stop offset="50%" stopColor="#1B1464" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0A0E27" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#4B6CB7" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#182848" stopOpacity="0.1" />
          </LinearGradient>
        </Defs>
        
        {/* Main gradient background */}
        <Rect x="0" y="0" width={width} height={height} fill="url(#grad1)" />
        
        {/* Overlay gradient for depth */}
        <Rect x="0" y="0" width={width} height={height / 2} fill="url(#grad2)" />
      </Svg>

      {/* Geometric Shapes - Top Left */}
      <Animated.View 
        style={[
          styles.geometricShape1,
          {
            transform: [
              { translateY },
              { rotate: '45deg' },
            ],
          },
        ]}
      >
        <View style={styles.cube} />
      </Animated.View>

      {/* Geometric Shapes - Bottom Right */}
      <Animated.View 
        style={[
          styles.geometricShape2,
          {
            transform: [
              { translateY: Animated.multiply(translateY, -1) },
              { rotate: '30deg' },
            ],
          },
        ]}
      >
        <View style={styles.cube2} />
      </Animated.View>

      {/* Floating Orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

      {/* 3D Card Elements */}
      <Animated.View 
        style={[
          styles.floatingCard,
          {
            transform: [
              { translateY },
              { rotate: '-15deg' },
            ],
          },
        ]}
      />

      {/* Content Layer */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  geometricShape1: {
    position: 'absolute',
    top: 60,
    left: -30,
    width: 80,
    height: 80,
  },
  cube: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(91, 163, 245, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(91, 163, 245, 0.2)',
  },
  geometricShape2: {
    position: 'absolute',
    bottom: 100,
    right: -20,
    width: 60,
    height: 60,
  },
  cube2: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
  },
  orb1: {
    position: 'absolute',
    top: '20%',
    right: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  orb2: {
    position: 'absolute',
    bottom: '30%',
    left: 20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
  },
  orb3: {
    position: 'absolute',
    top: '50%',
    right: '40%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(147, 51, 234, 0.05)',
  },
  floatingCard: {
    position: 'absolute',
    top: '35%',
    left: 40,
    width: 120,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#5B63F5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
});

export default PremiumBackground;