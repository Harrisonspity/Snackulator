// AI Service Configuration
export const AI_SERVICES = {
  OPENAI: {
    name: 'OpenAI GPT-4 Vision',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'your-openai-api-key-here',
    model: 'gpt-4o-mini',  // Using GPT-4o mini which supports vision and is more cost-effective
    maxTokens: 500,
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
