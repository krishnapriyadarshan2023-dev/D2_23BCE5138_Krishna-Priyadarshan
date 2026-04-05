@echo off
color 0A
echo.
echo ========================================
echo   S.H.I.E.L.D - Starting Services
echo ========================================
echo.

echo [1/3] Starting MongoDB...
start "MongoDB" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
timeout /t 5 /nobreak >nul
echo [OK] MongoDB started
echo.

echo [2/3] Starting Backend Server...
cd /d "d:\my project\server"
start "Backend" cmd /k npm run dev
timeout /t 3 /nobreak >nul
echo [OK] Backend starting on http://localhost:5000
echo.

echo [3/3] Starting Frontend...
cd /d "d:\my project\app"
start "Frontend" cmd /k npm run dev
timeout /t 2 /nobreak >nul
echo [OK] Frontend starting on http://localhost:5173
echo.

echo ========================================
echo   All Services Started Successfully!
echo ========================================
echo.
echo Three windows opened:
echo   1. MongoDB (database)
echo   2. Backend (API server)
echo   3. Frontend (web app)
echo.
echo Wait 10 seconds, then open browser:
echo http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
