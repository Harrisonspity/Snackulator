import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Title, Paragraph } from 'react-native-elements';
import { analyzeFoodImage, getAvailableServices, validateApiKeys } from './services/ai-analysis';
import * as Sentry from 'sentry-expo';

// Initialize Sentry
Sentry.init({
  dsn: 'https://YOUR-DSN-HERE@sentry.io/YOUR-PROJECT-ID',
  enableInExpoDevelopment: true,
  debug: true, // Remove this in production
  environment: __DEV__ ? 'development' : 'production',
});

const { width } = Dimensions.get('window');

export default function App() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [history, setHistory] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasPermission(status === 'granted');
        loadHistory();
        
        // Log app start to Sentry
        Sentry.Native.captureMessage('App started successfully', 'info');
      } catch (error) {
        Sentry.Native.captureException(error);
        console.error('Startup error:', error);
      }
    })();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('nutritionHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const saveToHistory = async (newEntry) => {
    try {
      const updatedHistory = [newEntry, ...history.slice(0, 9)]; // Keep last 10 entries
      await AsyncStorage.setItem('nutritionHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.log('Error saving history:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        setNutritionData(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        setNutritionData(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please select or take a photo first');
      return;
    }

    setAnalyzing(true);
    
    // Start smooth loading animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    try {
      // Use the AI analysis service (change to 'MOCK' for testing without API key)
      const nutritionData = await analyzeFoodImage(image, 'OPENAI');
      setNutritionData(nutritionData);
      saveToHistory(nutritionData);
      
      // Smooth reveal animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Provide helpful error messages
      let errorMessage = 'Failed to analyze the image. Please try again.';
      if (error.message.includes('API key not configured')) {
        errorMessage = 'OpenAI API key not configured.\n\n1. Create a .env file in the project root\n2. Add: EXPO_PUBLIC_OPENAI_API_KEY=your-key\n3. Restart the Expo server';
      } else if (error.message.includes('Invalid OpenAI API key')) {
        errorMessage = 'Invalid OpenAI API key. Please check your API key in the .env file.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'API rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Analysis Failed', errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setNutritionData(null);
  };

  const renderNutritionCard = () => {
    if (!nutritionData) return null;

    return (
      <Card containerStyle={styles.nutritionCard}>
        <Card.Title style={styles.cardTitle}>Nutritional Analysis</Card.Title>
        <View style={styles.nutritionContent}>
          <Text style={styles.foodName}>{nutritionData.foodName}</Text>
          <Text style={styles.confidence}>Confidence: {(nutritionData.confidence * 100).toFixed(1)}%</Text>
          
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>{nutritionData.calories}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>{nutritionData.protein}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>{nutritionData.carbs}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>{nutritionData.fat}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Fiber</Text>
              <Text style={styles.nutritionValue}>{nutritionData.fiber}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Sugar</Text>
              <Text style={styles.nutritionValue}>{nutritionData.sugar}</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const renderHistoryItem = (item, index) => (
    <Card key={index} containerStyle={styles.historyCard}>
      <View style={styles.historyContent}>
        <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
        <View style={styles.historyText}>
          <Text style={styles.historyFoodName}>{item.foodName}</Text>
          <Text style={styles.historyCalories}>{item.calories} calories</Text>
          <Text style={styles.historyDate}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition AI Analyzer</Text>
        <Text style={styles.subtitle}>Take a photo to analyze nutritional content</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Take Photo"
            onPress={takePhoto}
            buttonStyle={styles.primaryButton}
            titleStyle={styles.buttonText}
            icon={{
              name: 'camera',
              type: 'feather',
              size: 20,
              color: 'white',
            }}
          />
          
          <Button
            title="Pick from Gallery"
            onPress={pickImage}
            buttonStyle={styles.secondaryButton}
            titleStyle={styles.secondaryButtonText}
            icon={{
              name: 'image',
              type: 'feather',
              size: 20,
              color: '#6C63FF',
            }}
          />

          {image && (
            <Button
              title={analyzing ? "Analyzing..." : "Analyze with AI"}
              onPress={analyzeImage}
              disabled={analyzing}
              buttonStyle={styles.analyzeButton}
              titleStyle={styles.buttonText}
              icon={
                analyzing ? null : {
                  name: 'brain',
                  type: 'feather',
                  size: 20,
                  color: 'white',
                }
              }
            />
          )}
        </View>

        {analyzing && (
          <Animated.View style={[styles.loadingContainer, {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }]}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={styles.loadingText}>Analyzing your food...</Text>
          </Animated.View>
        )}

        {renderNutritionCard()}

        {history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Recent Analysis</Text>
            {history.map(renderHistoryItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    backgroundColor: 'transparent',
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  previewImage: {
    width: width - 60,
    height: (width - 60) * 0.75,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  clearButton: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
  },
  clearButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonContainer: {
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 30,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E8E8F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  analyzeButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 30,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 30,
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 15,
    color: '#95A5A6',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  nutritionCard: {
    borderRadius: 20,
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    letterSpacing: 0.3,
  },
  nutritionContent: {
    alignItems: 'center',
    padding: 5,
  },
  foodName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#6C63FF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  confidence: {
    fontSize: 14,
    color: '#95A5A6',
    marginBottom: 20,
    fontWeight: '500',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: '#F8F9FB',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EEF2',
  },
  nutritionLabel: {
    fontSize: 13,
    color: '#95A5A6',
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  historySection: {
    marginTop: 30,
    paddingHorizontal: 5,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  historyCard: {
    borderRadius: 16,
    marginBottom: 12,
    padding: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyImage: {
    width: 65,
    height: 65,
    borderRadius: 12,
    marginRight: 15,
  },
  historyText: {
    flex: 1,
  },
  historyFoodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    letterSpacing: 0.3,
  },
  historyCalories: {
    fontSize: 14,
    color: '#6C63FF',
    marginTop: 4,
    fontWeight: '500',
  },
  historyDate: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 4,
    fontWeight: '400',
  },
});
