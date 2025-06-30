"""
Pydantic models for API requests and responses.
"""

from typing import Dict, Optional

from pydantic import BaseModel


class QuestionRequest(BaseModel):
    """Request model for submitting a philosophical question and optional perspective."""

    question: str
    perspective: Optional[str] = None


class AnswerMetadata(BaseModel):
    generationTime: str  # ISO string
    model: str
    outputTokens: int
    temperature: float
    promptUUID: str
    # Allow for future extensibility
    extra: dict = {}


class AnswerResponse(BaseModel):
    """Response model containing the perspective and generated answer."""

    perspective: str
    answer: str
    metadata: AnswerMetadata


class ConclusionRequest(BaseModel):
    """Request model for submitting multiple answers for conclusion generation."""

    answers: Dict[str, str]


class ConclusionResponse(BaseModel):
    """Response model containing the generated conclusion."""

    conclusion: str
