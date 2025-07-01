"""
API router for listing available model names from different providers.
"""

from typing import List

from fastapi import APIRouter, HTTPException

from config.logger import logger
from config.settings import settings

router = APIRouter(prefix="/models", tags=["models"])


def list_models(provider: str) -> List[str]:
    """
    List available model names for a given provider.

    Args:
        provider (str): The provider name (e.g., 'local', or 'openrouter').

    Returns:
        List[str]: A list of model names available for the specified provider.

    Raises:
        HTTPException: 400 if the provider is not recognized, 500 for internal errors.
    """
    try:
        if provider == "local":
            return settings.local_models
        elif provider == "openrouter":
            return settings.external_models["openrouter"]
        else:
            valid_providers = ["local", "openrouter"]
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Provider '{provider}' is not recognized. "
                    f"Valid providers are: {valid_providers}."
                ),
            )
    except Exception as exc:
        logger.error(f"Error listing models: {exc}")
        raise HTTPException(status_code=500, detail="Error listing models.") from exc


@router.get("/models", response_model=List[str])
def get_models(provider: str) -> List[str]:
    """FastAPI endpoint for listing models."""
    return list_models(provider)
