@echo off
echo ========================================================
echo   Starting LexiCore Legal AI (MERN + RAG + Vector DB)
echo ========================================================
echo.
echo [1/2] Launching Backend on Port 5000...
start cmd /k "cd backend && npm start"

echo [2/2] Launching Frontend on Port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers initiated!
echo Backend:  http://localhost:5000/api/health
echo Frontend: http://localhost:5173
echo.
pause

