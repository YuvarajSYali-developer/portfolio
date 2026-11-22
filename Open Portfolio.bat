@echo off
setlocal
title Yuvaraj S Yali - Portfolio
cd /d "%~dp0"
set PORT=3000

echo.
echo   ============================================
echo     Yuvaraj S Yali - Portfolio
echo   ============================================
echo.

rem --- 1. Node.js must be installed ---------------------------------------
where node >nul 2>nul
if errorlevel 1 goto :nonode

rem --- 2. Install packages the first time ---------------------------------
if exist "node_modules\" goto :checkbuild
echo   Installing packages - first run only, this takes a minute...
call npm install
if errorlevel 1 goto :fail

:checkbuild
rem --- 3. Build if there is no build yet, or if any file changed since ----
powershell -NoProfile -Command "$b = Get-Item '.next\BUILD_ID' -ErrorAction SilentlyContinue; if (-not $b) { exit 1 }; $n = Get-ChildItem app,components,lib,public -Recurse -File | Where-Object { $_.LastWriteTime -gt $b.LastWriteTime } | Select-Object -First 1; if ($n) { exit 1 } else { exit 0 }"
if not errorlevel 1 goto :start
echo   Building the website - takes about 30 seconds...
call npm run build
if errorlevel 1 goto :fail

:start
rem --- 4. Open the browser as soon as the site responds ------------------
echo.
echo   Starting the website at http://localhost:%PORT%
echo   Your browser will open automatically.
echo   Keep this window open while you view the site. Close it to stop.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "for ($i = 0; $i -lt 90; $i++) { try { Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 'http://localhost:%PORT%' | Out-Null; break } catch { Start-Sleep -Seconds 1 } }; Start-Process 'http://localhost:%PORT%'"
call npm run start -- -p %PORT%
goto :end

:nonode
echo   Node.js is not installed on this computer.
echo   Opening the download page - install the LTS version,
echo   then double-click this file again.
start "" https://nodejs.org/
pause
exit /b 1

:fail
echo.
echo   Something went wrong - see the messages above.
pause
exit /b 1

:end
endlocal
