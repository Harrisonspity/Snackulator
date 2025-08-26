import React, { useState, useContext } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';
import { NutritionContext } from '../context/NutritionContext';
import GradientBackground from '../components/common/GradientBackground';

const ProfileSetupScreen = ({ navigation }) => {
  const { userProfile, setUserProfile, setHasCompletedOnboarding, hasCompletedOnboarding } = useContext(UserContext);
  const { resetNutritionData } = useContext(NutritionContext);
  const [name, setName] = useState(userProfile?.name || '');
  const [targetCalories, setTargetCalories] = useState(userProfile?.targetCalories?.toString() || '2000');

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }

    const profile = {
      name,
      targetCalories: parseInt(targetCalories) || 2000,
      createdAt: userProfile?.createdAt || new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setUserProfile(profile);
      
      // For existing users editing profile, just go back
      if (hasCompletedOnboarding) {
        navigation.goBack();
      } else {
        // For new users, set onboarding complete which will trigger navigation
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      '⚠️ Reset All Data',
      'This will delete all your data including:\n\n• Your profile\n• Food history\n• Daily calories\n• All settings\n\nThis cannot be undone. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all AsyncStorage data
              await AsyncStorage.clear();
              
              // Reset context states
              setUserProfile(null);
              resetNutritionData();
              
              // Show success message
              Alert.alert('Success', 'All data has been reset. Starting fresh!');
              
              // Set hasCompletedOnboarding to false last - this will trigger navigation
              // The conditional rendering in AppNavigator will automatically show Welcome screen
              setHasCompletedOnboarding(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data');
              console.error('Reset error:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <GradientBackground variant="premium">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>{hasCompletedOnboarding ? 'Edit Profile' : 'Create Your Profile'}</Text>
            <Text style={styles.subtitle}>{hasCompletedOnboarding ? 'Update your settings' : "Let's personalize your experience"}</Text>
          </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Daily Calorie Target</Text>
            <TextInput
              style={styles.input}
              value={targetCalories}
              onChangeText={setTargetCalories}
              placeholder="2000"
              keyboardType="numeric"
              placeholderTextColor="#6B7280"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>{hasCompletedOnboarding ? 'Save Changes' : 'Complete Setup'}</Text>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Reset Data Button - Only show if user has completed onboarding */}
          {hasCompletedOnboarding && (
            <View style={styles.dangerZone}>
              <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
              <TouchableOpacity style={styles.resetButton} onPress={handleResetData}>
                <Ionicons name="trash-outline" size={20} color="#FF4444" />
                <Text style={styles.resetButtonText}>Reset All Data</Text>
              </TouchableOpacity>
              <Text style={styles.warningText}>This will delete all your data and start fresh</Text>
            </View>
          )}
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    color: '#ffffff',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginLeft: 8,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dangerZone: {
    marginTop: 40,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  dangerZoneTitle: {
    fontSize: 14,
    color: '#FF4444',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.2)',
  },
  resetButtonText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ProfileSetupScreen;