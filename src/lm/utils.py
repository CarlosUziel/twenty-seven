"""
Utility functions for interacting with the Language Model.
"""

import re
import textwrap
from datetime import datetime
from typing import Dict, Tuple
from uuid import uuid4

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import SecretStr

from app.models import AnswerMetadata
from config.logger import logger
from config.settings import settings


def remove_think_tags(text: str) -> str:
    """Remove <think>...</think> tags and their content from the text."""
    return re.sub(r"<think>[\s\S]*?</think>", "", text, flags=re.IGNORECASE).strip()


def get_llm() -> ChatOpenAI:
    """
    Get the custom LLM instance for generating answers.

    Returns:
        ChatOpenAI: An instance of the OpenAI-compatible LLM client.
    """
    return ChatOpenAI(
        base_url=settings.lm_studio_endpoint,
        model=settings.llm_model,
        api_key=SecretStr("not-needed"),
    )


def generate_answer(question: str, perspective: str) -> Tuple[str, AnswerMetadata]:
    """
    Generate an answer to a question from a specific philosophical perspective, and return answer and metadata.

    Args:
        question (str): The user's question.
        perspective (str): The philosophical text to embody.

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
    temperature = 0.7  # Or get from settings/config if needed
    model = settings.llm_model
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
    messages = [
        SystemMessage(
            content="You are a wise advisor who answers questions by embodying "
            "specific life philosophies completely."
        ),
        HumanMessage(content=prompt),
    ]
    try:
        llm = get_llm()
        response = llm.invoke(messages)
        answer = remove_think_tags(str(response.content))
        output_tokens = getattr(response, "usage", {}).get("completion_tokens", None)
        if output_tokens is None:
            output_tokens = len(answer.split())
        metadata = AnswerMetadata(
            generationTime=datetime.utcnow().isoformat() + "Z",
            model=model,
            outputTokens=output_tokens,
            temperature=temperature,
            promptUUID=prompt_uuid,
            extra={},
        )
        return answer, metadata
    except Exception as exc:
        logger.error(f"Failed to generate answer: {exc}")
        raise RuntimeError(f"Failed to generate answer: {exc}") from exc


def generate_conclusion(answers: Dict[str, str]) -> str:
    """
    Generate a concluding summary of different answers.

    Args:
        answers (Dict[str, str]): A dictionary of answers, with perspective
            names as keys.

    Returns:
        str: The generated conclusion.

    Raises:
        RuntimeError: If the conclusion generation fails.
    """
    logger.info(f"Generating conclusion for {len(answers)} answers.")
    answers_str = "\\n".join(
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
    messages = [
        SystemMessage(
            content="You are a wise advisor who provides a concluding summary of "
            "different philosophical perspectives on a life question."
        ),
        HumanMessage(content=prompt),
    ]
    try:
        llm = get_llm()
        response = llm.invoke(messages)
        return remove_think_tags(str(response.content))
    except Exception as exc:
        logger.error(f"Failed to generate conclusion: {exc}")
        raise RuntimeError(f"Failed to generate conclusion: {exc}") from exc
