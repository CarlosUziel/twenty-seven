"""
Utility functions for interacting with the Language Model.
"""

import re
import textwrap
from datetime import datetime, timezone
from typing import Callable, Dict, Tuple, Type, TypeVar
from uuid import uuid4

import requests

from twentyseven.app.models import AnswerMetadata, ConclusionMetadata
from twentyseven.config.logger import logger
from twentyseven.config.settings import settings

T = TypeVar("T")


def remove_think_tags(text: str) -> str:
    """
    Remove <think>...</think> tags and their content from the text.

    Args:
        text (str): The input text.

    Returns:
        str: The text with <think> tags and their content removed.
    """
    return re.sub(r"<think>[\s\S]*?</think>", "", text, flags=re.IGNORECASE).strip()


def get_provider_from_model(model_name: str) -> str:
    """
    Determine the provider for a given model name.

    Args:
        model_name (str): The model name to check.

    Returns:
        str: The provider name ('local', 'huggingface', 'openrouter').
    """
    # Check local models
    if model_name in settings.local_models:
        return "local"

    # Check external models (now only openrouter)
    for provider, models in settings.external_models.items():
        if model_name in models:
            return provider

    # If not found, assume local as fallback
    logger.warning(
        f"Model '{model_name}' not found in any provider, defaulting to local"
    )
    return "local"


def _call_local_llm(
    prompt: str, system_message: str, model_name: str, temperature: float
) -> str:
    """
    Call a local LLM via the LM Studio endpoint.

    Args:
        prompt (str): The user prompt.
        system_message (str): The system message for the LLM.
        model_name (str): The model to use.
        temperature (float): The temperature for generation.

    Returns:
        str: The generated content from the LLM.
    """
    url = settings.lm_studio_endpoint
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt},
        ],
        "temperature": temperature,
        "max_tokens": 1024,
    }
    response = requests.post(url, json=payload, headers=headers, timeout=60)
    response.raise_for_status()
    data = response.json()
    print("local_llm", data)
    return data["choices"][0]["message"]["content"]


def _call_openrouter_llm(
    prompt: str, system_message: str, model_name: str, temperature: float
) -> str:
    """
    Call OpenRouter LLM using the OpenRouter API endpoint.

    Args:
        prompt (str): The user prompt.
        system_message (str): The system message for the LLM.
        model_name (str): The model to use.
        temperature (float): The temperature for generation.

    Returns:
        str: The generated content from the LLM.
    """
    url = settings.openrouter_endpoint
    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt},
        ],
        "temperature": temperature,
        "max_tokens": 1024,
    }
    response = requests.post(url, json=payload, headers=headers, timeout=60)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


def _generate_text_with_metadata(
    prompt: str,
    system_message: str,
    model_name: str,
    metadata_class: Type[T],
    prompt_uuid: str,
    temperature: float,
    extract_text_fn: Callable[[str], str],
    logger_prefix: str,
) -> Tuple[str, T]:
    """
    Helper to generate text using LLM and return text with metadata.

    Args:
        prompt (str): The user prompt.
        system_message (str): The system message for the LLM.
        model_name (str): The model to use.
        metadata_class (Type[T]): The metadata class to use for the response.
        prompt_uuid (str): Unique identifier for the prompt.
        temperature (float): The temperature for generation.
        extract_text_fn (Callable[[str], str]): Function to extract/clean the generated text.
        logger_prefix (str): Prefix for logging.

    Returns:
        Tuple[str, T]: The generated text and its metadata.
    """
    provider = get_provider_from_model(model_name)
    try:
        logger.info(
            f"{logger_prefix}: Using model {model_name} from provider {provider}"
        )
        if provider == "local":
            text = _call_local_llm(prompt, system_message, model_name, temperature)
        elif provider == "openrouter":
            if not settings.openrouter_api_key:
                raise ValueError("OpenRouter API key not configured")
            text = _call_openrouter_llm(prompt, system_message, model_name, temperature)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
        text = extract_text_fn(str(text))
        output_tokens = len(text.split())
        metadata = metadata_class(
            **{
                "generation_time": datetime.now(timezone.utc).isoformat() + "Z",
                "model": model_name,
                "provider": provider,
                "output_tokens": output_tokens,
                "temperature": temperature,
                "prompt_uuid": prompt_uuid,
                "extra": {},
            }
        )
        logger.info(f"{logger_prefix}: Successfully generated {output_tokens} tokens")
        return text, metadata
    except Exception as exc:
        logger.error(f"{logger_prefix} failed: {exc}")
        logger.error(f"Model: {model_name}, Provider: {provider}")
        raise RuntimeError(f"{logger_prefix} failed: {exc}") from exc


def generate_answer(
    question: str, perspective: str, model_name: str
) -> Tuple[str, AnswerMetadata]:
    """
    Generate an answer to a question from a specific philosophical perspective, and return answer and metadata.

    Args:
        question (str): The user's question.
        perspective (str): The philosophical text to embody.
        model_name (str): The model to use.

    Returns:
        Tuple[str, AnswerMetadata]: The generated answer and its metadata.

    Raises:
        RuntimeError: If the answer generation fails.
    """
    logger.info(
        f"Generating answer for question: '{question}' "
        f"from perspective: '{perspective}'"
    )
    prompt_uuid = str(uuid4())
    temperature = settings.temperature
    prompt = textwrap.dedent(
        f"""You are answering a life question from the perspective of this specific philosophy:

        Philosophy:
        {perspective}

        Question:
        {question}

        Answer the question by embodying this philosophy completely.
        Write as if you truly believe in this perspective and are giving advice based on these principles.
        Be specific, concise and practical in your guidance. Avoid unnecessary verbosity.
        Ensure your answer is nicely formatted and easy to read.
        Limit your answer to {settings.max_words_answer} words.

        Answer:
        """
    )
    system_message = (
        "You are a wise advisor who answers questions by embodying "
        "specific life philosophies completely."
    )
    return _generate_text_with_metadata(
        prompt=prompt,
        system_message=system_message,
        model_name=model_name,
        metadata_class=AnswerMetadata,
        prompt_uuid=prompt_uuid,
        temperature=temperature,
        extract_text_fn=remove_think_tags,
        logger_prefix="Answer generation",
    )


def generate_conclusion(
    answers: Dict[str, str], model_name: str
) -> Tuple[str, ConclusionMetadata]:
    """
    Generate a conclusion based on multiple answers and a model, and return the conclusion and its metadata.

    Args:
        answers (Dict[str, str]): Dictionary mapping perspective names to answers.
        model_name (str): The model to use.

    Returns:
        Tuple[str, ConclusionMetadata]: The generated conclusion and its metadata.

    Raises:
        RuntimeError: If the conclusion generation fails.
    """
    logger.info(f"Generating conclusion from {len(answers)} answers.")
    prompt_uuid = str(uuid4())
    temperature = settings.temperature
    answers_str = "\n".join(
        [f"- {perspective}: {answer}" for perspective, answer in answers.items()]
    )
    prompt = textwrap.dedent(
        f"""You are a wise advisor who provides a concluding summary of
        different philosophical perspectives on a life question.

        Here are the different perspectives:
        {answers_str}

        Provide a concluding summary of these perspectives.
        The summary should be a cohesive synthesis of the different viewpoints,
        highlighting the key takeaways and common threads.
        Limit your conclusion to {settings.max_words_conclusion} words.

        Conclusion:
        """
    )
    system_message = (
        "You are a wise advisor who provides a concluding summary of "
        "different philosophical perspectives on a life question."
    )
    return _generate_text_with_metadata(
        prompt=prompt,
        system_message=system_message,
        model_name=model_name,
        metadata_class=ConclusionMetadata,
        prompt_uuid=prompt_uuid,
        temperature=temperature,
        extract_text_fn=remove_think_tags,
        logger_prefix="Conclusion generation",
    )
