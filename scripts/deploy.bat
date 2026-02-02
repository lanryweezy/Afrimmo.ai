@echo off
REM Production Deployment Script for Windows

echo Starting production deployment...

REM Check if we're in the correct directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
call npm ci
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    exit /b 1
)

REM Run validation checks
echo Running validation checks...
call npm run validate
if %errorlevel% neq 0 (
    echo Error: Validation checks failed
    exit /b 1
)

REM Build the application
echo Building application...
call npm run build:prod
if %errorlevel% neq 0 (
    echo Error: Build failed
    exit /b 1
)

REM Verify build
if not exist "dist" (
    echo Error: Build failed - dist directory does not exist
    exit /b 1
)

REM Check if dist directory is not empty
dir /b "dist" | findstr . >nul
if errorlevel 1 (
    echo Error: Build failed - dist directory is empty
    exit /b 1
)

echo Build completed successfully!

REM Optional: Run production server for verification
echo Previewing build locally...
start /min cmd /c "npm run preview:prod"

REM Wait for server to start
timeout /t 5 /nobreak >nul

REM Note: We can't easily test the server in batch, so we'll skip that step

echo Deployment preparation complete!
echo Files are ready in the 'dist' directory.
echo.
echo Next steps:
echo - Upload contents of 'dist' directory to your web server
echo - Ensure your server serves index.html for 404s (for client-side routing)
echo - Configure SSL/TLS certificates
echo - Set up monitoring and error reporting