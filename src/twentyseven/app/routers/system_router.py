"""
API router for system health and configuration checks.
"""

import requests
from fastapi import APIRouter

from twentyseven.config.settings import settings

router = APIRouter(prefix="/system", tags=["system"])


@router.get("/check-local-instance")
def get_check_local_instance() -> dict:
    """FastAPI endpoint for checking local LM Studio instance."""
    try:
        resp = requests.get(settings.lm_studio_endpoint, timeout=2)
        if resp.status_code == 200:
            return {"available": True}
        return {"available": False, "status_code": resp.status_code}
    except requests.RequestException:
        return {"available": False}


@router.get("/check-api-keys")
def get_check_api_keys() -> dict:
    """FastAPI endpoint for checking API keys."""
    return {
        "openrouter": bool(settings.openrouter_api_key),
    }
