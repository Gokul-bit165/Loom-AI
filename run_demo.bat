@echo off
title Loom AI — Company Demo Launcher
echo ============================================================
echo   LOOM AI: CORE MODULES DEMO (Production, Breakdowns, Revenue)
echo   Ashok Textile Mills — Weaving Division
echo ============================================================
echo.

echo [1/3] Starting Loom AI v2 Backend on port 8050...
start "Loom AI Backend (Port 8050)" cmd /k "cd /d "%~dp0v2\backend" && python -m uvicorn app.main:app --port 8050 --reload"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Loom AI v2 Frontend on port 3001...
start "Loom AI Frontend (Port 3001)" cmd /k "cd /d "%~dp0v2\frontend" && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Launching browser at http://localhost:3001 ...
start "" "http://localhost:3001"

echo.
echo ============================================================
echo   Demo is now active!
echo   * Core Demo Workspaces:
echo     1. Production Intelligence (Daily, Performance, Trends, Reports)
echo     2. Breakdowns (Insights, Root Cause, Abnormal Events, Loss Impact)
echo     3. Revenue & Loss (P&L Attribution & Decision Room)
echo.
echo   Keep this window open or minimize it during your demo.
echo ============================================================
pause
