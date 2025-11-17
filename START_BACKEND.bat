@echo off
echo ========================================
echo   Starting CampusConnect Backend Server
echo ========================================
echo.

cd /d "%~dp0Backend_CampusConnect"

echo Current directory: %CD%
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting backend server...
echo Backend will run on: http://localhost:5000
echo.

call npm run dev

pause





