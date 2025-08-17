# Snackulator 🍎

**Congressional App Challenge 2025 Submission**  
**By: Harrison Spitnale**  
**High School: Bryan High School**  
**Congressional District: Ninth Congressional District**

## What is Snackulator?

Snackulator is a mobile app I created to help people make healthier food choices. Just take a photo of any food, and the app instantly tells you the nutritional information - calories, protein, carbs, fats, and more! It's like having a nutritionist in your pocket.

## Why I Made This App

I wanted to create an app that could tell me nutritional information for my cheeseburger. I wanted to make something simpler - just snap a photo and get instant results built with AI. 

## How It Works

1. **Take a Photo** - Use your camera or select from your photo library
2. **AI Analysis** - The app uses OpenAI to identify the food
3. **Get Results** - See calories, protein, carbs, fat, fiber, and sugar content
4. **Save History** - Track what you've eaten over time

## Features

- 📸 **Instant Food Recognition** - Take a photo and get results in seconds
- 📊 **Detailed Nutrition Info** - Calories, macros, and more
- 📱 **Works on iOS and Android** - Built with React Native
- 💾 **History Tracking** - Save your past food analyses
- 🎨 **Clean, Simple Design** - Easy for anyone to use

## Technology I Used

- **React Native & Expo** - For building the mobile app
- **OpenAI GPT-4 Vision** - For AI-powered food recognition
- **JavaScript** - Programming language
- **AsyncStorage** - For saving user data locally

## How to Run the App

### Prerequisites
- Node.js installed on your computer
- Expo Go app on your phone (free from App Store/Google Play)

### Steps
1. Clone this repository

2. Install dependencies
```bash
npm install
```

3. Start the app
```bash
npm start
```

4. Scan the QR code with Expo Go app on your phone

## Demo Mode

The app works in demo mode without any API keys. To use real AI analysis:
1. Get an OpenAI API key from https://openai.com
2. Create a `.env` file in the project root
3. Add your key: `EXPO_PUBLIC_OPENAI_API_KEY=your-key-here`

## Future Improvements

If I had more time, I would add:
- Meal planning features
- Daily nutrition goals tracking
- Barcode scanning for packaged foods
- Recipe suggestions based on dietary needs
- Share meals with friends/family

## What I Learned

Building this app taught me:
- How to integrate AI APIs into mobile apps
- Mobile app development with React Native
- Use AI to build apps that help people
- The importance of making technology for everyone

## Acknowledgments

Thanks to:
- My dad for guidance
- Congressional App Challenge for this opportunity

---

**Note:** This app was created as an educational project for the Congressional App Challenge. It demonstrates how technology can make healthy living more accessible to everyone.