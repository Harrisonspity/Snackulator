import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadDailyData = async () => {
  const calories = await AsyncStorage.getItem('dailyCalories');
  const foods = await AsyncStorage.getItem('dailyFoods');
  return {
    calories: calories ? JSON.parse(calories) : {},
    foods: foods ? JSON.parse(foods) : {},
  };
};

export const saveDailyData = async (calories, foods) => {
  await AsyncStorage.setItem('dailyCalories', JSON.stringify(calories));
  await AsyncStorage.setItem('dailyFoods', JSON.stringify(foods));
};
