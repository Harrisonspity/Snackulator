// Calorie Calculator using Harris-Benedict Formula
// Created by Harrison Spitnale for Snackulator

/**
 * Calculate daily calorie needs using Harris-Benedict Formula
 * @param {string} gender - 'male' or 'female'
 * @param {number} age - Age in years
 * @param {number} weight - Weight in pounds
 * @param {number} height - Height in inches
 * @param {string} activityLevel - 'sedentary', 'light', 'moderate', 'active', 'veryActive'
 * @returns {number} Daily calorie needs
 */
export const calculateDailyCalories = (gender, age, weight, height, activityLevel = 'light') => {
  // Convert pounds to kg and inches to cm
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;
  
  // Calculate BMR (Basal Metabolic Rate)
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
  }
  
  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Hard exercise 6-7 days/week
    veryActive: 1.9      // Very hard exercise & physical job
  };
  
  // Calculate total daily calories
  const dailyCalories = bmr * (activityMultipliers[activityLevel] || 1.375);
  
  return Math.round(dailyCalories);
};

/**
 * Get a healthy calorie range (for maintaining weight)
 * @param {number} dailyCalories - Base daily calories
 * @returns {object} Object with min and max calories
 */
export const getCalorieRange = (dailyCalories) => {
  return {
    min: Math.round(dailyCalories - 200),
    target: dailyCalories,
    max: Math.round(dailyCalories + 200)
  };
};

/**
 * Get calorie goal based on weight goal
 * @param {number} dailyCalories - Base daily calories
 * @param {string} goal - 'maintain', 'lose', 'gain'
 * @returns {number} Adjusted daily calorie goal
 */
export const getCalorieGoal = (dailyCalories, goal = 'maintain') => {
  switch (goal) {
    case 'lose':
      // 500 calorie deficit for 1 lb/week loss
      return Math.max(1200, dailyCalories - 500);
    case 'gain':
      // 500 calorie surplus for 1 lb/week gain
      return dailyCalories + 500;
    default:
      return dailyCalories;
  }
};

/**
 * Format date as YYYY-MM-DD for consistent storage
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get display date string
 * @param {string} dateKey - Date in YYYY-MM-DD format
 * @returns {string} Display date (e.g., "Today", "Yesterday", "Dec 25")
 */
export const getDisplayDate = (dateKey) => {
  const today = formatDateKey(new Date());
  const yesterday = formatDateKey(new Date(Date.now() - 86400000));
  
  if (dateKey === today) return 'Today';
  if (dateKey === yesterday) return 'Yesterday';
  
  const date = new Date(dateKey);
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};