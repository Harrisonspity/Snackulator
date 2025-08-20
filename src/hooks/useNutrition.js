import { useState } from 'react';

// Manages nutrition data and analysis
export const useNutrition = () => {
  const [nutritionData, setNutritionData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');

  // TODO: Implement analyze image, save to daily log, calculate totals

  const analyzeImage = async (image) => {};
  const logFood = (food) => {};

  return {
    nutritionData,
    analyzing,
    analysisProgress,
    analyzeImage,
    logFood,
  };
};
