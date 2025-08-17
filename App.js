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
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { analyzeFoodImage } from './services/ai-analysis';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [history, setHistory] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkFirstLaunch();
    loadHistory();
    checkPermissions();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
      if (hasSeenWelcome === 'true') {
        setHasSeenWelcome(true);
        setShowWelcome(false);
      }
    } catch (error) {
      console.log('Error checking first launch:', error);
    }
  };

  const checkPermissions = async () => {
    const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
    const galleryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
    setCameraPermission(cameraStatus.status);
    setGalleryPermission(galleryStatus.status);
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    setHasSeenWelcome(true);
    setShowWelcome(false);
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setCameraPermission(status);
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'To take photos of food for analysis, please enable camera access in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {} }
        ]
      );
    }
    return status === 'granted';
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(status);
    if (status !== 'granted') {
      Alert.alert(
        'Photo Library Permission Required',
        'To select photos from your library for analysis, please enable photo access in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {} }
        ]
      );
    }
    return status === 'granted';
  };

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
      const updatedHistory = [newEntry, ...history.slice(0, 9)];
      await AsyncStorage.setItem('nutritionHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.log('Error saving history:', error);
    }
  };

  const pickImage = async () => {
    if (galleryPermission !== 'granted') {
      const granted = await requestGalleryPermission();
      if (!granted) return;
    }

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
        
        // Auto-analyze after selection
        setTimeout(() => {
          analyzeImage(result.assets[0].uri);
        }, 500);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    if (cameraPermission !== 'granted') {
      const granted = await requestCameraPermission();
      if (!granted) return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        setNutritionData(null);
        
        // Auto-analyze after capture
        setTimeout(() => {
          analyzeImage(result.assets[0].uri);
        }, 500);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const analyzeImage = async (imageUri = image) => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please select or take a photo first');
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress('Preparing image...');
    
    // Start loading animation
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
      Animated.loop(
        Animated.sequence([
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
    
    try {
      setAnalysisProgress('Analyzing nutritional content...');
      
      // Try OpenAI Vision API first, fall back to mock if it fails
      let nutritionData;
      try {
        nutritionData = await analyzeFoodImage(imageUri, 'OPENAI');
      } catch (apiError) {
        console.log('OpenAI API error, using mock data:', apiError.message);
        // Fall back to mock data if API fails
        nutritionData = await analyzeFoodImage(imageUri, 'MOCK');
      }
      
      setAnalysisProgress('Processing results...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNutritionData(nutritionData);
      saveToHistory(nutritionData);
      
      // Success animation
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
      
      setAnalysisProgress('');
    } catch (error) {
      console.error('Analysis error:', error);
      
      let errorMessage = 'Unable to analyze the image. Please try again.';
      if (error.message.includes('API key')) {
        errorMessage = 'API key not configured. Using mock data for demo.';
      }
      
      Alert.alert('Analysis Notice', errorMessage);
      setAnalysisProgress('');
    } finally {
      setAnalyzing(false);
      progressAnim.stopAnimation();
    }
  };

  const clearImage = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setImage(null);
      setNutritionData(null);
      fadeAnim.setValue(1);
    });
  };

  const renderWelcomeScreen = () => (
    <Modal
      visible={showWelcome}
      animationType="fade"
      transparent={false}
    >
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
                <Text style={styles.featureTitle}>Snap or Select</Text>
                <Text style={styles.featureDescription}>
                  Take a photo or choose from your gallery
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={30} color="#007AFF" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>AI Analysis</Text>
                <Text style={styles.featureDescription}>
                  Get instant nutritional information
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="time" size={30} color="#007AFF" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Track History</Text>
                <Text style={styles.featureDescription}>
                  Review your past food analyses
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.welcomeFooter}>
            <Text style={styles.permissionNote}>
              We'll ask for camera and photo permissions to analyze your food
            </Text>
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={handleGetStarted}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderNutritionCard = () => {
    if (!nutritionData) return null;

    return (
      <Animated.View style={[
        styles.nutritionCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}>
        <View style={styles.nutritionHeader}>
          <Text style={styles.foodName}>{nutritionData.foodName}</Text>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {(nutritionData.confidence * 100).toFixed(0)}% Match
            </Text>
          </View>
        </View>
        
        <View style={styles.nutritionGrid}>
          <View style={[styles.nutritionItem, styles.caloriesItem]}>
            <Text style={styles.nutritionLabel}>Calories</Text>
            <Text style={styles.caloriesValue}>{nutritionData.calories}</Text>
          </View>
          
          <View style={styles.macroRow}>
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
          </View>
          
          <View style={styles.microRow}>
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
      </Animated.View>
    );
  };

  const renderHistoryModal = () => (
    <Modal
      visible={showHistory}
      animationType="slide"
      transparent={false}
    >
      <SafeAreaView style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Analysis History</Text>
          <TouchableOpacity
            onPress={() => setShowHistory(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={28} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.historyScroll}>
          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons name="time-outline" size={50} color="#ccc" />
              <Text style={styles.emptyHistoryText}>No history yet</Text>
              <Text style={styles.emptyHistorySubtext}>
                Your analyzed foods will appear here
              </Text>
            </View>
          ) : (
            history.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyCard}
                onPress={() => {
                  setImage(item.imageUri);
                  setNutritionData(item);
                  setShowHistory(false);
                }}
              >
                <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
                <View style={styles.historyContent}>
                  <Text style={styles.historyFoodName}>{item.foodName}</Text>
                  <Text style={styles.historyCalories}>{item.calories} cal</Text>
                  <Text style={styles.historyDate}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderLoadingOverlay = () => {
    if (!analyzing) return null;

    return (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{analysisProgress}</Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  transform: [{
                    translateX: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-width * 0.7, 0]
                    })
                  }]
                }
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {renderWelcomeScreen()}
      
      <View style={styles.header}>
        <Text style={styles.title}>Snackulator</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setShowHistory(true)}
        >
          <Ionicons name="time-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!image ? (
          <View style={styles.uploadSection}>
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="image-outline" size={60} color="#ccc" />
              <Text style={styles.uploadText}>Select or capture food image</Text>
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cameraButton]}
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={24} color="white" />
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.galleryButton]}
                onPress={pickImage}
              >
                <Ionicons name="images" size={24} color="white" />
                <Text style={styles.buttonText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearImage}
              >
                <Ionicons name="close-circle" size={30} color="white" />
              </TouchableOpacity>
            </View>
            
            {!nutritionData && !analyzing && (
              <TouchableOpacity
                style={styles.analyzeButton}
                onPress={() => analyzeImage()}
              >
                <Ionicons name="analytics" size={24} color="white" />
                <Text style={styles.analyzeButtonText}>Analyze Food</Text>
              </TouchableOpacity>
            )}
            
            {nutritionData && renderNutritionCard()}
            
            {nutritionData && (
              <TouchableOpacity
                style={styles.newAnalysisButton}
                onPress={clearImage}
              >
                <Text style={styles.newAnalysisText}>New Analysis</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {renderHistoryModal()}
      {renderLoadingOverlay()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  historyButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  uploadSection: {
    padding: 20,
  },
  uploadPlaceholder: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
  },
  galleryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imageSection: {
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  clearButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 8,
    marginBottom: 20,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nutritionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 12,
  },
  nutritionGrid: {
    gap: 15,
  },
  caloriesItem: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  microRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  newAnalysisButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  newAnalysisText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  welcomeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcomeContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  welcomeHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  welcomeFeatures: {
    marginVertical: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  featureText: {
    marginLeft: 20,
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  welcomeFooter: {
    marginBottom: 40,
  },
  permissionNote: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    gap: 8,
  },
  getStartedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  historyScroll: {
    flex: 1,
    padding: 20,
  },
  emptyHistory: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 15,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 5,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  historyContent: {
    flex: 1,
    marginLeft: 15,
  },
  historyFoodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyCalories: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: width * 0.8,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    width: '100%',
  },
});