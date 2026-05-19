#!/bin/bash
set -e

echo "Starting PharmaLingo Backend..."
echo "Python version: $(python3 --version)"
echo "Uvicorn version: $(python3 -m pip show uvicorn | grep Version)"
echo "FastAPI version: $(python3 -m pip show fastapi | grep Version)"

PORT=${PORT:-8000}
echo "Starting uvicorn server on 0.0.0.0:$PORT..."
exec python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT
