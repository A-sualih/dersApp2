# 🚀 DersApp 2024 - Build Instructions

## Quick Start

### Option 1: Use Build Script (Recommended)
```bash
# Run the interactive menu
.\build.bat
# Or for PowerShell users:
.\build.ps1
```

### Option 2: Manual Commands
```bash
# Step 1: Login
eas login

# Step 2: Initialize (first time only)
eas init

# Step 3: Build APK
npm run build:apk
```

## 📱 What's New in This Version

This is a **completely new app** with:
- New Package ID: `com.dersapp.newversion2024`
- New Version: `2.0.0`
- Same functionality as the previous version
- Can be installed alongside the old app

## 🔧 Configuration Summary

| Setting | Value |
|---------|-------|
| App Name | በኡስታዝ አቡ አብዲላህ ሀሠን ጎር |
| Package ID (Android) | com.dersapp.newversion2024 |
| Bundle ID (iOS) | com.dersapp.newversion2024 |
| Version | 2.0.0 |
| Slug | dersapp2024 |

## 📋 Build Process

### 1️⃣ First Time Setup
```bash
# Install dependencies (if not done)
npm install

# Login to Expo
eas login

# Initialize project
eas init
```

### 2️⃣ Build for Testing (APK)
```bash
npm run build:apk
```
This creates an APK you can install directly on Android devices.

### 3️⃣ Build for Production (AAB)
```bash
eas build -p android --profile production
```
This creates an AAB for uploading to Google Play Store.

### 4️⃣ Build for iOS
```bash
eas build -p ios --profile production
```
Requires an Apple Developer account.

## ⏱️ Build Time

- APK/AAB builds: **15-30 minutes**
- iOS builds: **20-40 minutes**

You can close your terminal - builds run on Expo's servers.

## 📊 Track Your Build

1. After starting a build, you'll get a link to track progress
2. Visit: https://expo.dev
3. Go to your project → Builds
4. Download completed builds from there

## 🐛 Common Issues & Solutions

### Issue: Certificate Error
```bash
# Solution: Use system certificates
set NODE_EXTRA_CA_CERTS=
eas login
```

### Issue: Build Fails with Asset Errors
```bash
# Solution: Clear cache
npx expo start --clear
npm install
```

### Issue: "Not logged in"
```bash
# Solution: Login again
eas login
```

### Issue: Metro bundler errors
```bash
# Solution: Clear everything
npm run start:dev
# Press Shift+R when server starts to reset cache
```

## 📦 Files Created/Modified

### New Files
- ✅ `BUILD_GUIDE.md` - Comprehensive build documentation
- ✅ `BUILD_CHECKLIST.md` - Pre-build checklist
- ✅ `build.bat` - Windows batch script for building
- ✅ `build.ps1` - PowerShell script for building
- ✅ `declarations.d.ts` - TypeScript declarations for assets
- ✅ `src/utils/fileSystem.ts` - File system utilities
- ✅ `src/hooks/useAppLifecycle.ts` - App lifecycle hook
- ✅ `src/hooks/useOTAUpdate.ts` - OTA update hook

### Modified Files
- ✅ `app.json` - Updated with new package ID and version
- ✅ `src/components/LocalFileListItem.tsx` - Fixed missing props
- ✅ `app/derse-detail.tsx` - Fixed audio hook import
- ✅ `src/utils/useLocalAssets.ts` - Fixed dynamic require issues

## 🎯 Testing Checklist

After building, test these features:

- [ ] App launches successfully
- [ ] Audio files play correctly
- [ ] PDF files open and display
- [ ] Background audio playback works
- [ ] Recent items are saved and displayed
- [ ] Navigation between screens
- [ ] Search functionality
- [ ] Settings and about page

## 📱 Distribution Options

### Option A: Direct APK Distribution
1. Build APK: `npm run build:apk`
2. Download APK from expo.dev
3. Share APK file directly with users
4. Users install from file

### Option B: Google Play Store
1. Build AAB: `eas build -p android --profile production`
2. Download AAB from expo.dev
3. Upload to Google Play Console
4. Submit for review
5. Publish when approved

### Option C: TestFlight (iOS)
1. Build iOS: `eas build -p ios --profile production`
2. Download from expo.dev
3. Upload to App Store Connect
4. Add testers in TestFlight
5. Distribute to testers

## 🔄 Over-The-Air (OTA) Updates

After users have the app installed, you can push updates without rebuilding:

```bash
# Publish an update
eas update --branch production --message "Bug fixes and improvements"
```

OTA updates are **instant** - no need to wait for build time!

## 📞 Support

- **Expo Docs**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Troubleshooting**: https://docs.expo.dev/build-reference/troubleshooting/

## ✅ Ready to Build?

### Quick Command Reference
```bash
# Start building immediately
npm run build:apk

# Or use the interactive menu
.\build.bat
```

That's it! The build will start and you can track it on expo.dev. Good luck! 🎉
