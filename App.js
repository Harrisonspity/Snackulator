import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Title, Paragraph } from 'react-native-elements';
import { analyzeFoodImage, getAvailableServices, validateApiKeys } from './services/ai-analysis';

export default function App() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [history, setHistory] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
      loadHistory();
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
    try {
      // Use the AI analysis service (change to 'MOCK' for testing without API key)
      const nutritionData = await analyzeFoodImage(image, 'OPENAI');
      setNutritionData(nutritionData);
      saveToHistory(nutritionData);
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
              color: '#007AFF',
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Analyzing your food...</Text>
          </View>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 300,
    height: 225,
    borderRadius: 15,
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  analyzeButton: {
    backgroundColor: '#34C759',
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  nutritionCard: {
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  nutritionContent: {
    alignItems: 'center',
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  confidence: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  historySection: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historyCard: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  historyText: {
    flex: 1,
  },
  historyFoodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyCalories: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
