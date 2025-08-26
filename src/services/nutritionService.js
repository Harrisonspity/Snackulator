import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadDailyData = async () => {
  try {
    const calories = await AsyncStorage.getItem('dailyCalories');
    const foods = await AsyncStorage.getItem('dailyFoods');
    return {
      calories: calories ? parseInt(calories) || 0 : 0,
      foods: foods ? JSON.parse(foods) : [],
    };
  } catch (error) {
    console.error('Error loading daily data:', error);
    return {
      calories: 0,
      foods: [],
    };
  }
};

export const saveDailyData = async (calories, foods) => {
  await AsyncStorage.setItem('dailyCalories', JSON.stringify(calories));
  await AsyncStorage.setItem('dailyFoods', JSON.stringify(foods));
};
