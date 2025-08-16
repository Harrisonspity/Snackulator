#!/bin/bash

# This script sets up EAS for the Nutrition AI Analyzer app

echo "Setting up EAS Build..."

# First, let's manually add the project ID to app.json
# You'll need to create the project on expo.dev first

cat << 'EOF'

==================================================
MANUAL SETUP REQUIRED:
==================================================

Since EAS requires interactive input, please run these commands manually:

1. First, run:
   eas build:configure

2. When prompted:
   - Select "Yes" to create an EAS project
   - The project will be created under your account

3. Then build for your platform:
   
   For iOS development build:
   eas build --profile development --platform ios
   
   For Android development build:
   eas build --profile development --platform android

4. Once the build is complete:
   - Download the build file
   - Install it on your device/simulator
   - Run: npx expo start --dev-client

==================================================
EOF