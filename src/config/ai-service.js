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
