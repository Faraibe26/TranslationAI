"""API routes for health checks and translation requests."""

from fastapi import APIRouter, HTTPException

from ..core.config import settings
from ..models.translation import TranslationRequest, TranslationResponse
from ..services.translation_service import translate_text


router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "pharmacy-translation-api"}


@router.post("/api/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest) -> TranslationResponse:
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        translated_text, used_source_language = await translate_text(
            request.text,
            request.source_language,
            request.target_language,
            settings,
        )
        return TranslationResponse(
            translated_text=translated_text,
            source_language=used_source_language,
            target_language=request.target_language,
        )
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Translation error: {error}") from error
