// Environment configuration handler for Snackulator
// Handles both development and production environments

import Constants from 'expo-constants';

// Get environment type
const getEnvironment = () => {
  // Check if we're in production/preview build
  if (Constants.expoConfig?.extra?.eas) {
    return process.env.EXPO_PUBLIC_ENV || 'production';
  }
  
  // Default to development for local testing
  return process.env.EXPO_PUBLIC_ENV || 'development';
};

// Configuration object that handles all environments
export const ENV = {
  // Current environment
  environment: getEnvironment(),
  
  // API Keys - these use EXPO_PUBLIC_ prefix for client-side access
  openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || null,
  
  // Feature flags
  isDevelopment: getEnvironment() === 'development',
  isProduction: getEnvironment() === 'production',
  isPreview: getEnvironment() === 'preview',
  
  // Mock mode fallback when no API key is available
  useMockData: !process.env.EXPO_PUBLIC_OPENAI_API_KEY || 
               process.env.EXPO_PUBLIC_OPENAI_API_KEY === 'your-openai-api-key-here',
};

// Validate configuration
export const validateConfig = () => {
  const errors = [];
  const warnings = [];
  
  if (!ENV.openaiApiKey) {
    warnings.push('OpenAI API key not configured - using mock data mode');
  }
  
  if (ENV.isProduction && ENV.useMockData) {
    warnings.push('Production build is using mock data - configure API key in EAS secrets');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Log configuration (only in development)
if (__DEV__) {
  console.log('Environment Configuration:', {
    environment: ENV.environment,
    hasOpenAIKey: !!ENV.openaiApiKey,
    useMockData: ENV.useMockData,
  });
}