# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Expo Go
- **iOS**: Download from App Store
- **Android**: Download from Google Play Store

### 2. Run the App
```bash
# Navigate to the project directory
cd nutrition-ai-analyzer

# Start the development server
npm start
```

### 3. Connect Your Device
- Open Expo Go on your phone
- Scan the QR code from the terminal
- The app will load automatically

### 4. Test the App
1. **Take a photo** or **select from gallery**
2. **Tap "Analyze with AI"**
3. **View the nutritional results**
4. **Check your analysis history**

## 🎯 Current Features (Working Now)

✅ **Camera Integration** - Take photos directly in the app  
✅ **Gallery Selection** - Choose images from your photo library  
✅ **Mock AI Analysis** - Simulated nutritional analysis (no API key needed)  
✅ **Nutrition Display** - Shows calories, protein, carbs, fat, fiber, sugar  
✅ **History Tracking** - Saves your previous analyses  
✅ **Modern UI** - Beautiful, intuitive interface  

## 🔧 Enable Real AI (Optional)

To use real AI services instead of mock data:

### Option 1: OpenAI GPT-4 Vision
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Edit `App.js` line ~95:
   ```javascript
   const nutritionData = await analyzeFoodImage(image, 'OPENAI');
   ```
3. Set environment variable:
   ```bash
   export OPENAI_API_KEY="your-api-key"
   ```

### Option 2: Google Cloud Vision
1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Edit `App.js` line ~95:
   ```javascript
   const nutritionData = await analyzeFoodImage(image, 'GOOGLE_VISION');
   ```
3. Set environment variable:
   ```bash
   export GOOGLE_VISION_API_KEY="your-api-key"
   ```

## 📱 App Screenshots

The app includes:
- **Header**: App title and description
- **Image Preview**: Shows selected/taken photo
- **Action Buttons**: Camera, Gallery, Analyze
- **Nutrition Cards**: Detailed nutritional breakdown
- **History Section**: Previous analyses

## 🛠️ Troubleshooting

### App won't start?
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start
```

### Camera not working?
- Ensure you're on a physical device (camera doesn't work in simulator)
- Grant camera permissions when prompted

### Analysis fails?
- Check internet connection
- Verify API keys (if using real AI services)
- Try the mock mode first (default)

## 🎉 You're Ready!

The app is fully functional with mock data. You can:
- Take photos of food
- Get nutritional analysis
- View your history
- Experience the full UI

For real AI integration, follow the optional steps above.

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review the troubleshooting section
- The app works great with mock data for testing!
