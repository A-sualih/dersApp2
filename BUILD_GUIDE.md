# Build Guide - New App Version 2.0.0

## App Information
- **App Name**: በኡስታዝ አቡ አብዲላህ ሀሠን ጎር
- **New Package ID**: `com.dersapp.newversion2024`
- **Version**: 2.0.0
- **Slug**: dersapp2024

## Prerequisites
1. Expo account (create at https://expo.dev)
2. EAS CLI installed: `npm install -g eas-cli`
3. Login to EAS: `eas login`

## Build Steps

### Option 1: Build APK (For Testing/Distribution outside Play Store)

```bash
# Build APK for testing
npm run build:apk

# Or manually:
eas build -p android --profile preview
```

This will create an APK file that you can install directly on Android devices.

### Option 2: Build AAB (For Google Play Store)

```bash
# Build production AAB
eas build -p android --profile production
```

This creates an Android App Bundle (AAB) for uploading to Google Play Store.

### Option 3: Build iOS App

```bash
# Build for iOS
eas build -p ios --profile production
```

Note: iOS builds require an Apple Developer account.

## First Time Setup

If this is your first build with EAS, run:

```bash
# Configure the project
eas build:configure

# Update the EAS project ID (if needed)
eas init
```

## Local Development

```bash
# Start development server
npm run start:dev

# Start for Android
npm run android

# Start for iOS
npm run ios

# Start for Web
npm run web
```

## Build Profiles

### Development
- Internal distribution
- Development client enabled
- Use: `eas build --profile development`

### Preview
- Creates APK for testing
- Use: `npm run build:apk` or `eas build --profile preview`

### Production
- Creates AAB for Play Store
- Creates IPA for App Store
- Use: `eas build --profile production`

## After Building

1. **Download the build**: EAS will provide a download link when complete
2. **Install on device**: 
   - APK: Transfer to Android device and install
   - AAB: Upload to Google Play Console
3. **Test thoroughly** before releasing

## OTA Updates

After the initial build, you can push updates without rebuilding:

```bash
# Publish update
eas update --branch production --message "Your update message"
```

## Troubleshooting

### Build fails with asset errors
- Clear cache: `npx expo start --clear`
- Reinstall: `rm -rf node_modules && npm install`

### Metro bundler issues
- Clear Metro cache: `npx expo start --clear`
- Delete `.expo` folder

### EAS build issues
- Clear EAS cache: `eas build --clear-cache`
- Check build logs in the Expo dashboard

## Important Notes

1. **New App ID**: This is configured as a completely new app with ID `com.dersapp.newversion2024`
2. **Cannot Update Old App**: Users with the old app (com.lummatul.iitqad) will need to install this as a new app
3. **Asset Files**: All 57 audio files and PDF are bundled in the app
4. **First Launch**: App will load local assets on first launch

## Build Commands Quick Reference

```bash
# APK for testing
npm run build:apk

# Production AAB
eas build -p android --profile production

# iOS build
eas build -p ios --profile production

# Development build
eas build --profile development

# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

## Next Steps

1. Run `eas build:configure` if first time
2. Choose build profile (preview for APK, production for store)
3. Run the build command
4. Wait for build to complete (15-30 minutes)
5. Download and test
6. Submit to stores if ready

## Support

- Expo Documentation: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- Troubleshooting: https://docs.expo.dev/build-reference/troubleshooting/
