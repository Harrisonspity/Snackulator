# Production Deployment Guide for Snackulator

## Environment Variables in Production

### The Problem
When building for TestFlight or App Store, `process.env` variables from `.env` files are not available because:
1. `.env` files are in `.gitignore` (for security)
2. EAS Build only uploads files tracked by git
3. Environment variables must be injected during the build process

### The Solution

This app uses a multi-layered approach for environment variables:

1. **Development**: Uses `.env` file locally
2. **Production**: Uses EAS Secrets for sensitive values

## Setting Up for TestFlight/Production

### Step 1: Configure EAS Secrets

Run the setup script to configure your API keys as EAS secrets:

```bash
./scripts/setup-eas-secrets.sh
```

This will prompt you to enter your OpenAI API key, which will be securely stored in EAS.

### Step 2: Build for TestFlight

```bash
# For TestFlight distribution
eas build --platform ios --profile production

# For internal testing
eas build --platform ios --profile preview
```

### Step 3: Submit to TestFlight

```bash
eas submit --platform ios --profile production
```

## How It Works

### Configuration Files

1. **`config/env.js`**: Central environment configuration
   - Detects current environment (development/preview/production)
   - Handles API key retrieval
   - Provides fallback to mock data

2. **`config/ai-service.js`**: AI service configuration
   - Uses `ENV` from `config/env.js`
   - Validates API key availability
   - Switches between live and mock data

3. **`eas.json`**: Build profiles
   - Production profile includes `EXPO_PUBLIC_OPENAI_API_KEY` reference
   - EAS injects the secret value during build

### Environment Variables

- **`EXPO_PUBLIC_OPENAI_API_KEY`**: OpenAI API key
  - Development: Read from `.env` file
  - Production: Injected from EAS secrets

### Mock Data Fallback

If no API key is configured, the app automatically falls back to mock data:
- Useful for testing without API costs
- Ensures app works even if API key is missing
- Shows random sample nutrition data

## Managing Secrets

### View current secrets
```bash
eas secret:list
```

### Update a secret
```bash
eas secret:create --name EXPO_PUBLIC_OPENAI_API_KEY --value "your-new-key" --force
```

### Delete a secret
```bash
eas secret:delete --name EXPO_PUBLIC_OPENAI_API_KEY
```

## Troubleshooting

### API key not working in TestFlight

1. Verify secret is set: `eas secret:list`
2. Check build logs for environment variable injection
3. Ensure using correct build profile: `--profile production`

### App using mock data in production

1. Check if API key is properly set in EAS secrets
2. Verify `eas.json` includes the environment variable in production profile
3. Create a new build after setting secrets

### Build fails with environment errors

1. Don't commit `.env` files with real API keys
2. Use EAS secrets for all sensitive values
3. Ensure `eas.json` references secrets correctly

## Security Best Practices

1. **Never commit API keys** to git repository
2. **Use different keys** for development and production
3. **Rotate keys regularly** and update EAS secrets
4. **Monitor API usage** to detect any unauthorized access
5. **Use `.env.example`** to document required variables without values

## Additional Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Environment Variables](https://docs.expo.dev/build/eas-json/#environment-variables)
- [EAS Secrets Management](https://docs.expo.dev/build/eas-json/#secrets)