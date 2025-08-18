#!/bin/bash

# Script to set up EAS secrets for production builds
# Run this before creating production builds for TestFlight

echo "Setting up EAS secrets for Snackulator production build..."
echo ""
echo "This script will help you configure your API keys as EAS secrets."
echo "These secrets will be securely injected during the build process."
echo ""

# Check if eas-cli is installed
if ! command -v eas &> /dev/null; then
    echo "Error: EAS CLI is not installed."
    echo "Please install it with: npm install -g eas-cli"
    exit 1
fi

# Check if logged in to EAS
if ! eas whoami &> /dev/null; then
    echo "You need to log in to EAS first."
    eas login
fi

echo ""
echo "Setting up secrets for your project..."
echo ""

# Function to set a secret
set_secret() {
    local secret_name=$1
    local secret_prompt=$2
    
    echo "Setting $secret_name..."
    echo "$secret_prompt"
    read -s -p "Enter value (or press Enter to skip): " secret_value
    echo ""
    
    if [ ! -z "$secret_value" ]; then
        eas secret:create --name "$secret_name" --value "$secret_value" --type string --force
        echo "✓ $secret_name configured"
    else
        echo "⊘ $secret_name skipped"
    fi
    echo ""
}

# Set OpenAI API Key
set_secret "EXPO_PUBLIC_OPENAI_API_KEY" "Enter your OpenAI API key (from https://platform.openai.com/api-keys):"

echo ""
echo "Setup complete!"
echo ""
echo "Your secrets have been configured in EAS."
echo "They will be automatically injected during the build process."
echo ""
echo "To build for TestFlight, run:"
echo "  eas build --platform ios --profile production"
echo ""
echo "To build for internal testing, run:"
echo "  eas build --platform ios --profile preview"
echo ""
echo "To view your secrets, run:"
echo "  eas secret:list"