// AI Service Configuration for Snackulator
// Created by Harrison Spitnale for Congressional App Challenge

import { ENV } from './env';

export const AI_SERVICES = {
  // OpenAI GPT-4 Vision API - Main service for food recognition
  OPENAI: {
    name: 'OpenAI GPT-4 Vision',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: ENV.openaiApiKey || 'your-openai-api-key-here',
    model: 'gpt-4-turbo',
    maxTokens: 1000,
  },
};

// Default service to use
export const DEFAULT_SERVICE = 'OPENAI';

// Nutrition analysis prompt for OpenAI
export const NUTRITION_PROMPT = `
You are an expert nutritionist AI. Analyze this food image carefully:

1. IDENTIFY the food item(s) in the image
2. ESTIMATE the portion size based on visual cues
3. PROVIDE accurate nutritional information

Return ONLY a JSON object in this exact format:
{
  "foodName": "name of the food",
  "calories": number of calories,
  "protein": "Xg",
  "carbs": "Xg",
  "fat": "Xg",
  "fiber": "Xg",
  "sugar": "Xg",
  "confidence": 0.0 to 1.0
}
`;

// Mock data for testing when API is not available
export const getRandomMockData = (imageUri) => {
  const mockFoods = [
    {
      foodName: "Grilled Chicken Salad",
      calories: 320,
      protein: "35g",
      carbs: "12g",
      fat: "18g",
      fiber: "6g",
      sugar: "4g",
      confidence: 0.92,
    },
    {
      foodName: "Cheeseburger",
      calories: 550,
      protein: "28g",
      carbs: "42g",
      fat: "32g",
      fiber: "2g",
      sugar: "8g",
      confidence: 0.88,
    },
    {
      foodName: "Apple",
      calories: 95,
      protein: "0.5g",
      carbs: "25g",
      fat: "0.3g",
      fiber: "4g",
      sugar: "19g",
      confidence: 0.95,
    },
    {
      foodName: "Banana",
      calories: 105,
      protein: "1.3g",
      carbs: "27g",
      fat: "0.4g",
      fiber: "3g",
      sugar: "14g",
      confidence: 0.94,
    },
    {
      foodName: "Pasta with Marinara",
      calories: 380,
      protein: "14g",
      carbs: "65g",
      fat: "8g",
      fiber: "4g",
      sugar: "10g",
      confidence: 0.87,
    },
  ];

  const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
  return {
    ...randomFood,
    timestamp: new Date().toISOString(),
    imageUri,
  };
};

// Check if API key is configured
export const validateApiKeys = () => {
  const config = AI_SERVICES.OPENAI;
  
  if (!config.apiKey || config.apiKey === 'your-openai-api-key-here' || ENV.useMockData) {
    return {
      isValid: false,
      message: `OpenAI API key not configured. Using demo mode. (Environment: ${ENV.environment})`,
    };
  }
  
  return {
    isValid: true,
    message: `API configured successfully (Environment: ${ENV.environment})`,
  };
};

// Get available services
export const getAvailableServices = () => {
  const services = [];
  const validation = validateApiKeys();
  
  if (validation.isValid) {
    services.push('OPENAI');
  }
  
  services.push('MOCK'); // Always available for demo
  
  return services;
};