"""
FastAPI-based API for The Council of the Twenty-Seven app.
"""

from typing import List

from fastapi import FastAPI, HTTPException

from app.models import (
    AnswerResponse,
    ConclusionRequest,
    ConclusionResponse,
    QuestionRequest,
)
from app.utils import get_perspectives
from config.logger import logger
from lm.utils import generate_answer, generate_conclusion

app = FastAPI(title="The Council of the Twenty-Seven API")


@app.get("/perspectives", response_model=List[str])
def list_perspectives():
    """Return a list of available philosophical perspectives."""
    try:
        return get_perspectives()
    except Exception as exc:
        logger.error(f"Error loading perspectives: {exc}")
        raise HTTPException(
            status_code=500, detail="Could not load perspectives."
        ) from exc


@app.post("/answer", response_model=AnswerResponse)
def get_answer(req: QuestionRequest):
    """Generate an answer for a question and perspective."""
    if not req.question or not req.perspective:
        raise HTTPException(
            status_code=400, detail="Question and perspective are required."
        )
    try:
        answer, metadata = generate_answer(req.question, req.perspective)
        return AnswerResponse(
            perspective=req.perspective, answer=answer, metadata=metadata
        )
    except Exception as exc:
        logger.error(f"Error generating answer: {exc}")
        raise HTTPException(status_code=500, detail="Error generating answer.") from exc


@app.post("/conclusion", response_model=ConclusionResponse)
def get_conclusion(req: ConclusionRequest):
    """Generate a conclusion from multiple answers."""
    try:
        conclusion = generate_conclusion(req.answers)
        return ConclusionResponse(conclusion=conclusion)
    except Exception as exc:
        logger.error(f"Error generating conclusion: {exc}")
        raise HTTPException(
            status_code=500, detail="Error generating conclusion."
        ) from exc
