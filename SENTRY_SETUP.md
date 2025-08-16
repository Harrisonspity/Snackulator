# Sentry Setup for Crash Reporting

## Quick Setup (Optional - for crash reporting)

1. **Create a free Sentry account**
   - Go to https://sentry.io/signup/
   - Create a new project (React Native)
   - Get your DSN

2. **Update App.js with your DSN**
   Replace line 25 in App.js:
   ```javascript
   dsn: 'https://YOUR-ACTUAL-DSN@sentry.io/YOUR-PROJECT-ID',
   ```

3. **Skip Sentry (if you don't want it)**
   Comment out or remove lines 21-29 in App.js to disable Sentry

## What Sentry Will Show

- Exact crash location and stack trace
- Device information
- User actions before crash
- Network requests that failed
- Custom error messages

## Testing Without Sentry

The app will work fine without Sentry configured. Just leave the DSN as is or comment out the Sentry.init() block.