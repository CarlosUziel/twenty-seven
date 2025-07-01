"""
API router for generating answers and conclusions using language models.
"""

from fastapi import APIRouter, HTTPException

from app.models import (
    AnswerResponse,
    ConclusionRequest,
    ConclusionResponse,
    QuestionRequest,
)
from config.logger import logger
from lm.utils import generate_answer, generate_conclusion

router = APIRouter(prefix="/generator", tags=["generator"])


def get_answer(req: QuestionRequest) -> AnswerResponse:
    """
    Generate an answer to a philosophical question from a given perspective and model.

    Args:
        req (QuestionRequest): The request body containing the question, perspective, and model name.

    Returns:
        AnswerResponse: The generated answer, perspective, and answer metadata.

    Raises:
        HTTPException: 400 if question or perspective is missing, 500 for internal errors.
    """
    if not req.question or not req.perspective:
        raise HTTPException(
            status_code=400, detail="Question and perspective are required."
        )
    try:
        answer, metadata = generate_answer(req.question, req.perspective, req.model)
        return AnswerResponse(
            perspective=req.perspective, answer=answer, metadata=metadata
        )
    except Exception as exc:
        logger.error(f"Error generating answer: {exc}")
        raise HTTPException(status_code=500, detail="Error generating answer.") from exc


def get_conclusion(req: ConclusionRequest) -> ConclusionResponse:
    """
    Generate a conclusion based on multiple answers and a model.

    Args:
        req (ConclusionRequest): The request body containing a dictionary of answers and the model name.

    Returns:
        ConclusionResponse: The generated conclusion and conclusion metadata.

    Raises:
        HTTPException: 500 for internal errors during conclusion generation.
    """
    try:
        conclusion, metadata = generate_conclusion(req.answers, req.model)
        return ConclusionResponse(conclusion=conclusion, metadata=metadata)
    except Exception as exc:
        logger.error(f"Error generating conclusion: {exc}")
        raise HTTPException(
            status_code=500, detail="Error generating conclusion."
        ) from exc


@router.post("/answer", response_model=AnswerResponse)
def post_answer(req: QuestionRequest) -> AnswerResponse:
    """FastAPI endpoint for generating an answer."""
    return get_answer(req)


@router.post("/conclusion", response_model=ConclusionResponse)
def post_conclusion(req: ConclusionRequest) -> ConclusionResponse:
    """FastAPI endpoint for generating a conclusion."""
    return get_conclusion(req)
