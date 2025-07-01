"""
Main FastAPI application entry point for The Council of the Twenty-Seven API.
"""

from fastapi import FastAPI

from .routers.generator_router import router as generator_router
from .routers.models_router import router as models_router
from .routers.perspectives_router import router as perspectives_router
from .routers.system_router import router as system_router

app = FastAPI(title="The Council of the Twenty-Seven API")

app.include_router(generator_router, prefix="/api")
app.include_router(system_router, prefix="/api")
app.include_router(perspectives_router, prefix="/api")
app.include_router(models_router, prefix="/api")
