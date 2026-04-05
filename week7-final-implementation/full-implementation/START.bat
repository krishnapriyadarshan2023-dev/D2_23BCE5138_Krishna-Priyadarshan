@echo off
echo ========================================
echo   S.H.I.E.L.D - Starting All Services
echo ========================================
echo.

echo [1/3] Starting MongoDB...
start "MongoDB" cmd /k "mongod"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Backend Server...
start "Backend" cmd /k "cd /d d:\my project\server && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd /d d:\my project\app && npm run dev"

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo MongoDB:  Running in separate window
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
