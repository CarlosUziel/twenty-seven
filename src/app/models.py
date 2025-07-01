"""
Pydantic models for API requests and responses.
"""

from typing import Dict

from pydantic import BaseModel, Field


class QuestionRequest(BaseModel):
    """
    Request model for submitting a philosophical question and optional perspective and model.

    Attributes:
        question (str): The philosophical question to be answered.
        perspective (str): The philosophical perspective to use for the answer.
        model (str): The model name to use for generation.
    """

    question: str
    perspective: str
    model: str


class AnswerMetadata(BaseModel):
    """
    Metadata for a generated answer.

    Attributes:
        generation_time (str): ISO string of when the answer was generated.
        model (str): The model used for generation.
        provider (str): The provider used for generation (e.g., 'local', 'openrouter').
        output_tokens (int): Number of tokens in the output.
        temperature (float): Temperature used for generation.
        prompt_uuid (str): Unique identifier for the prompt.
        extra (dict): Additional metadata.
    """

    generation_time: str  # ISO string
    model: str
    provider: str
    output_tokens: int
    temperature: float
    prompt_uuid: str
    extra: dict = Field(default_factory=dict)


class AnswerResponse(BaseModel):
    """
    Response model containing the perspective and generated answer.

    Attributes:
        perspective (str): The philosophical perspective used.
        answer (str): The generated answer text.
        metadata (AnswerMetadata): Metadata about the answer generation.
    """

    perspective: str
    answer: str
    metadata: AnswerMetadata


class ConclusionRequest(BaseModel):
    """
    Request model for submitting multiple answers for conclusion generation, with optional model.

    Attributes:
        answers (Dict[str, str]): Dictionary mapping perspective names to answers.
        model (str): The model name to use for generation.
    """

    answers: Dict[str, str]
    model: str


class ConclusionMetadata(BaseModel):
    """
    Metadata for a generated conclusion.

    Attributes:
        generation_time (str): ISO string of when the conclusion was generated.
        model (str): The model used for generation.
        provider (str): The provider used for generation (e.g., 'local', 'openrouter').
        output_tokens (int): Number of tokens in the output.
        temperature (float): Temperature used for generation.
        prompt_uuid (str): Unique identifier for the prompt.
        extra (dict): Additional metadata.
    """

    generation_time: str  # ISO string
    model: str
    provider: str
    output_tokens: int
    temperature: float
    prompt_uuid: str
    extra: dict = Field(default_factory=dict)


class ConclusionResponse(BaseModel):
    """
    Response model containing the generated conclusion and metadata.

    Attributes:
        conclusion (str): The generated conclusion text.
        metadata (ConclusionMetadata): Metadata about the conclusion generation.
    """

    conclusion: str
    metadata: ConclusionMetadata
