# AI Nutrition Analysis Setup

## Quick Start

1. **Get an OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key (it starts with `sk-`)

2. **Configure Your App**
   ```bash
   # Create a .env file in the project root
   cp .env.example .env
   
   # Edit .env and add your API key
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Restart the Expo Server**
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm start
   ```

4. **Test the Feature**
   - Open the app
   - Take a photo of any food
   - Tap "Analyze Nutrition"
   - See real nutritional data!

## How It Works

The app uses OpenAI's GPT-4 Vision model to:
1. Identify the food in your image
2. Estimate portion sizes based on visual cues
3. Provide accurate nutritional information
4. Return confidence levels for the analysis

## Costs

- Each image analysis costs approximately $0.01-0.02
- OpenAI provides $5 free credits for new accounts
- Monitor usage at: https://platform.openai.com/usage

## Troubleshooting

### "API key not configured" Error
- Make sure you created the `.env` file
- Check that the key name is exactly: `EXPO_PUBLIC_OPENAI_API_KEY`
- Restart the Expo server after adding the key

### "Invalid API key" Error
- Verify your API key is correct and active
- Check for extra spaces or characters
- Ensure the key starts with `sk-`

### "Rate limit exceeded" Error
- Wait a few seconds and try again
- Check your OpenAI usage limits
- Consider upgrading your OpenAI plan if needed

## Testing Without API Key

To test the app without an API key, change line 100 in `App.js`:
```javascript
// Change from:
const nutritionData = await analyzeFoodImage(image, 'OPENAI');

// To:
const nutritionData = await analyzeFoodImage(image, 'MOCK');
```

This will use mock data for testing the UI and functionality.