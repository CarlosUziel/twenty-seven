"""
Application settings management.
"""

from pathlib import Path
from typing import Dict, List, Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def get_project_root() -> Path:
    """Get the project root directory by looking for pyproject.toml."""
    current_path = Path(__file__).resolve()
    for parent in current_path.parents:
        if (parent / "pyproject.toml").exists():
            return parent
    # Fallback to the directory three levels up from this file
    return Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    """App settings. (Note: 'llm_model' is deprecated; use 'available_models' and pass model name via API request)"""

    lm_studio_endpoint: str = Field(
        default="http://localhost:1234/v1/chat/completions",
        description="Base URL for the local LLM API endpoint.",
    )
    openrouter_endpoint: str = Field(
        default="https://openrouter.ai/api/v1/chat/completions",
        description="Base URL for OpenRouter API endpoint.",
    )
    perspectives_dir: str = Field(
        default=".data/how_to_live__sivers/summaries",
        description="Directory containing philosophical perspective summaries (relative to project root).",
    )

    @field_validator("perspectives_dir")
    @classmethod
    def resolve_perspectives_dir(cls, v: str) -> str:
        """Resolve perspectives_dir to be absolute path from project root."""
        path = Path(v)
        if path.is_absolute():
            return str(path)

        # If relative, resolve from project root
        project_root = get_project_root()
        resolved_path = project_root / path
        return str(resolved_path)

    max_words_answer: int = Field(
        default=512, description="Maximum number of words for a generated answer."
    )
    max_words_conclusion: int = Field(
        default=256, description="Maximum number of words for a generated conclusion."
    )
    openrouter_api_key: Optional[str] = Field(
        default=None,
        description="API key for OpenRouter API. Required for external model integration.",
    )
    local_models: List[str] = Field(
        default_factory=lambda: [
            "deepseek/deepseek-r1-0528-qwen3-8b",
            "mistralai/mistral-small-3.2",
            "mistralai/magistral-small",
        ],
        description="List of locally available LLM model names.",
    )
    temperature: float = Field(
        default=0.7,
        description="Default temperature for LLM generation (controls randomness).",
    )

    @property
    def external_models(self) -> Dict[str, List[str]]:
        """Get external models from environment variables or defaults. Only openrouter now."""
        models = {}

        # Parse OpenRouter models from environment variable
        # Force reload environment variables in case they weren't loaded initially
        import os

        from dotenv import load_dotenv

        load_dotenv(str(get_project_root() / ".env"))

        or_models_str = os.getenv("OPENROUTER_MODELS")
        if or_models_str:
            models["openrouter"] = [
                model.strip() for model in or_models_str.split(",") if model.strip()
            ]
        else:
            models["openrouter"] = ["gpt-3.5-turbo", "gpt-4"]

        return models

    model_config = SettingsConfigDict(
        env_file=str(get_project_root() / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
