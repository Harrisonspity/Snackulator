# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run on web browser

### Installation
- `npm install` - Install all dependencies

Note: This project uses Expo SDK 53 with React Native 0.79.5. No test commands, lint commands, or build commands are configured.

## High-Level Architecture

### Project Structure
The app follows a simple single-screen architecture with service layer separation:

1. **App.js** (439 lines) - Main component containing all UI logic and state management
   - Handles camera/gallery image capture
   - Manages nutrition analysis display
   - Stores history in AsyncStorage
   - Uses React hooks for state management

2. **services/ai-analysis.js** - Pluggable AI service layer
   - Supports multiple AI providers (OpenAI GPT-4 Vision, Google Cloud Vision, Calorie Mama)
   - Includes mock data mode (default) for development without API keys
   - Handles base64 image conversion
   - Returns standardized nutrition data format

3. **config/ai-service.js** - Centralized configuration
   - API endpoints and configuration
   - Mock data definitions
   - Service validation utilities

### Key Patterns

**AI Service Integration**: The app uses a pluggable architecture for AI services. To switch providers, modify the service parameter in App.js:100:
```javascript
const nutritionData = await analyzeFoodImage(image, 'MOCK'); // Change to 'OPENAI', 'GOOGLE', or 'CALORIE_MAMA'
```

**Data Flow**:
1. User captures/selects image → 
2. Image converted to base64 → 
3. AI service analyzes image → 
4. Standardized nutrition data returned → 
5. UI displays results → 
6. Data saved to AsyncStorage history

**State Management**: Uses React useState hooks in App.js for:
- `image` - Current selected image
- `nutritionData` - Current analysis results
- `isLoading` - Loading state
- `history` - Previous analyses (max 10)
- `error` - Error messages
- Camera permission states

### Important Implementation Details

**Nutrition Data Structure** (used throughout the app):
```javascript
{
  foodName: string,
  calories: number,
  protein: string (e.g., "25g"),
  carbs: string (e.g., "30g"),
  fat: string (e.g., "10g"),
  fiber: string (e.g., "5g"),
  sugar: string (e.g., "8g"),
  confidence: number (0.0 to 1.0),
  timestamp: ISO string,
  imageUri: string
}
```

**AsyncStorage Keys**:
- `nutritionHistory` - Stores array of last 10 analyses

**Environment Variables** (optional, for real AI services):
- `OPENAI_API_KEY`
- `GOOGLE_CLOUD_API_KEY`
- `CALORIE_MAMA_API_KEY`
- `NUTRITIONIX_APP_ID`
- `NUTRITIONIX_APP_KEY`

### Development Notes

1. **Camera Testing**: Physical device recommended for camera functionality. Expo Go app required for device testing.

2. **Mock Mode**: Default configuration uses mock data. No API keys needed for initial development.

3. **No TypeScript**: Pure JavaScript project. No TypeScript configuration.

4. **Styling**: All styles defined inline in App.js using StyleSheet.create(). Primary color: #007AFF.

5. **Permissions**: Camera and media library permissions handled automatically in App.js.

6. **Error Handling**: Comprehensive try-catch blocks in image processing and AI analysis functions.