#!/bin/bash

# Notes Application Startup Script
# This script installs dependencies and starts both the backend and frontend servers

set -e

echo "========================================"
echo "       Notes Application Startup        "
echo "========================================"

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 20.x or higher."
    exit 1
fi

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo ""

# Install backend dependencies
echo "[1/4] Installing backend dependencies..."
cd "$SCRIPT_DIR/backend"
npm install --silent

# Install frontend dependencies
echo "[2/4] Installing frontend dependencies..."
cd "$SCRIPT_DIR/frontend"
npm install --silent

# Start backend server
echo "[3/4] Starting backend server on http://localhost:3000..."
cd "$SCRIPT_DIR/backend"
npm run start:dev &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 3

# Start frontend server
echo "[4/4] Starting frontend server on http://localhost:3001..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "     Servers are starting up...         "
echo "========================================"
echo ""
echo "  Backend API:  http://localhost:3000"
echo "  Frontend App: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
