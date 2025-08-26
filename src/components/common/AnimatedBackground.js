import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AnimatedBackground = ({ children, variant = 'default' }) => {
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create smooth floating animation
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

  const getGradientColors = () => {
    switch (variant) {
      case 'purple':
        return ['#0a0015', '#1a0033', '#0a0015'];
      case 'blue':
        return ['#000511', '#001133', '#000511'];
      case 'dark':
        return ['#000000', '#0a0a1f', '#000000'];
      default:
        return ['#000000', '#0f1419', '#000000'];
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Animated gradient orbs for depth */}
      <Animated.View
        style={[
          styles.orb,
          styles.orb1,
          {
            transform: [
              { translateY: translateY1 },
              { translateX: translateX1 },
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

      {/* Subtle mesh overlay */}
      <View style={styles.meshOverlay} />
      
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
    backgroundColor: '#000000',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
    backgroundColor: '#1E88E5',
    opacity: 0.05,
  },
  orb2: {
    width: width * 1.5,
    height: width * 1.5,
    bottom: -width * 0.5,
    right: -width * 0.4,
    backgroundColor: '#7C3AED',
    opacity: 0.03,
  },
  meshOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.02,
    // Creates subtle texture
    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(30, 136, 229, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)`,
  },
});

export default AnimatedBackground;