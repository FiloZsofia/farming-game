@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo A futtatashoz Node.js 24 LTS szukseges: https://nodejs.org/
  echo Telepites utan nyisd meg ujra ezt a fajlt.
  pause
  exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
  echo Az npm nem talalhato. Telepitsd ujra a Node.js 24 LTS valtozatat.
  pause
  exit /b 1
)
if not exist node_modules\vite\package.json (
  echo Az elso inditashoz letoltjuk a projekt fuggosegeit.
  set CYPRESS_INSTALL_BINARY=0
  call npm ci
  if errorlevel 1 (
    echo A telepites nem sikerult. Ellenorizd az internetkapcsolatot es a fenti hibat.
    pause
    exit /b 1
  )
)
echo.
echo A jatek cime: http://127.0.0.1:5173/
echo Mindig ugyanezt a cimet hasznald a helyi farmmentesekhez.
echo Az ablak maradjon nyitva. Leallitas: Ctrl+C.
echo.
call npm run dev:local
pause
