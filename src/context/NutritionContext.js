import React, { createContext, useState, useEffect } from 'react';
import { loadDailyData, saveDailyData } from '../services/nutritionService';

export const NutritionContext = createContext();

export const NutritionProvider = ({ children }) => {
  const [dailyCalories, setDailyCalories] = useState({});
  const [dailyFoods, setDailyFoods] = useState({});
  const [calorieGoal, setCalorieGoal] = useState(2000);
  // ...other states...

  useEffect(() => {
    loadDailyData().then(({ calories, foods }) => {
      setDailyCalories(calories);
      setDailyFoods(foods);
    });
  }, []);

  // ...handlers for logging/removing food...

  return (
    <NutritionContext.Provider value={{
      dailyCalories,
      setDailyCalories,
      dailyFoods,
      setDailyFoods,
      calorieGoal,
      setCalorieGoal,
      // ...other values/handlers...
    }}>
      {children}
    </NutritionContext.Provider>
  );
};
