import React from 'react';
import { Modal, SafeAreaView, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/common/Button';

const WelcomeScreen = ({ visible, onGetStarted, styles }) => (
  <Modal visible={visible} animationType="fade" transparent={false}>
    <SafeAreaView style={styles.welcomeContainer}>
      <View style={styles.welcomeContent}>
        <View style={styles.welcomeHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="nutrition" size={80} color="#007AFF" />
          </View>
          <Text style={styles.welcomeTitle}>Snackulator</Text>
          <Text style={styles.welcomeSubtitle}>
            Created by Harrison Spitnale
          </Text>
        </View>

        <View style={styles.welcomeFeatures}>
          <View style={styles.featureItem}>
            <Ionicons name="camera" size={30} color="#007AFF" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Snap & Track</Text>
              <Text style={styles.featureDescription}>
                Take photos to log calories instantly
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="trending-up" size={30} color="#007AFF" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Daily Goals</Text>
              <Text style={styles.featureDescription}>
                Track calories against your personal goal
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="calendar" size={30} color="#007AFF" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>History</Text>
              <Text style={styles.featureDescription}>
                View your daily calorie intake over time
              </Text>
            </View>
          </View>
        </View>

        <Button 
          style={styles.getStartedButton}
          onPress={onGetStarted}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Button>
      </View>
    </SafeAreaView>
  </Modal>
);

export default WelcomeScreen;