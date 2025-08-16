import axios from 'axios';
import { AI_SERVICES, NUTRITION_PROMPT, getRandomMockData } from '../config/ai-service';

// Convert image URI to base64 for API calls
const imageToBase64 = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

// Analyze image using OpenAI GPT-4 Vision
const analyzeWithOpenAI = async (imageUri) => {
  try {
    const base64Image = await imageToBase64(imageUri);
    const config = AI_SERVICES.OPENAI;
    
    // Check if API key is configured
    if (!config.apiKey || config.apiKey === 'your-openai-api-key-here') {
      throw new Error('OpenAI API key not configured. Please add EXPO_PUBLIC_OPENAI_API_KEY to your .env file');
    }
    
    const response = await axios.post(
      config.baseUrl,
      {
        model: config.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: NUTRITION_PROMPT,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'high'
                },
              },
            ],
          },
        ],
        max_tokens: config.maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    // Clean the response in case there's any markdown formatting
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error('OpenAI analysis error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key in the .env file');
    } else if (error.response?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later');
    } else if (error.message.includes('API key not configured')) {
      throw error;
    } else {
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
  }
};

// Analyze image using Google Cloud Vision
const analyzeWithGoogleVision = async (imageUri) => {
  try {
    const base64Image = await imageToBase64(imageUri);
    const config = AI_SERVICES.GOOGLE_VISION;
    
    const response = await axios.post(
      `${config.baseUrl}?key=${config.apiKey}`,
      {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10,
              },
              {
                type: 'WEB_DETECTION',
                maxResults: 5,
              },
            ],
          },
        ],
      }
    );

    // Process Google Vision results and map to nutrition data
    const labels = response.data.responses[0].labelAnnotations || [];
    const webEntities = response.data.responses[0].webDetection?.webEntities || [];
    
    // This is a simplified mapping - in a real app, you'd use a nutrition database
    const foodName = labels[0]?.description || webEntities[0]?.description || 'Unknown Food';
    
    return {
      foodName,
      calories: Math.floor(Math.random() * 300) + 50, // Mock calories
      protein: `${(Math.random() * 20).toFixed(1)}g`,
      carbs: `${(Math.random() * 50).toFixed(1)}g`,
      fat: `${(Math.random() * 15).toFixed(1)}g`,
      fiber: `${(Math.random() * 10).toFixed(1)}g`,
      sugar: `${(Math.random() * 25).toFixed(1)}g`,
      confidence: labels[0]?.score || 0.7,
    };
  } catch (error) {
    console.error('Google Vision analysis error:', error);
    throw new Error('Failed to analyze image with Google Vision');
  }
};

// Analyze image using Calorie Mama API
const analyzeWithCalorieMama = async (imageUri) => {
  try {
    const base64Image = await imageToBase64(imageUri);
    const config = AI_SERVICES.CALORIE_MAMA;
    
    const response = await axios.post(
      config.baseUrl,
      {
        image: base64Image,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Process Calorie Mama results
    const result = response.data;
    return {
      foodName: result.food_name || 'Unknown Food',
      calories: result.calories || 0,
      protein: `${result.protein || 0}g`,
      carbs: `${result.carbs || 0}g`,
      fat: `${result.fat || 0}g`,
      fiber: `${result.fiber || 0}g`,
      sugar: `${result.sugar || 0}g`,
      confidence: result.confidence || 0.8,
    };
  } catch (error) {
    console.error('Calorie Mama analysis error:', error);
    throw new Error('Failed to analyze image with Calorie Mama');
  }
};

// Main analysis function
export const analyzeFoodImage = async (imageUri, service = 'MOCK') => {
  try {
    let result;
    
    switch (service.toUpperCase()) {
      case 'OPENAI':
        result = await analyzeWithOpenAI(imageUri);
        break;
      case 'GOOGLE_VISION':
        result = await analyzeWithGoogleVision(imageUri);
        break;
      case 'CALORIE_MAMA':
        result = await analyzeWithCalorieMama(imageUri);
        break;
      case 'MOCK':
      default:
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = getRandomMockData();
        break;
    }

    // Add timestamp and image URI
    return {
      ...result,
      timestamp: new Date().toISOString(),
      imageUri,
    };
  } catch (error) {
    console.error('Food analysis error:', error);
    throw error;
  }
};

// Get available AI services
export const getAvailableServices = () => {
  return Object.keys(AI_SERVICES).map(key => ({
    key,
    name: AI_SERVICES[key].name,
  }));
};

// Validate API keys
export const validateApiKeys = () => {
  const validation = {};
  
  Object.keys(AI_SERVICES).forEach(service => {
    const config = AI_SERVICES[service];
    validation[service] = {
      hasApiKey: !!(config.apiKey && config.apiKey !== `your-${service.toLowerCase()}-api-key-here`),
      hasAppId: !!(config.appId && config.appId !== `your-${service.toLowerCase()}-app-id`),
      hasAppKey: !!(config.appKey && config.appKey !== `your-${service.toLowerCase()}-app-key`),
    };
  });
  
  return validation;
};
