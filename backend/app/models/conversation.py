"""Request and response models for temporary patient conversations."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ConversationCreateRequest(BaseModel):
    staff_language: str = "en"
    patient_language: str


class ConversationSessionResponse(BaseModel):
    token: str
    staff_language: str
    patient_language: str
    status: Literal["waiting", "active", "ended"]
    patient_joined: bool
    expires_at: datetime


class ConversationJoinResponse(BaseModel):
    token: str
    patient_language: str
    staff_language: str
    status: Literal["waiting", "active", "ended"]
    patient_joined: bool
    expires_at: datetime


class ConversationMessageRequest(BaseModel):
    sender: Literal["staff", "patient"]
    text: str = Field(..., min_length=1, max_length=2000)


class ConversationMessageResponse(BaseModel):
    id: int
    sender: Literal["staff", "patient"]
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    created_at: datetime


class ConversationMessagesResponse(BaseModel):
    messages: list[ConversationMessageResponse]
