# Nutrition AI Analyzer

A React Native Expo app that uses AI to analyze food images and provide detailed nutritional information. The app can take photos or select images from the gallery, then use various AI services to identify food items and display their nutritional content.

## Features

- 📸 **Camera Integration**: Take photos directly within the app
- 🖼️ **Gallery Selection**: Choose images from your device's photo library
- 🤖 **AI Analysis**: Analyze food images using multiple AI services
- 📊 **Nutritional Data**: Display comprehensive nutritional information including:
  - Calories
  - Protein, Carbohydrates, Fat
  - Fiber and Sugar content
  - Confidence level of the analysis
- 📱 **History**: Save and view your previous analyses
- 🎨 **Modern UI**: Beautiful, intuitive interface with smooth animations
- 💾 **Local Storage**: Persist analysis history using AsyncStorage

## Screenshots

The app features a clean, modern interface with:
- Blue header with app title and subtitle
- Image preview area with clear button
- Action buttons for camera, gallery, and AI analysis
- Nutrition cards displaying detailed information
- History section showing previous analyses

## Supported AI Services

The app is configured to work with multiple AI services:

### 1. OpenAI GPT-4 Vision
- Most advanced AI analysis
- Requires OpenAI API key
- Provides detailed nutritional analysis

### 2. Google Cloud Vision
- Good for food identification
- Requires Google Cloud Vision API key
- Maps results to nutrition database

### 3. Calorie Mama
- Specialized in food recognition
- Requires Calorie Mama API key
- Provides accurate calorie estimates

### 4. Mock Data (Default)
- For demonstration purposes
- No API key required
- Simulates real AI responses

## Installation

1. **Clone or download the project**
   ```bash
   cd nutrition-ai-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Install Expo Go on your mobile device
   - Scan the QR code from the terminal
   - Or run on iOS simulator: `npm run ios`
   - Or run on Android emulator: `npm run android`

## Configuration

### Setting up AI Services

1. **OpenAI GPT-4 Vision**
   ```bash
   # Get your API key from https://platform.openai.com/
   export OPENAI_API_KEY="your-openai-api-key"
   ```

2. **Google Cloud Vision**
   ```bash
   # Get your API key from Google Cloud Console
   export GOOGLE_VISION_API_KEY="your-google-vision-api-key"
   ```

3. **Calorie Mama**
   ```bash
   # Get your API key from Calorie Mama
   export CALORIE_MAMA_API_KEY="your-calorie-mama-api-key"
   ```

4. **Nutritionix (Optional)**
   ```bash
   # Get your credentials from Nutritionix
   export NUTRITIONIX_APP_ID="your-nutritionix-app-id"
   export NUTRITIONIX_APP_KEY="your-nutritionix-app-key"
   ```

### Updating the App to Use Real AI

1. **Edit the analysis call in App.js**
   ```javascript
   // Change from 'MOCK' to your preferred service
   const nutritionData = await analyzeFoodImage(image, 'OPENAI');
   ```

2. **Available service options:**
   - `'MOCK'` - Demo data (default)
   - `'OPENAI'` - OpenAI GPT-4 Vision
   - `'GOOGLE_VISION'` - Google Cloud Vision
   - `'CALORIE_MAMA'` - Calorie Mama API

## Project Structure

```
nutrition-ai-analyzer/
├── App.js                 # Main application component
├── config/
│   └── ai-service.js      # AI service configurations
├── services/
│   └── ai-analysis.js     # AI analysis logic
├── assets/                # Images and static files
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Dependencies

- **expo-image-picker**: Camera and gallery access
- **expo-camera**: Camera functionality
- **expo-media-library**: Media library access
- **@react-native-async-storage/async-storage**: Local data persistence
- **axios**: HTTP requests for AI APIs
- **react-native-elements**: UI components

## Usage

1. **Launch the app** and grant camera/gallery permissions when prompted
2. **Take a photo** using the camera button or **select an image** from your gallery
3. **Tap "Analyze with AI"** to process the image
4. **View the results** showing nutritional information
5. **Check your history** to see previous analyses

## Customization

### Adding New AI Services

1. **Update config/ai-service.js**
   ```javascript
   export const AI_SERVICES = {
     // ... existing services
     YOUR_SERVICE: {
       name: 'Your Service Name',
       baseUrl: 'https://api.yourservice.com',
       apiKey: process.env.YOUR_SERVICE_API_KEY,
     },
   };
   ```

2. **Add analysis function in services/ai-analysis.js**
   ```javascript
   const analyzeWithYourService = async (imageUri) => {
     // Your analysis logic here
   };
   ```

3. **Update the main analysis function**
   ```javascript
   case 'YOUR_SERVICE':
     result = await analyzeWithYourService(imageUri);
     break;
   ```

### Styling

The app uses a modern design with:
- Blue color scheme (#007AFF)
- Rounded corners and shadows
- Card-based layout
- Responsive design

You can customize colors and styling in the `styles` object in `App.js`.

## Troubleshooting

### Common Issues

1. **Camera not working**
   - Ensure camera permissions are granted
   - Check if running on a physical device (camera may not work in simulator)

2. **AI analysis failing**
   - Verify API keys are correctly set
   - Check internet connection
   - Ensure the AI service is active and accessible

3. **App crashes on startup**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Debug Mode

Enable debug logging by adding console.log statements in the analysis functions or checking the Expo development tools.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the Expo documentation
- Check the AI service documentation for API-specific issues

## Future Enhancements

- [ ] Barcode scanning for packaged foods
- [ ] Meal planning and tracking
- [ ] Social sharing of nutrition data
- [ ] Offline mode with cached results
- [ ] Multiple language support
- [ ] Dietary restriction filtering
- [ ] Integration with health apps
