#!/bin/bash
echo "Building ኹዝ አቂዳ በኡስታዝ አቡ ሁዘይፋ Android App..."

echo "Step 1: Export bundle..."
npx expo export --platform android --clear

echo "Step 2: Build APK..."
cd android
./gradlew clean assembleDebug

echo "Build complete! APK location: android/app/build/outputs/apk/debug/app-debug.apk"