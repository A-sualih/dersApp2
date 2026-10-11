# Pre-Build Checklist

## ✅ Completed Configuration
- [x] New app ID configured: `com.dersapp.newversion2024`
- [x] Version updated to 2.0.0
- [x] Bundle identifiers updated for iOS and Android
- [x] Type declarations added for asset files
- [x] Metro config verified
- [x] EAS CLI installed

## 📋 Before Building

### 1. Login to EAS (if not already logged in)
```bash
eas login
```

### 2. Initialize EAS project (first time only)
```bash
eas init
```
This will:
- Create a new project in your Expo account
- Generate a new project ID
- Update app.json with the new project ID

### 3. Clear cache and verify
```bash
# Clear Expo cache
npx expo start --clear

# Verify no errors in development
npm run start:dev
```

## 🔨 Build Commands

### Quick Build (APK for testing)
```bash
npm run build:apk
```

### Production Build (for Play Store)
```bash
eas build -p android --profile production
```

### iOS Build
```bash
eas build -p ios --profile production
```

## 🐛 Troubleshooting

### Certificate Error (as seen)
If you get certificate errors, try:
```bash
# Option 1: Use system CA
set NODE_EXTRA_CA_CERTS=
eas login

# Option 2: Disable SSL verification (not recommended for production)
set NODE_TLS_REJECT_UNAUTHORIZED=0
eas login
# Then unset it:
set NODE_TLS_REJECT_UNAUTHORIZED=1
```

### If build fails
1. Check build logs on expo.dev dashboard
2. Clear cache: `eas build --clear-cache`
3. Verify all dependencies: `npm install`

## 📱 What Changed from Old App

| Item | Old Value | New Value |
|------|-----------|-----------|
| Package ID | com.lummatul.iitqad | com.dersapp.newversion2024 |
| Slug | dersnewapp | dersapp2024 |
| Version | 1.4.0 | 2.0.0 |
| Scheme | lummatuliitqad | dersapp2024 |

## ⚠️ Important Notes

1. **This is a NEW app** - Users cannot update from the old version
2. **Old users** will need to download this as a separate app
3. **Both apps** can coexist on the same device
4. **New EAS project** - Will need to run `eas init` to create project

## 🚀 Ready to Build?

Run these commands in order:

```bash
# 1. Login (if needed)
eas login

# 2. Initialize project (first time)
eas init

# 3. Build APK
npm run build:apk

# 4. Wait for build (check status at expo.dev)
# Build typically takes 15-30 minutes

# 5. Download and test the APK
```

## 📊 Build Status

After running build command, you can check status:
```bash
# List all builds
eas build:list

# View specific build details
eas build:view [BUILD_ID]

# Cancel a build (if needed)
eas build:cancel
```

## 🎯 Post-Build Steps

1. ✅ Download the APK/AAB from Expo dashboard
2. ✅ Install on test device
3. ✅ Test all features:
   - Audio playback
   - PDF viewing
   - Navigation
   - Background audio
   - Recent items
4. ✅ If all works, submit to Play Store (for AAB builds)

## 📝 Build Logs

- View builds: https://expo.dev/accounts/[YOUR_USERNAME]/projects/dersapp2024/builds
- Build will show up there after running build command
