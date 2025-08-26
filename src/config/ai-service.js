// AI Service Configuration
export const AI_SERVICES = {
  OPENAI: {
    name: 'OpenAI GPT-4 Vision',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'your-openai-api-key-here',
    model: 'gpt-4o-mini',  // Using GPT-4o mini which supports vision and is more cost-effective
    maxTokens: 500,
  },
  GOOGLE_VISION: {
    name: 'Google Cloud Vision',
    baseUrl: 'https://vision.googleapis.com/v1/images:annotate',
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY || 'your-google-api-key-here',
  },
  CALORIE_MAMA: {
    name: 'Calorie Mama',
    baseUrl: 'https://api.caloriemama.ai/v1/analyze',
    apiKey: process.env.EXPO_PUBLIC_CALORIE_MAMA_API_KEY || 'your-calorie-mama-api-key-here',
  },
  NUTRITIONIX: {
    name: 'Nutritionix',
    baseUrl: 'https://trackapi.nutritionix.com/v2',
    appId: process.env.EXPO_PUBLIC_NUTRITIONIX_APP_ID || 'your-nutritionix-app-id',
    appKey: process.env.EXPO_PUBLIC_NUTRITIONIX_APP_KEY || 'your-nutritionix-app-key',
  },
};

// Prompt for AI services to analyze food images
export const NUTRITION_PROMPT = `
Analyze this food image and provide nutritional information in JSON format with the following structure:
{
  "foodName": "name of the food item",
  "calories": number (estimated calories),
  "protein": "Xg" (grams of protein),
  "carbs": "Xg" (grams of carbohydrates),
  "fat": "Xg" (grams of fat),
  "fiber": "Xg" (grams of fiber),
  "sugar": "Xg" (grams of sugar),
  "confidence": number between 0 and 1 (confidence in the analysis)
}

Be as accurate as possible based on the visual appearance of the food. If there are multiple items, combine their nutritional values.
`;

// Mock data for development/testing
const MOCK_FOODS = [
  {
    foodName: 'Grilled Chicken Salad',
    calories: 320,
    protein: '35g',
    carbs: '12g',
    fat: '14g',
    fiber: '4g',
    sugar: '6g',
    confidence: 0.95,
  },
  {
    foodName: 'Spaghetti Bolognese',
    calories: 580,
    protein: '28g',
    carbs: '65g',
    fat: '22g',
    fiber: '5g',
    sugar: '8g',
    confidence: 0.92,
  },
  {
    foodName: 'Avocado Toast',
    calories: 380,
    protein: '12g',
    carbs: '42g',
    fat: '20g',
    fiber: '8g',
    sugar: '4g',
    confidence: 0.88,
  },
  {
    foodName: 'Protein Smoothie Bowl',
    calories: 420,
    protein: '25g',
    carbs: '55g',
    fat: '12g',
    fiber: '10g',
    sugar: '28g',
    confidence: 0.90,
  },
  {
    foodName: 'Grilled Salmon with Vegetables',
    calories: 450,
    protein: '42g',
    carbs: '18g',
    fat: '24g',
    fiber: '6g',
    sugar: '8g',
    confidence: 0.93,
  },
  {
    foodName: 'Chicken Burrito Bowl',
    calories: 680,
    protein: '38g',
    carbs: '72g',
    fat: '26g',
    fiber: '12g',
    sugar: '6g',
    confidence: 0.91,
  },
  {
    foodName: 'Greek Yogurt Parfait',
    calories: 340,
    protein: '18g',
    carbs: '48g',
    fat: '10g',
    fiber: '4g',
    sugar: '32g',
    confidence: 0.89,
  },
  {
    foodName: 'Turkey Sandwich',
    calories: 420,
    protein: '28g',
    carbs: '45g',
    fat: '15g',
    fiber: '5g',
    sugar: '8g',
    confidence: 0.87,
  },
  {
    foodName: 'Veggie Stir Fry',
    calories: 280,
    protein: '12g',
    carbs: '38g',
    fat: '11g',
    fiber: '8g',
    sugar: '12g',
    confidence: 0.85,
  },
  {
    foodName: 'Protein Bar',
    calories: 250,
    protein: '20g',
    carbs: '28g',
    fat: '9g',
    fiber: '3g',
    sugar: '15g',
    confidence: 0.94,
  },
];

// Get random mock data for testing
export const getRandomMockData = () => {
  const randomIndex = Math.floor(Math.random() * MOCK_FOODS.length);
  return {
    ...MOCK_FOODS[randomIndex],
    // Add some variation to the values
    calories: MOCK_FOODS[randomIndex].calories + Math.floor(Math.random() * 40 - 20),
  };
};

// Validate service configuration
export const validateServiceConfig = (service) => {
  const config = AI_SERVICES[service];
  if (!config) {
    throw new Error(`Unknown service: ${service}`);
  }
  
  // Check for required API keys
  if (service === 'OPENAI' && (!config.apiKey || config.apiKey.includes('your-'))) {
    throw new Error('OpenAI API key not configured');
  }
  
  if (service === 'GOOGLE_VISION' && (!config.apiKey || config.apiKey.includes('your-'))) {
    throw new Error('Google Vision API key not configured');
  }
  
  if (service === 'CALORIE_MAMA' && (!config.apiKey || config.apiKey.includes('your-'))) {
    throw new Error('Calorie Mama API key not configured');
  }
  
  if (service === 'NUTRITIONIX' && (!config.appId || config.appId.includes('your-') || !config.appKey || config.appKey.includes('your-'))) {
    throw new Error('Nutritionix app ID and key not configured');
  }
  
  return true;
};