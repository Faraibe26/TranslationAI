#!/bin/bash
set -e

echo "Starting PharmaLingo Backend..."
echo "Python version: $(python3 --version)"
echo "Uvicorn version: $(python3 -m pip show uvicorn | grep Version)"
echo "FastAPI version: $(python3 -m pip show fastapi | grep Version)"

echo "Starting uvicorn server on 0.0.0.0:8000..."
exec python3 -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
