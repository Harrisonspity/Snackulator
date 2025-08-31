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
