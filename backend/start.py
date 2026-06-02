#!/usr/bin/env python3
"""Startup script for containerized and local backend runs."""

import os

import uvicorn

from app.main import app


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port, log_level="info")
