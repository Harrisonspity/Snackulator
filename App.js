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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { analyzeFoodImage } from './services/ai-analysis';
import { 
  calculateDailyCalories, 
  formatDateKey, 
  getDisplayDate,
  getCalorieGoal 
} from './utils/calorieCalculator';

const { width, height } = Dimensions.get('window');

export default function App() {
  // Onboarding states
  const [showWelcome, setShowWelcome] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  // User profile
  const [userProfile, setUserProfile] = useState({
    name: '',
    gender: '',
    age: '',
    weight: '',
    heightFeet: '',
    heightInches: '',
    activityLevel: 'light',
    goal: 'maintain'
  });
  
  // Dashboard states
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'camera'
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const [dailyCalories, setDailyCalories] = useState({});
  const [dailyFoods, setDailyFoods] = useState({});
  const [calorieGoal, setCalorieGoal] = useState(2000);
  
  // Camera/Analysis states
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (userProfile.gender && userProfile.age && userProfile.weight && userProfile.heightFeet && userProfile.heightInches) {
      // Convert feet and inches to total inches
      const heightInInches = (parseInt(userProfile.heightFeet) * 12) + parseInt(userProfile.heightInches);
      
      const goal = calculateDailyCalories(
        userProfile.gender,
        parseInt(userProfile.age),
        parseInt(userProfile.weight),
        heightInInches,
        userProfile.activityLevel
      );
      const adjustedGoal = getCalorieGoal(goal, userProfile.goal);
      setCalorieGoal(adjustedGoal);
    }
  }, [userProfile]);

  const initializeApp = async () => {
    try {
      // Check onboarding status
      const hasCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
      if (hasCompleted === 'true') {
        setHasCompletedOnboarding(true);
        setShowWelcome(false);
        setShowProfileSetup(false);
        await loadUserProfile();
        await loadDailyData();
      }
      
      checkPermissions();
    } catch (error) {
      console.log('Error initializing app:', error);
    }
  };

  const checkPermissions = async () => {
    const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
    const galleryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
    setCameraPermission(cameraStatus.status);
    setGalleryPermission(galleryStatus.status);
  };

  const loadUserProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      if (profile) {
        setUserProfile(JSON.parse(profile));
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const saveUserProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
      setShowProfileSetup(false);
    } catch (error) {
      console.log('Error saving profile:', error);
    }
  };

  const loadDailyData = async () => {
    try {
      const calories = await AsyncStorage.getItem('dailyCalories');
      const foods = await AsyncStorage.getItem('dailyFoods');
      
      if (calories) setDailyCalories(JSON.parse(calories));
      if (foods) setDailyFoods(JSON.parse(foods));
    } catch (error) {
      console.log('Error loading daily data:', error);
    }
  };

  const saveDailyData = async (calories, foods) => {
    try {
      await AsyncStorage.setItem('dailyCalories', JSON.stringify(calories));
      await AsyncStorage.setItem('dailyFoods', JSON.stringify(foods));
    } catch (error) {
      console.log('Error saving daily data:', error);
    }
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setShowProfileSetup(true);
  };

  const handleProfileComplete = () => {
    if (!userProfile.gender || !userProfile.age || !userProfile.weight || !userProfile.heightFeet || !userProfile.heightInches) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    saveUserProfile();
  };

  const logFoodToDaily = () => {
    if (!nutritionData) return;
    
    const today = formatDateKey(new Date());
    
    // Update daily calories
    const updatedCalories = { ...dailyCalories };
    updatedCalories[today] = (updatedCalories[today] || 0) + nutritionData.calories;
    
    // Update daily foods
    const updatedFoods = { ...dailyFoods };
    if (!updatedFoods[today]) updatedFoods[today] = [];
    updatedFoods[today].push({
      id: Date.now().toString(),
      ...nutritionData,
      timestamp: new Date().toISOString()
    });
    
    setDailyCalories(updatedCalories);
    setDailyFoods(updatedFoods);
    saveDailyData(updatedCalories, updatedFoods);
    
    // Reset and go to dashboard
    setImage(null);
    setNutritionData(null);
    setCurrentView('dashboard');
    
    Alert.alert('Success', `Added ${nutritionData.calories} calories to today's total!`);
  };

  const removeFoodFromDaily = (foodId) => {
    const today = formatDateKey(new Date());
    const todaysFoods = dailyFoods[today] || [];
    const foodToRemove = todaysFoods.find(f => f.id === foodId);
    
    if (!foodToRemove) return;
    
    Alert.alert(
      'Remove Food',
      `Remove ${foodToRemove.foodName} (${foodToRemove.calories} cal)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // Update calories
            const updatedCalories = { ...dailyCalories };
            updatedCalories[today] = Math.max(0, (updatedCalories[today] || 0) - foodToRemove.calories);
            
            // Update foods
            const updatedFoods = { ...dailyFoods };
            updatedFoods[today] = todaysFoods.filter(f => f.id !== foodId);
            
            setDailyCalories(updatedCalories);
            setDailyFoods(updatedFoods);
            saveDailyData(updatedCalories, updatedFoods);
          }
        }
      ]
    );
  };

  const changeDate = (direction) => {
    const current = new Date(selectedDate + 'T00:00:00');
    const newDate = new Date(current);
    newDate.setDate(current.getDate() + direction);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't go beyond today
    if (newDate > today) return;
    
    setSelectedDate(formatDateKey(newDate));
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setCameraPermission(status);
    return status === 'granted';
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(status);
    return status === 'granted';
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
        setTimeout(() => {
          analyzeImage(result.assets[0].uri);
        }, 500);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const analyzeImage = async (imageUri = image) => {
    if (!imageUri) return;

    setAnalyzing(true);
    setAnalysisProgress('Analyzing food...');
    
    try {
      let nutritionData;
      try {
        nutritionData = await analyzeFoodImage(imageUri, 'OPENAI');
      } catch (apiError) {
        console.log('Using mock data:', apiError.message);
        nutritionData = await analyzeFoodImage(imageUri, 'MOCK');
      }
      
      setNutritionData(nutritionData);
      setAnalysisProgress('');
    } catch (error) {
      Alert.alert('Analysis Failed', 'Unable to analyze the image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setNutritionData(null);
  };

  // Render Welcome Screen
  const renderWelcomeScreen = () => (
    <Modal visible={showWelcome} animationType="fade" transparent={false}>
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

          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  // Render Profile Setup Screen
  const renderProfileSetup = () => (
    <Modal visible={showProfileSetup} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.profileContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.profileContent}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {hasCompletedOnboarding && (
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowProfileSetup(false)}
              >
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            )}
            <Text style={styles.profileTitle}>Let's Set Up Your Profile</Text>
            <Text style={styles.profileSubtitle}>
              We'll calculate your daily calorie goal
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    userProfile.gender === 'male' && styles.genderButtonActive
                  ]}
                  onPress={() => setUserProfile({...userProfile, gender: 'male'})}
                >
                  <Ionicons 
                    name="male" 
                    size={24} 
                    color={userProfile.gender === 'male' ? 'white' : '#007AFF'} 
                  />
                  <Text style={[
                    styles.genderButtonText,
                    userProfile.gender === 'male' && styles.genderButtonTextActive
                  ]}>Male</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    userProfile.gender === 'female' && styles.genderButtonActive
                  ]}
                  onPress={() => setUserProfile({...userProfile, gender: 'female'})}
                >
                  <Ionicons 
                    name="female" 
                    size={24} 
                    color={userProfile.gender === 'female' ? 'white' : '#FF69B4'} 
                  />
                  <Text style={[
                    styles.genderButtonText,
                    userProfile.gender === 'female' && styles.genderButtonTextActive
                  ]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your age"
                keyboardType="number-pad"
                value={userProfile.age}
                onChangeText={(text) => setUserProfile({...userProfile, age: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (lbs)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your weight"
                keyboardType="number-pad"
                value={userProfile.weight}
                onChangeText={(text) => setUserProfile({...userProfile, weight: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height</Text>
              <View style={styles.heightContainer}>
                <TextInput
                  style={[styles.textInput, styles.heightInput]}
                  placeholder="Feet"
                  keyboardType="number-pad"
                  value={userProfile.heightFeet}
                  onChangeText={(text) => setUserProfile({...userProfile, heightFeet: text})}
                />
                <Text style={styles.heightSeparator}>ft</Text>
                <TextInput
                  style={[styles.textInput, styles.heightInput]}
                  placeholder="Inches"
                  keyboardType="number-pad"
                  value={userProfile.heightInches}
                  onChangeText={(text) => setUserProfile({...userProfile, heightInches: text})}
                />
                <Text style={styles.heightSeparator}>in</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Activity Level</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['sedentary', 'light', 'moderate', 'active', 'veryActive'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.activityButton,
                      userProfile.activityLevel === level && styles.activityButtonActive
                    ]}
                    onPress={() => setUserProfile({...userProfile, activityLevel: level})}
                  >
                    <Text style={[
                      styles.activityButtonText,
                      userProfile.activityLevel === level && styles.activityButtonTextActive
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1).replace('veryActive', 'Very Active')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Goal</Text>
              <View style={styles.goalButtons}>
                {['lose', 'maintain', 'gain'].map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.goalButton,
                      userProfile.goal === goal && styles.goalButtonActive
                    ]}
                    onPress={() => setUserProfile({...userProfile, goal: goal})}
                  >
                    <Text style={[
                      styles.goalButtonText,
                      userProfile.goal === goal && styles.goalButtonTextActive
                    ]}>
                      {goal === 'lose' ? 'Lose Weight' : goal === 'maintain' ? 'Maintain' : 'Gain Weight'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.completeProfileButton}
              onPress={handleProfileComplete}
            >
              <Text style={styles.completeProfileText}>Complete Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  // Render Dashboard
  const renderDashboard = () => {
    const todaysCalories = dailyCalories[selectedDate] || 0;
    const todaysFoods = dailyFoods[selectedDate] || [];
    const caloriesRemaining = calorieGoal - todaysCalories;
    const progressPercentage = Math.min((todaysCalories / calorieGoal) * 100, 100);

    return (
      <View style={styles.dashboardContainer}>
        <View style={styles.dashboardHeader}>
          <TouchableOpacity onPress={() => changeDate(-1)}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <Text style={styles.dateText}>{getDisplayDate(selectedDate)}</Text>
          
          <TouchableOpacity 
            onPress={() => changeDate(1)}
            disabled={selectedDate === formatDateKey(new Date())}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={selectedDate === formatDateKey(new Date()) ? '#ccc' : '#007AFF'} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.calorieCard}>
          <Text style={styles.calorieTitle}>Daily Summary</Text>
          
          <View style={styles.calorieCircle}>
            <View style={styles.calorieCircleInner}>
              <Text style={styles.calorieNumber}>{todaysCalories}</Text>
              <Text style={styles.calorieLabel}>calories</Text>
            </View>
            <View style={[styles.progressRing, { 
              transform: [{ rotate: '-90deg' }]
            }]}>
              <View style={[styles.progressFill, {
                transform: [{ rotate: `${(progressPercentage * 3.6)}deg` }]
              }]} />
            </View>
          </View>

          <View style={styles.calorieStats}>
            <View style={styles.calorieStat}>
              <Text style={styles.statLabel}>Goal</Text>
              <Text style={styles.statValue}>{calorieGoal}</Text>
            </View>
            <View style={styles.calorieStat}>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={[styles.statValue, caloriesRemaining < 0 && styles.overCalories]}>
                {Math.abs(caloriesRemaining)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.foodListContainer}>
          <Text style={styles.foodListTitle}>Today's Foods</Text>
          {todaysFoods.length === 0 ? (
            <View style={styles.emptyFoodList}>
              <Ionicons name="restaurant-outline" size={40} color="#ccc" />
              <Text style={styles.emptyFoodText}>No foods logged yet</Text>
            </View>
          ) : (
            <FlatList
              data={todaysFoods}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.foodItem}>
                  <View style={styles.foodItemInfo}>
                    <Text style={styles.foodItemName}>{item.foodName}</Text>
                    <Text style={styles.foodItemCalories}>{item.calories} cal</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeFoodFromDaily(item.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.addFoodButton}
          onPress={() => setCurrentView('camera')}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addFoodButtonText}>Add Food</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render Camera View
  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <View style={styles.cameraHeader}>
        <TouchableOpacity onPress={() => {
          setCurrentView('dashboard');
          clearImage();
        }}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.cameraTitle}>Add Food</Text>
        <View style={{ width: 24 }} />
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
            
            {nutritionData && (
              <View style={styles.nutritionCard}>
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
                </View>

                <TouchableOpacity
                  style={styles.logCaloriesButton}
                  onPress={logFoodToDaily}
                >
                  <Ionicons name="add-circle-outline" size={24} color="white" />
                  <Text style={styles.logCaloriesText}>Log to Daily Calories</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {analyzing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>{analysisProgress}</Text>
          </View>
        </View>
      )}
    </View>
  );

  // Main render
  if (!hasCompletedOnboarding) {
    return (
      <>
        {renderWelcomeScreen()}
        {renderProfileSetup()}
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Snackulator</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            setShowProfileSetup(true);
          }}
        >
          <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {currentView === 'dashboard' ? renderDashboard() : renderCameraView()}
      
      {renderProfileSetup()}
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
  profileButton: {
    padding: 4,
  },
  
  // Welcome styles
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
  getStartedButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    gap: 8,
    marginBottom: 40,
  },
  getStartedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Profile setup styles
  profileContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContent: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 0,
    zIndex: 1,
    padding: 10,
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  genderButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  heightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heightInput: {
    flex: 1,
    marginRight: 0,
  },
  heightSeparator: {
    fontSize: 16,
    color: '#666',
    marginLeft: -5,
  },
  genderButtonText: {
    fontSize: 16,
    color: '#333',
  },
  genderButtonTextActive: {
    color: 'white',
  },
  activityButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  activityButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  activityButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activityButtonTextActive: {
    color: 'white',
  },
  goalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  goalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  goalButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  goalButtonText: {
    fontSize: 14,
    color: '#333',
  },
  goalButtonTextActive: {
    color: 'white',
  },
  completeProfileButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  completeProfileText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Dashboard styles
  dashboardContainer: {
    flex: 1,
    padding: 20,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  calorieCard: {
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
  calorieTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  calorieCircle: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  calorieCircleInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#666',
  },
  progressRing: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
    borderWidth: 15,
    borderColor: '#f0f0f0',
  },
  progressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 90,
    borderWidth: 15,
    borderColor: '#007AFF',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  calorieStat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  overCalories: {
    color: '#FF3B30',
  },
  foodListContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  foodListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  emptyFoodList: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyFoodText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodItemInfo: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  foodItemCalories: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  addFoodButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    gap: 8,
  },
  addFoodButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Camera view styles
  cameraContainer: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cameraTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
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
    marginBottom: 20,
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
  logCaloriesButton: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  logCaloriesText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
});