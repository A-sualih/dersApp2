@echo off
echo ============================================
echo SSL Certificate Fix Script
echo ============================================
echo.
echo This script will attempt to fix SSL issues
echo.

REM Set environment variables for SSL bypass
set NODE_TLS_REJECT_UNAUTHORIZED=0
set EXPO_NO_TLS=1

echo Environment variables set.
echo.
echo Try building now with:
echo npm run build:apk
echo.
echo Or:
echo npx eas build -p android --profile preview
echo.
pause