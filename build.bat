@echo off
echo ========================================
echo DersApp 2024 - Build Script
echo ========================================
echo.
echo New App Configuration:
echo - Package ID: com.dersapp.newversion2024
echo - Version: 2.0.0
echo.
echo ========================================
echo.

:menu
echo Please select an option:
echo.
echo 1. Check EAS Login Status
echo 2. Login to EAS
echo 3. Initialize EAS Project (First Time Only)
echo 4. Build APK (For Testing)
echo 5. Build AAB (For Play Store)
echo 6. Build iOS
echo 7. Check Build Status
echo 8. Clear Cache and Reinstall
echo 9. Exit
echo.

set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto check_login
if "%choice%"=="2" goto login
if "%choice%"=="3" goto init
if "%choice%"=="4" goto build_apk
if "%choice%"=="5" goto build_aab
if "%choice%"=="6" goto build_ios
if "%choice%"=="7" goto status
if "%choice%"=="8" goto clean
if "%choice%"=="9" goto end

echo Invalid choice. Please try again.
echo.
goto menu

:check_login
echo.
echo Checking EAS login status...
call eas whoami
echo.
pause
goto menu

:login
echo.
echo Logging into EAS...
call eas login
echo.
pause
goto menu

:init
echo.
echo Initializing EAS project...
echo This will create a new project in your Expo account.
echo.
call eas init
echo.
pause
goto menu

:build_apk
echo.
echo Building APK for testing...
echo This will take 15-30 minutes.
echo.
call npm run build:apk
echo.
echo Build started! Check status at expo.dev
pause
goto menu

:build_aab
echo.
echo Building AAB for Google Play Store...
echo This will take 15-30 minutes.
echo.
call eas build -p android --profile production
echo.
echo Build started! Check status at expo.dev
pause
goto menu

:build_ios
echo.
echo Building for iOS...
echo Note: Requires Apple Developer Account
echo.
call eas build -p ios --profile production
echo.
echo Build started! Check status at expo.dev
pause
goto menu

:status
echo.
echo Checking build status...
call eas build:list
echo.
pause
goto menu

:clean
echo.
echo Cleaning cache and reinstalling...
echo.
echo Clearing Expo cache...
call npx expo start --clear
echo.
echo Removing node_modules...
rmdir /s /q node_modules 2>nul
echo.
echo Reinstalling dependencies...
call npm install
echo.
echo Done!
pause
goto menu

:end
echo.
echo Goodbye!
exit
