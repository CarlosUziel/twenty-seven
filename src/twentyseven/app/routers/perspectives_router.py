"""
API router for retrieving available philosophical perspectives.
"""

from typing import Dict

from fastapi import APIRouter, HTTPException

from twentyseven.app.utils import get_perspectives
from twentyseven.config.logger import logger

router = APIRouter(prefix="/perspectives", tags=["perspectives"])


def get_perspectives_endpoint() -> Dict[str, str]:
    """
    Retrieve the available philosophical perspectives.

    Returns:
        Dict[str, str]: A dictionary mapping perspective keys to their descriptions.

    Raises:
        HTTPException: 500 if perspectives cannot be loaded.
    """
    try:
        return get_perspectives()
    except Exception as exc:
        logger.error(f"Error loading perspectives: {exc}")
        raise HTTPException(
            status_code=500, detail="Could not load perspectives."
        ) from exc


@router.get("/perspectives", response_model=Dict[str, str])
def get_perspectives_route() -> Dict[str, str]:
    """FastAPI endpoint for retrieving perspectives."""
    return get_perspectives_endpoint()
