"""In-memory temporary conversation sessions for the QR MVP."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
import secrets

from fastapi import HTTPException


SESSION_TTL = timedelta(minutes=30)


@dataclass
class ConversationMessage:
    id: int
    sender: str
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    created_at: datetime


@dataclass
class ConversationSession:
    token: str
    staff_language: str
    patient_language: str
    expires_at: datetime
    patient_joined: bool = False
    ended: bool = False
    messages: list[ConversationMessage] = field(default_factory=list)

    @property
    def status(self) -> str:
        if self.ended or datetime.now(timezone.utc) >= self.expires_at:
            return "ended"
        return "active" if self.patient_joined else "waiting"


sessions: dict[str, ConversationSession] = {}


def _remove_expired_sessions() -> None:
    now = datetime.now(timezone.utc)
    expired_tokens = [
        token for token, session in sessions.items()
        if session.ended or now >= session.expires_at
    ]
    for token in expired_tokens:
        sessions.pop(token, None)


def create_session(staff_language: str, patient_language: str) -> ConversationSession:
    _remove_expired_sessions()
    session = ConversationSession(
        token=secrets.token_urlsafe(24),
        staff_language=staff_language,
        patient_language=patient_language,
        expires_at=datetime.now(timezone.utc) + SESSION_TTL,
    )
    sessions[session.token] = session
    return session


def get_session(token: str) -> ConversationSession:
    _remove_expired_sessions()
    session = sessions.get(token)
    if session is None:
        raise HTTPException(status_code=404, detail="Conversation not found or expired")
    return session


def join_session(token: str) -> ConversationSession:
    session = get_session(token)
    if session.status == "ended":
        raise HTTPException(status_code=410, detail="Conversation has ended")
    session.patient_joined = True
    return session


def end_session(token: str) -> ConversationSession:
    session = get_session(token)
    session.ended = True
    return session


def add_message(
    token: str,
    sender: str,
    original_text: str,
    translated_text: str,
    source_language: str,
    target_language: str,
) -> ConversationMessage:
    session = get_session(token)
    if session.status == "ended":
        raise HTTPException(status_code=410, detail="Conversation has ended")

    message = ConversationMessage(
        id=len(session.messages) + 1,
        sender=sender,
        original_text=original_text,
        translated_text=translated_text,
        source_language=source_language,
        target_language=target_language,
        created_at=datetime.now(timezone.utc),
    )
    session.messages.append(message)
    return message
