"""API routes for health checks and translation requests."""

from fastapi import APIRouter, HTTPException

from ..core.config import settings
from ..models.conversation import (
    ConversationCreateRequest,
    ConversationJoinResponse,
    ConversationMessageRequest,
    ConversationMessageResponse,
    ConversationMessagesResponse,
    ConversationSessionResponse,
)
from ..models.translation import TranslationRequest, TranslationResponse
from ..services import conversation_service
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


def _session_response(session) -> ConversationSessionResponse:
    return ConversationSessionResponse(
        token=session.token,
        staff_language=session.staff_language,
        patient_language=session.patient_language,
        status=session.status,
        patient_joined=session.patient_joined,
        expires_at=session.expires_at,
    )


@router.post("/api/conversations", response_model=ConversationSessionResponse)
def create_conversation(request: ConversationCreateRequest) -> ConversationSessionResponse:
    if request.staff_language == request.patient_language:
        raise HTTPException(status_code=400, detail="Conversation languages must be different")
    session = conversation_service.create_session(request.staff_language, request.patient_language)
    return _session_response(session)


@router.post("/api/conversations/{token}/join", response_model=ConversationJoinResponse)
def join_conversation(token: str) -> ConversationJoinResponse:
    session = conversation_service.join_session(token)
    return ConversationJoinResponse(
        token=session.token,
        patient_language=session.patient_language,
        staff_language=session.staff_language,
        status=session.status,
        patient_joined=session.patient_joined,
        expires_at=session.expires_at,
    )


@router.get("/api/conversations/{token}/messages", response_model=ConversationMessagesResponse)
def get_conversation_messages(token: str) -> ConversationMessagesResponse:
    session = conversation_service.get_session(token)
    return ConversationMessagesResponse(
        messages=[ConversationMessageResponse(**message.__dict__) for message in session.messages]
    )


@router.post("/api/conversations/{token}/messages", response_model=ConversationMessageResponse)
async def send_conversation_message(
    token: str,
    request: ConversationMessageRequest,
) -> ConversationMessageResponse:
    session = conversation_service.get_session(token)
    if request.sender == "patient":
        source_language, target_language = session.patient_language, session.staff_language
    else:
        source_language, target_language = session.staff_language, session.patient_language

    translated_text, used_source_language = await translate_text(
        request.text,
        source_language,
        target_language,
        settings,
    )
    message = conversation_service.add_message(
        token,
        request.sender,
        request.text,
        translated_text,
        used_source_language,
        target_language,
    )
    return ConversationMessageResponse(**message.__dict__)


@router.delete("/api/conversations/{token}", response_model=ConversationSessionResponse)
def end_conversation(token: str) -> ConversationSessionResponse:
    return _session_response(conversation_service.end_session(token))
