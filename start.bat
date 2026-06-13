@echo off
title Ilmiy Ish - Server
echo ========================================
echo   Ilmiy Ish Yordamchisi - Server
echo ========================================
echo.
echo Server ishga tushmoqda, kuting...
echo.

set PATH=%USERPROFILE%\node20;%USERPROFILE%\node20\node_modules\npm\bin;%PATH%
cd /d "%~dp0"

npx expo start --tunnel

pause
