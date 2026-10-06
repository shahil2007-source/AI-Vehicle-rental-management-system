#!/usr/bin/env bash

# AI Vehicle Rental Management System - Cloud & Local Production Deployment Script

set -e

echo "=========================================================="
echo "🚀 AI Vehicle Rental Management System Deployment Helper"
echo "=========================================================="

MODE=${1:-"docker"}

if [ "$MODE" = "docker" ]; then
    echo "📦 Building and starting Docker containers..."
    if command -v docker-compose &> /dev/null; then
        docker-compose up --build -d
    elif docker compose version &> /dev/null; then
        docker compose up --build -d
    else
        echo "❌ Error: Docker Compose is not installed."
        exit 1
    fi
    echo ""
    echo "✅ Containers launched successfully!"
    echo "🌐 Frontend URL: http://localhost:80"
    echo "⚡ Backend API Docs: http://localhost:8000/docs"
elif [ "$MODE" = "build" ]; then
    echo "🛠️ Validating production builds..."
    echo "[1/2] Building React Frontend..."
    cd frontend && npm install && npm run build && cd ..
    echo "[2/2] Checking Python Backend dependencies..."
    python3 -m pip install -r backend/requirements.txt
    echo "✅ Production build checks completed successfully!"
elif [ "$MODE" = "local" ]; then
    echo "🔥 Launching local background servers..."
    echo "Starting FastAPI Backend on port 8000..."
    cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    echo "Starting Vite Frontend on port 5173..."
    cd frontend && npm run dev &
    FRONTEND_PID=$!
    echo "Both servers running in background."
    echo "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
else
    echo "Usage: ./deploy.sh [docker|build|local]"
    exit 1
fi
