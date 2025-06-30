"""
Application settings management.
"""

from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings. (Note: 'llm_model' is deprecated; use 'available_models' and pass model name via API request)"""

    lm_studio_endpoint: str = Field(
        default="http://localhost:1234/v1",
        description="Base URL for the local LLM API endpoint.",
    )
    perspectives_dir: str = Field(
        default=str(
            Path(__file__).parent.parent.parent / ".data/how_to_live__sivers/summaries"
        ),
        description="Directory containing philosophical perspective summaries.",
    )
    max_words_answer: int = Field(
        default=512, description="Maximum number of words for a generated answer."
    )
    max_words_conclusion: int = Field(
        default=256, description="Maximum number of words for a generated conclusion."
    )
    available_models: list[str] = Field(
        default=[
            "deepseek/deepseek-r1-0528-qwen3-8b",
            "mistralai/mistral-small-3.2",
            "mistralai/magistral-small",
        ],
        description="List of available LLM model names.",
    )


settings = Settings()
