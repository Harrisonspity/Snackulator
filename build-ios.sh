#!/bin/bash

echo "Building iOS development version for iPhone..."
echo ""
echo "This process will:"
echo "1. Create a development build in the cloud"
echo "2. Generate an install link for your iPhone"
echo ""

# Build for iOS physical device
eas build --profile development --platform ios

echo ""
echo "Once the build is complete:"
echo "1. You'll receive an email with the install link"
echo "2. Open the link on your iPhone"
echo "3. Install the development build"
echo "4. Then run: npx expo start --dev-client"