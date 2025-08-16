// AI Service Configuration
// This file contains configuration for different AI services that can analyze food images

export const AI_SERVICES = {
  // OpenAI GPT-4 Vision API
  OPENAI: {
    name: 'OpenAI GPT-4 Vision',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'your-openai-api-key-here',
    model: 'gpt-4-turbo', // Using gpt-4-turbo for better image recognition
    maxTokens: 1000,
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
You are an expert nutritionist AI with advanced food recognition capabilities. Carefully analyze this food image step by step:

1. IDENTIFY: Look closely at the image to identify the specific food item(s). Consider:
   - Color, shape, and texture
   - Cooking method (raw, cooked, fried, baked, etc.)
   - Any visible ingredients or toppings
   - Context clues (plate, packaging, utensils)

2. ESTIMATE PORTION: Estimate the portion size based on:
   - Visual cues in the image (plate size, hand/utensil for scale)
   - Standard serving sizes for this type of food
   - If uncertain, use typical restaurant or home serving sizes

3. ANALYZE NUTRITION: Based on your identification and portion estimate, provide accurate nutritional data.

IMPORTANT: Be very precise in food identification. For example:
- A banana should be identified as "Banana", not "Apple" or "Pizza"
- An apple should be identified as "Apple", not "Pizza"
- A hot dog should be identified as "Hot Dog", not "Salad"

Provide the nutritional information in this exact JSON format:
{
  "foodName": "specific name of the food item(s)",
  "calories": estimated calories as integer,
  "protein": "Xg" where X is grams of protein,
  "carbs": "Xg" where X is grams of carbohydrates,
  "fat": "Xg" where X is grams of fat,
  "fiber": "Xg" where X is grams of fiber,
  "sugar": "Xg" where X is grams of sugar,
  "confidence": 0.0 to 1.0 based on image clarity
}

Guidelines:
- Estimate based on typical restaurant/home serving sizes
- If multiple foods are visible, provide combined totals
- Use standard nutritional databases as reference
- Be conservative in estimates rather than overestimating
- Return ONLY the JSON object, no other text

Example response for a medium apple:
{"foodName":"Medium Apple","calories":95,"protein":"0.5g","carbs":"25g","fat":"0.3g","fiber":"4g","sugar":"19g","confidence":0.9}
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
