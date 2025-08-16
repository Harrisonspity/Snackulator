// AI Service Configuration
// This file contains configuration for different AI services that can analyze food images

export const AI_SERVICES = {
  // OpenAI GPT-4 Vision API
  OPENAI: {
    name: 'OpenAI GPT-4 Vision',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
    model: 'gpt-4-vision-preview',
    maxTokens: 500,
  },
  
  // Google Cloud Vision API
  GOOGLE_VISION: {
    name: 'Google Cloud Vision',
    baseUrl: 'https://vision.googleapis.com/v1/images:annotate',
    apiKey: process.env.GOOGLE_VISION_API_KEY || 'your-google-vision-api-key-here',
  },
  
  // Nutritionix API (for nutrition database)
  NUTRITIONIX: {
    name: 'Nutritionix',
    baseUrl: 'https://trackapi.nutritionix.com/v2',
    appId: process.env.NUTRITIONIX_APP_ID || 'your-nutritionix-app-id',
    appKey: process.env.NUTRITIONIX_APP_KEY || 'your-nutritionix-app-key',
  },
  
  // Calorie Mama API
  CALORIE_MAMA: {
    name: 'Calorie Mama',
    baseUrl: 'https://api.caloriemama.ai/food_recognition',
    apiKey: process.env.CALORIE_MAMA_API_KEY || 'your-calorie-mama-api-key',
  },
};

// Default service to use
export const DEFAULT_SERVICE = 'OPENAI';

// Nutrition analysis prompt for OpenAI
export const NUTRITION_PROMPT = `
Analyze this food image and provide detailed nutritional information in JSON format.
Include the following fields:
- foodName: The name of the food item
- calories: Number of calories (integer)
- protein: Protein content in grams with "g" suffix
- carbs: Carbohydrate content in grams with "g" suffix
- fat: Fat content in grams with "g" suffix
- fiber: Fiber content in grams with "g" suffix
- sugar: Sugar content in grams with "g" suffix
- confidence: Confidence level (0.0 to 1.0)

Return only valid JSON without any additional text or formatting.
`;

// Mock data for demonstration purposes
export const MOCK_NUTRITION_DATA = {
  apple: {
    foodName: 'Apple',
    calories: 95,
    protein: '0.5g',
    carbs: '25g',
    fat: '0.3g',
    fiber: '4g',
    sugar: '19g',
    confidence: 0.89,
  },
  banana: {
    foodName: 'Banana',
    calories: 105,
    protein: '1.3g',
    carbs: '27g',
    fat: '0.4g',
    fiber: '3g',
    sugar: '14g',
    confidence: 0.92,
  },
  pizza: {
    foodName: 'Pizza Slice',
    calories: 285,
    protein: '12g',
    carbs: '36g',
    fat: '10g',
    fiber: '2g',
    sugar: '3g',
    confidence: 0.85,
  },
  salad: {
    foodName: 'Mixed Salad',
    calories: 45,
    protein: '3g',
    carbs: '8g',
    fat: '0.5g',
    fiber: '3g',
    sugar: '4g',
    confidence: 0.78,
  },
};

// Function to get random mock data
export const getRandomMockData = () => {
  const foods = Object.keys(MOCK_NUTRITION_DATA);
  const randomFood = foods[Math.floor(Math.random() * foods.length)];
  return {
    ...MOCK_NUTRITION_DATA[randomFood],
    timestamp: new Date().toISOString(),
  };
};
