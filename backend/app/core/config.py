"""Application settings loaded from environment variables."""

from dataclasses import dataclass
import os

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "PharmaLingo - Pharmacy Translation API")
    app_version: str = os.getenv("APP_VERSION", "1.0.0")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    cors_origins: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,https://pharmalingo-backend.onrender.com,https://translationai-production.up.railway.app",
    )
    allow_origin_regex: str = os.getenv(
        "CORS_ALLOW_ORIGIN_REGEX",
        r"^(https://.*\.vercel\.app|http://localhost:\d+)$",
    )
    translation_api_url: str = os.getenv(
        "TRANSLATION_API_URL",
        "https://api.mymemory.translated.net/get",
    )
    translation_api_key: str = os.getenv("TRANSLATION_API_KEY", "")


settings = Settings()


def get_allowed_origins() -> list[str]:
    return [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
