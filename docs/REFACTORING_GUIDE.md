# Snackulator App Refactoring Guide

> **✅ Refactor Complete:** All steps in this guide have been implemented. The codebase now follows the recommended structure and best practices.

## Quick Start Checklist
- [x] Create the recommended folder structure under `src/`
- [x] Move existing services (e.g., `ai-analysis.js`) to `src/services`
- [x] Create constants files in `src/constants` (colors, dimensions, etc.)
- [x] Set up navigation in `src/navigation/AppNavigator.js`
- [x] Extract screens from `App.js` into `src/screens/`
- [x] Build and move reusable components to `src/components/`
- [x] Implement custom hooks in `src/hooks/`
- [x] Move utility functions to `src/utils/`
- [x] Extract shared styles to `src/styles/`
- [x] Set up context providers in `src/context/`
- [x] Test each component after extraction

## Current State
- **Refactored**: All logic, UI, and styles are modularized and organized per this guide.

## Recommended Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── LoadingSpinner.js
│   │   └── ErrorMessage.js
│   ├── nutrition/       # Nutrition-specific components
│   │   ├── NutritionCard.js
│   │   ├── NutritionDetails.js
│   │   ├── MacroDisplay.js
│   │   └── CalorieCounter.js
│   ├── camera/          # Camera-related components
│   │   ├── CameraButton.js
│   │   ├── ImagePreview.js
│   │   └── CameraPermissionPrompt.js
│   └── dashboard/       # Dashboard components
│       ├── DailyProgress.js
│       ├── FoodList.js
│       ├── FoodItem.js
│       └── DateSelector.js
├── screens/             # Screen components
│   ├── WelcomeScreen.js
│   ├── ProfileSetupScreen.js
│   ├── DashboardScreen.js
│   ├── CameraScreen.js
│   └── AnalysisScreen.js
├── navigation/          # Navigation configuration
│   └── AppNavigator.js
├── services/            # Business logic & API calls
│   ├── ai-analysis.js  # (already exists)
│   ├── storage.js      # AsyncStorage operations
│   └── permissions.js  # Camera/gallery permissions
├── hooks/              # Custom React hooks
│   ├── useCamera.js
│   ├── useNutrition.js
│   ├── useStorage.js
│   └── useProfile.js
├── utils/              # Helper functions
│   ├── dateHelpers.js
│   ├── nutritionCalculators.js
│   └── imageHelpers.js
├── constants/          # App constants
│   ├── colors.js
│   ├── dimensions.js
│   └── nutritionDefaults.js
├── styles/             # Shared styles
│   ├── globalStyles.js
│   ├── typography.js
│   └── spacing.js
└── context/            # React Context providers
    ├── UserContext.js
    └── NutritionContext.js
```

## Components to Extract

### 1. Screens (Top Priority)

#### WelcomeScreen.js
- **Current location**: Lines 345-402 (`renderWelcomeScreen`)
- **Props needed**: `onGetStarted`
- **State**: None (stateless)

#### ProfileSetupScreen.js
- **Current location**: Lines 404-567 (`renderProfileSetup`)
- **Props needed**: `userProfile`, `onProfileUpdate`, `onComplete`
- **State**: Local form state

#### DashboardScreen.js
- **Current location**: Lines 569-666 (`renderDashboard`)
- **Props needed**: `dailyCalories`, `dailyFoods`, `userProfile`, `selectedDate`, `onDateChange`, `onAddFood`, `onRemoveFood`
- **State**: Date selection

#### CameraScreen.js
- **Current location**: Lines 668-1180 (main render content)
- **Props needed**: `image`, `nutritionData`, `onImageCapture`, `onAnalyze`, `onClear`
- **State**: Camera permissions, loading states

### 2. Reusable Components

#### NutritionCard.js
- Display nutrition data in a card format
- Props: `nutritionData`, `onLogFood`

#### DailyProgress.js
- Circular progress indicator for daily calories
- Props: `current`, `goal`, `percentage`

#### FoodItem.js
- Individual food entry in the list
- Props: `food`, `onRemove`

#### DateSelector.js
- Date navigation component
- Props: `selectedDate`, `onDateChange`

#### CameraButton.js
- Styled camera/gallery button
- Props: `onPress`, `icon`, `title`, `disabled`

#### MacroDisplay.js
- Display macronutrient information
- Props: `protein`, `carbs`, `fat`, `fiber`, `sugar`

### 3. Custom Hooks

#### useCamera.js
```javascript
// Handles camera permissions and image capture
export const useCamera = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  
  // Check permissions
  // Take photo
  // Pick image from gallery
  
  return {
    cameraPermission,
    galleryPermission,
    image,
    takePhoto,
    pickImage,
    clearImage
  };
};
```

#### useNutrition.js
```javascript
// Manages nutrition data and analysis
export const useNutrition = () => {
  const [nutritionData, setNutritionData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  
  // Analyze image
  // Save to daily log
  // Calculate totals
  
  return {
    nutritionData,
    analyzing,
    analysisProgress,
    analyzeImage,
    logFood
  };
};
```

#### useProfile.js
```javascript
// Manages user profile data
export const useProfile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  // Load profile
  // Save profile
  // Calculate daily goals
  
  return {
    userProfile,
    hasCompletedOnboarding,
    updateProfile,
    saveProfile,
    getDailyGoals
  };
};
```

### 4. Services

#### storage.js
```javascript
// AsyncStorage operations
export const StorageService = {
  // User profile
  saveUserProfile: async (profile) => {},
  loadUserProfile: async () => {},
  
  // Daily data
  saveDailyData: async (calories, foods) => {},
  loadDailyData: async () => {},
  
  // Onboarding
  setOnboardingComplete: async () => {},
  checkOnboardingStatus: async () => {},
};
```

#### permissions.js
```javascript
// Handle all permissions
export const PermissionService = {
  checkCameraPermission: async () => {},
  requestCameraPermission: async () => {},
  checkGalleryPermission: async () => {},
  requestGalleryPermission: async () => {},
};
```

### 5. Utils

#### dateHelpers.js
```javascript
export const formatDateKey = (date) => {};
export const formatDisplayDate = (dateKey) => {};
export const isToday = (dateKey) => {};
export const getDateFromKey = (dateKey) => {};
```

#### nutritionCalculators.js
```javascript
export const calculateDailyGoals = (profile) => {};
export const calculateBMR = (profile) => {};
export const calculateTotalMacros = (foods) => {};
export const getCaloriePercentage = (current, goal) => {};
```

### 6. Constants

#### colors.js
```javascript
export const Colors = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  background: '#F2F2F7',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E5E5EA',
  white: '#FFFFFF',
};
```

#### dimensions.js
```javascript
export const Spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 30,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
```

## Implementation Steps

### Phase 1: Setup Structure (Day 1)
1. Create folder structure
2. Move existing services to `src/services`
3. Create constants files
4. Set up navigation structure

### Phase 2: Extract Screens (Day 2-3)
1. Extract WelcomeScreen
2. Extract ProfileSetupScreen
3. Extract DashboardScreen
4. Extract CameraScreen
5. Set up navigation between screens

### Phase 3: Create Components (Day 4-5)
1. Build common components (Button, Card, etc.)
2. Create nutrition components
3. Create dashboard components
4. Create camera components

### Phase 4: Implement Hooks (Day 6)
1. Create useCamera hook
2. Create useNutrition hook
3. Create useProfile hook
4. Create useStorage hook

### Phase 5: Refactor Logic (Day 7)
1. Move business logic to services
2. Move utilities to utils
3. Update imports throughout

### Phase 6: Styling (Day 8)
1. Extract styles to separate files
2. Create theme system
3. Implement consistent spacing

### Phase 7: Context & State (Day 9)
1. Set up UserContext
2. Set up NutritionContext
3. Move global state to contexts

### Phase 8: Testing & Cleanup (Day 10)
1. Test all functionality
2. Remove old code
3. Update documentation

## Benefits After Refactoring

1. **Maintainability**: Easier to find and fix bugs
2. **Reusability**: Components can be used multiple times
3. **Testability**: Individual components can be tested
4. **Performance**: Better code splitting and lazy loading
5. **Team Collaboration**: Multiple developers can work on different parts
6. **Scalability**: Easier to add new features

## Code Quality Improvements

### Before
```javascript
// Everything in one file
export default function App() {
  // 100+ lines of state
  // 500+ lines of functions
  // 800+ lines of JSX
  // 300+ lines of styles
}
```

### After
```javascript
// App.js - Clean and simple
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
```

## Migration Strategy

### Option 1: Incremental Refactoring
- Keep App.js working while extracting components
- Test each component as you extract it
- Gradually reduce App.js size

### Option 2: Parallel Development
- Create new structure alongside existing
- Build components in isolation
- Switch over when complete

### Option 3: Feature-by-Feature
- Refactor one feature at a time
- Start with simplest (Welcome screen)
- End with most complex (Camera/Analysis)

## Testing Checklist

After each component extraction:
- [x] Component renders without errors
- [x] Props are properly passed
- [x] State updates work correctly
- [x] User interactions function
- [x] Styling appears correct
- [x] No console errors/warnings

## Common Pitfalls to Avoid

1. **Don't over-engineer**: Start simple, refactor as needed
2. **Maintain functionality**: Don't break working features
3. **Keep consistent naming**: Use clear, descriptive names
4. **Document as you go**: Add comments for complex logic
5. **Test frequently**: Verify each change works

## Final Structure Benefits

- **App.js**: ~50 lines (just providers and navigator)
- **Each screen**: ~100-200 lines
- **Each component**: ~50-100 lines
- **Clear separation**: UI, logic, and data separate
- **Easy onboarding**: New developers understand structure quickly