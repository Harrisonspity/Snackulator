import React, { useContext, useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { NutritionContext } from '../context/NutritionContext';
import GradientBackground from '../components/common/GradientBackground';

const DashboardScreen = ({ navigation }) => {
  const { userProfile } = useContext(UserContext);
  const { dailyCalories, dailyFoods } = useContext(NutritionContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    const percentage = (dailyCalories / (userProfile?.targetCalories || 2000)) * 100;
    if (percentage === 0) return "Let's fuel your day! 🚀";
    if (percentage < 30) return "Great start! Keep going 💪";
    if (percentage < 60) return "You're doing amazing! 🌟";
    if (percentage < 90) return "Almost at your goal! 🎯";
    if (percentage < 100) return "So close to perfect! 🔥";
    if (percentage === 100) return "Perfect balance today! ✨";
    return "Watch your intake 🌱";
  };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Animate header on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAddFood = () => {
    navigation.navigate('Camera');
  };

  const handleProfile = () => {
    navigation.navigate('ProfileSetup');
  };

  const caloriesRemaining = (userProfile?.targetCalories || 2000) - dailyCalories;
  const percentageUsed = (dailyCalories / (userProfile?.targetCalories || 2000)) * 100;

  return (
    <GradientBackground variant="premium">
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
        {/* Enhanced Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Animated.View 
              style={[
                styles.headerLeft,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{userProfile?.name || 'Foodie'}</Text>
              <Text style={styles.motivationalText}>{getMotivationalMessage()}</Text>
            </Animated.View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={handleProfile} style={styles.profileButton}>
                <View style={styles.profileIconContainer}>
                  <Ionicons name="person" size={32} color="#5B63F5" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Quick Stats Bar */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
              <Text style={styles.statText}>{dailyCalories} cal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="restaurant" size={24} color="#4ECDC4" />
              <Text style={styles.statText}>{dailyFoods?.length || 0} meals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={24} color="#95E1D3" />
              <Text style={styles.statText}>{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
            </View>
          </View>
        </View>

        {/* Calorie Summary Card */}
        <View style={styles.calorieCard}>
          <Text style={styles.calorieTitle}>Today's Progress</Text>
          
          <View style={styles.calorieCircle}>
            <Text style={styles.calorieNumber}>{dailyCalories}</Text>
            <Text style={styles.calorieLabel}>calories</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(percentageUsed, 100)}%` }]} />
          </View>

          <View style={styles.calorieStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Goal</Text>
              <Text style={styles.statValue}>{userProfile?.targetCalories || 2000}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={[styles.statValue, { color: caloriesRemaining < 0 ? '#ff4444' : '#4CAF50' }]}>
                {Math.abs(caloriesRemaining)}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Foods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Foods</Text>
          {dailyFoods && dailyFoods.length > 0 ? (
            dailyFoods.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.foodName || food.name}</Text>
                  <Text style={styles.foodTime}>
                    {new Date(food.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <Text style={styles.foodCalories}>{food.calories} cal</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No foods logged yet today</Text>
          )}
        </View>

        {/* Add Food Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
          <Ionicons name="camera" size={32} color="white" />
          <Text style={styles.addButtonText}>Add Food</Text>
        </TouchableOpacity>
        </ScrollView>
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
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  userName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 18,
    color: '#64B5F6',
    fontWeight: '600',
  },
  profileButton: {
    padding: 4,
  },
  profileIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(30, 136, 229, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(30, 136, 229, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    fontSize: 16,
    color: '#B8BCC8',
    marginLeft: 8,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  calorieCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 32,
    margin: 20,
    marginTop: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  calorieTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  calorieCircle: {
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#5B63F5',
  },
  calorieLabel: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 4,
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 18,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  foodTime: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  foodCalories: {
    fontSize: 22,
    fontWeight: '700',
    color: '#5B63F5',
  },
  emptyText: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B63F5',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 12,
  },
});

export default DashboardScreen;