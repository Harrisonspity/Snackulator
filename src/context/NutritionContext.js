import React, { createContext, useState, useEffect } from 'react';
import { loadDailyData, saveDailyData } from '../services/nutritionService';

export const NutritionContext = createContext();

export const NutritionProvider = ({ children }) => {
  const [dailyCalories, setDailyCalories] = useState(0);
  const [dailyFoods, setDailyFoods] = useState([]);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  
  const resetNutritionData = () => {
    setDailyCalories(0);
    setDailyFoods([]);
    setCalorieGoal(2000);
  };

  useEffect(() => {
    loadDailyData().then(({ calories, foods }) => {
      setDailyCalories(calories);
      setDailyFoods(foods);
    });
  }, []);

  useEffect(() => {
    saveDailyData(dailyCalories, dailyFoods);
  }, [dailyCalories, dailyFoods]);

  return (
    <NutritionContext.Provider value={{
      dailyCalories,
      setDailyCalories,
      dailyFoods,
      setDailyFoods,
      calorieGoal,
      setCalorieGoal,
      resetNutritionData,
    }}>
      {children}
    </NutritionContext.Provider>
  );
};
