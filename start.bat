@echo off
title STEAM-Craft — Server Running
color 0B

echo ===================================================================
echo     STEAM-Craft — Ruang Kolaborasi Multidisiplin Mahasiswa & Dosen
echo ===================================================================
echo.
echo Memeriksa instalasi Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terpasang di komputer ini!
    echo Silakan install Node.js dari https://nodejs.org
    pause
    exit /b
)

echo Menjalankan server lokal di http://localhost:3000 ...
echo Database SQLite : steamcraft.db
echo.
echo Membuka aplikasi di browser default...
timeout /t 2 /nobreak >nul
start http://localhost:3000

node server.js
pause
