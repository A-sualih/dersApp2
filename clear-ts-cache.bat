@echo off
echo Clearing TypeScript and Metro cache...
echo.

echo 1. Clearing Metro bundler cache...
call npx expo start --clear --no-dev

echo.
echo 2. Please also restart your editor/IDE (VS Code, etc.)
echo.
echo Done! The TypeScript language server should now recognize the hooks.
pause
