import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/common/Button';
import GradientBackground from '../components/common/GradientBackground';

const WelcomeScreen = ({ navigation }) => {
  const onGetStarted = () => {
    navigation.navigate('ProfileSetup');
  };

  return (
    <GradientBackground variant="premium">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeHeader}>
              {/* App icon with glow effect */}
              <View style={styles.iconContainer}>
                <View style={[styles.iconGradient, { backgroundColor: 'transparent' }]}>
                  <Image 
                    source={require('../../assets/adaptive-icon.png')}
                    style={styles.appIcon}
                    resizeMode="contain"
                  />
                </View>
              </View>
              
              <Text style={styles.welcomeTitle}>Snackulator</Text>
              <Text style={styles.welcomeSubtitle}>
                Track your nutrition effortlessly
              </Text>
            </View>

            {/* Feature cards with glass morphism effect */}
            <View style={styles.welcomeFeatures}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="camera" size={24} color="#9CA3F5" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Snap & Track</Text>
                  <Text style={styles.featureDescription}>
                    Instantly analyze your meals
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="trending-up" size={24} color="#9CA3F5" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Smart Goals</Text>
                  <Text style={styles.featureDescription}>
                    Personalized nutrition targets
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="stats-chart" size={24} color="#9CA3F5" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Track Progress</Text>
                  <Text style={styles.featureDescription}>
                    Visualize your journey
                  </Text>
                </View>
              </View>
            </View>

            {/* Get Started button with gradient effect */}
            <View style={[styles.getStartedButton, { backgroundColor: '#5B63F5' }]}>
              <Button 
                style={styles.buttonInner}
                onPress={onGetStarted}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </Button>
            </View>
          </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  
  // Safe area to avoid notches
  safeArea: {
    flex: 1,
  },
  
  // Content wrapper with padding
  welcomeContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  
  // Header section styling
  welcomeHeader: {
    alignItems: 'center',
    marginTop: 60,
  },
  
  // Icon container with shadow for depth
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 24,
    // Shadow for iOS
    shadowColor: '#5B63F5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    // Shadow for Android
    elevation: 10,
  },
  
  // Gradient inside icon container
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(91, 99, 245, 0.1)',
  },
  
  // App icon image
  appIcon: {
    width: 130,
    height: 130,
  },
  
  // App title - large and bold
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 0.5, // Adds spacing between letters
  },
  
  // Subtitle with muted color
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280', // Muted blue-gray
    fontWeight: '400',
  },
  
  // Features container
  welcomeFeatures: {
    marginVertical: 32,
  },
  
  // Individual feature card with glass effect
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  
  // Icon container for features
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(91, 99, 245, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  // Feature text container
  featureText: {
    flex: 1,
  },
  
  // Feature title
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  
  // Feature description
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  
  // Get Started button gradient container
  getStartedButton: {
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    // Shadow for depth
    shadowColor: '#5B63F5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  
  // Inner button styling
  buttonInner: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  
  // Button text
  getStartedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
});

export default WelcomeScreen;