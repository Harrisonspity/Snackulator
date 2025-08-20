import React, { useContext } from 'react';
import { View } from 'react-native';
import { NutritionContext } from '../context/NutritionContext';
import globalStyles from '../styles/globalStyles';

// ...import needed components...

const DashboardScreen = ({ navigation }) => {
  const { dailyCalories, dailyFoods, calorieGoal, ...rest } = useContext(NutritionContext);

  return (
    <View style={globalStyles.dashboardContainer}>
      {/* ...dashboard code from App.js... */}
    </View>
  );
};

export default DashboardScreen;
