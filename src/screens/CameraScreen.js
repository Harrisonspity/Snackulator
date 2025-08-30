import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { NutritionContext } from '../context/NutritionContext';
import { analyzeFoodImage } from '../services/ai-analysis';
import GradientBackground from '../components/common/GradientBackground';

const CameraScreen = ({ navigation }) => {
  const { dailyCalories, setDailyCalories, dailyFoods, setDailyFoods } = useContext(NutritionContext);
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    // Request camera permissions on mount
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: false,  // Don't need base64 here since we convert it ourselves
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0]);
      setNutritionData(null);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: false,  // Don't need base64 here since we convert it ourselves
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0]);
      setNutritionData(null);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please take or select a photo first.');
      return;
    }

    setAnalyzing(true);
    try {
      // Using OpenAI GPT-4 Vision for real food analysis
      const data = await analyzeFoodImage(image, 'OPENAI');
      setNutritionData(data);
    } catch (error) {
      Alert.alert('Analysis Failed', 'Could not analyze the image. Please try again.');
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveFood = () => {
    try {
      if (!nutritionData) return;
      console.log(nutritionData);
      const newFood = {
        ...nutritionData,
        timestamp: new Date().toISOString(),
        imageUri: image.uri,
      };
    } catch (error) {
      console.error('Save food error:', error);
      Alert.alert('Error', 'Failed to save food. Please try again.');
    }


    // Update daily totals
    setDailyCalories(dailyCalories + nutritionData.calories);
    setDailyFoods([...dailyFoods, newFood]);

    // Navigate back to dashboard
    Alert.alert('Success', 'Food logged successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const resetCapture = () => {
    setImage(null);
    setNutritionData(null);
  };

  if (hasPermission === false) {
    return (
      <GradientBackground variant="premium">
        <SafeAreaView style={styles.container}>
          <View style={styles.centerContent}>
          <Ionicons name="camera-off" size={64} color="#999" />
          <Text style={styles.noPermissionText}>Camera permission not granted</Text>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="mesh">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1E88E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Food</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {!image ? (
          <View style={styles.captureSection}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={64} color="#999" />
              <Text style={styles.placeholderText}>Take a photo of your food</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                <Ionicons name="camera" size={32} color="white" />
                <Text style={styles.captureButtonText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                <Ionicons name="images" size={32} color="#007AFF" />
                <Text style={styles.galleryButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imageSection}>
            <Image source={{ uri: image.uri }} style={styles.capturedImage} />
            
            <View style={styles.imageActions}>
              <TouchableOpacity style={styles.retakeButton} onPress={resetCapture}>
                <Ionicons name="refresh" size={20} color="#666" />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>

              {!nutritionData && (
                <TouchableOpacity 
                  style={[styles.analyzeButton, analyzing && styles.disabledButton]} 
                  onPress={analyzeImage}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Ionicons name="analytics" size={20} color="white" />
                      <Text style={styles.analyzeText}>Analyze</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {nutritionData && (
              <View style={styles.nutritionCard}>
                <Text style={styles.foodName}>{nutritionData.foodName}</Text>
                
                <View style={styles.calorieRow}>
                  <Text style={styles.calorieLabel}>Calories</Text>
                  <Text style={styles.calorieValue}>{nutritionData.calories}</Text>
                </View>

                <View style={styles.macroRow}>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Protein</Text>
                    <Text style={styles.macroValue}>{nutritionData.protein}</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Carbs</Text>
                    <Text style={styles.macroValue}>{nutritionData.carbs}</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Fat</Text>
                    <Text style={styles.macroValue}>{nutritionData.fat}</Text>
                  </View>
                </View>

                {nutritionData.confidence && (
                  <Text style={styles.confidence}>
                    Confidence: {Math.round(nutritionData.confidence * 100)}%
                  </Text>
                )}

                <TouchableOpacity style={styles.saveButton} onPress={saveFood}>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text style={styles.saveButtonText}>Log This Food</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noPermissionText: {
    fontSize: 16,
    color: '#6B7280',
    marginVertical: 16,
  },
  captureSection: {
    flex: 1,
    padding: 20,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 300,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  galleryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  galleryButtonText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imageSection: {
    padding: 20,
  },
  capturedImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  retakeText: {
    color: '#6B7280',
    fontSize: 16,
    marginLeft: 8,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1E88E5',
    borderRadius: 12,
  },
  analyzeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  nutritionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16,
  },
  calorieLabel: {
    fontSize: 18,
    color: '#6B7280',
  },
  calorieValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  confidence: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScreen;