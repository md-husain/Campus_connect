@echo off
echo =========================================
echo  Starting CampusConnect Frontend Server
echo =========================================
echo.

cd /d "%~dp0Frontend_CampusConnect\frontend_campusconnect"

echo Current directory: %CD%
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting frontend server...
echo Frontend will run on: http://localhost:5173
echo.

call npm run dev

pause





