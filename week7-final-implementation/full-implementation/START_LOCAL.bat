@echo off
color 0A
echo.
echo ========================================
echo   S.H.I.E.L.D - Local Setup
echo ========================================
echo.

echo Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MongoDB not found!
    echo.
    echo Please install MongoDB from:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo OR use MongoDB Atlas cloud database.
    echo See MONGODB_SETUP.md for instructions.
    echo.
    pause
    exit /b 1
)
echo [OK] MongoDB is installed
echo.

echo Checking if MongoDB is running...
tasklist | findstr "mongod" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Starting MongoDB...
    start "MongoDB" cmd /k "mongod"
    timeout /t 5 /nobreak >nul
    echo [OK] MongoDB started
) else (
    echo [OK] MongoDB already running
)
echo.

echo Starting Backend Server...
start "Backend - S.H.I.E.L.D" cmd /k "cd /d d:\my project\server && npm run dev"
timeout /t 3 /nobreak >nul
echo [OK] Backend starting on http://localhost:5000
echo.

echo Starting Frontend...
start "Frontend - S.H.I.E.L.D" cmd /k "cd /d d:\my project\app && npm run dev"
echo [OK] Frontend starting on http://localhost:5173
echo.

echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo MongoDB:  Running in separate window
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Wait 10 seconds, then open:
echo http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
