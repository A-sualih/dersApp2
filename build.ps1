# DersApp 2024 Build Script
# PowerShell version for better error handling

function Show-Menu {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "DersApp 2024 - Build Script" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "New App Configuration:" -ForegroundColor Yellow
    Write-Host "- Package ID: com.dersapp.newversion2024" -ForegroundColor White
    Write-Host "- Version: 2.0.0" -ForegroundColor White
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Check EAS Login Status" -ForegroundColor Green
    Write-Host "2. Login to EAS" -ForegroundColor Green
    Write-Host "3. Initialize EAS Project (First Time Only)" -ForegroundColor Green
    Write-Host "4. Build APK (For Testing)" -ForegroundColor Yellow
    Write-Host "5. Build AAB (For Play Store)" -ForegroundColor Yellow
    Write-Host "6. Build iOS" -ForegroundColor Yellow
    Write-Host "7. Check Build Status" -ForegroundColor Cyan
    Write-Host "8. Clear Cache and Reinstall" -ForegroundColor Red
    Write-Host "9. Start Development Server" -ForegroundColor Magenta
    Write-Host "0. Exit" -ForegroundColor Gray
    Write-Host ""
}

function Check-Login {
    Write-Host "`nChecking EAS login status..." -ForegroundColor Yellow
    eas whoami
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Logged in successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n✗ Not logged in or error occurred" -ForegroundColor Red
    }
    Pause
}

function Login-EAS {
    Write-Host "`nLogging into EAS..." -ForegroundColor Yellow
    eas login
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Login successful!" -ForegroundColor Green
    } else {
        Write-Host "`n✗ Login failed" -ForegroundColor Red
    }
    Pause
}

function Initialize-Project {
    Write-Host "`nInitializing EAS project..." -ForegroundColor Yellow
    Write-Host "This will create a new project in your Expo account." -ForegroundColor Cyan
    eas init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Project initialized!" -ForegroundColor Green
    } else {
        Write-Host "`n✗ Initialization failed" -ForegroundColor Red
    }
    Pause
}

function Build-APK {
    Write-Host "`nBuilding APK for testing..." -ForegroundColor Yellow
    Write-Host "This will take 15-30 minutes." -ForegroundColor Cyan
    npm run build:apk
    Write-Host "`nBuild started! Check status at expo.dev" -ForegroundColor Green
    Pause
}

function Build-AAB {
    Write-Host "`nBuilding AAB for Google Play Store..." -ForegroundColor Yellow
    Write-Host "This will take 15-30 minutes." -ForegroundColor Cyan
    eas build -p android --profile production
    Write-Host "`nBuild started! Check status at expo.dev" -ForegroundColor Green
    Pause
}

function Build-iOS {
    Write-Host "`nBuilding for iOS..." -ForegroundColor Yellow
    Write-Host "Note: Requires Apple Developer Account" -ForegroundColor Red
    eas build -p ios --profile production
    Write-Host "`nBuild started! Check status at expo.dev" -ForegroundColor Green
    Pause
}

function Check-Status {
    Write-Host "`nChecking build status..." -ForegroundColor Yellow
    eas build:list
    Pause
}

function Clean-Install {
    Write-Host "`nCleaning cache and reinstalling..." -ForegroundColor Yellow
    
    Write-Host "Clearing Expo cache..." -ForegroundColor Cyan
    npx expo start --clear
    
    Write-Host "Removing node_modules..." -ForegroundColor Cyan
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
    }
    
    Write-Host "Reinstalling dependencies..." -ForegroundColor Cyan
    npm install
    
    Write-Host "`n✓ Done!" -ForegroundColor Green
    Pause
}

function Start-Dev {
    Write-Host "`nStarting development server..." -ForegroundColor Yellow
    npm run start:dev
}

# Main loop
do {
    Show-Menu
    $choice = Read-Host "Enter your choice (0-9)"
    
    switch ($choice) {
        "1" { Check-Login }
        "2" { Login-EAS }
        "3" { Initialize-Project }
        "4" { Build-APK }
        "5" { Build-AAB }
        "6" { Build-iOS }
        "7" { Check-Status }
        "8" { Clean-Install }
        "9" { Start-Dev }
        "0" { 
            Write-Host "`nGoodbye!" -ForegroundColor Cyan
            exit 
        }
        default { 
            Write-Host "`nInvalid choice. Please try again." -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }
} while ($true)
