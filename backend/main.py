"""Compatibility entrypoint for local development.

The FastAPI app now lives in app.main.
"""

from __future__ import annotations

import os

import uvicorn

from app.main import app


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
