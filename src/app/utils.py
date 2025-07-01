"""
Utility functions for the API application.
"""

from pathlib import Path
from typing import Dict

from config.logger import logger
from config.settings import settings


def get_perspectives() -> Dict[str, str]:
    """
    Get the available philosophical perspectives and their summaries from the configured directory.

    Reads all .txt files in the perspectives_dir, using the filename (without extension) as the perspective name
    and the file content as the summary.

    Returns:
        Dict[str, str]: A dictionary mapping perspective names (title-cased) to their summaries.

    Raises:
        FileNotFoundError: If the perspectives directory does not exist.
    """
    perspectives_dir = Path(settings.perspectives_dir)
    if not perspectives_dir.exists():
        logger.error(f"Perspectives directory not found: {perspectives_dir}")
        raise FileNotFoundError(f"Directory not found: {perspectives_dir}")
    perspectives = {}
    for f in perspectives_dir.glob("*.txt"):
        if f.is_file():
            name = f.stem.replace("_", " ").title()
            try:
                summary = f.read_text(encoding="utf-8").strip()
            except (IOError, OSError, UnicodeDecodeError) as e:
                logger.error(f"Failed to read summary for {name}: {e}")
                summary = "No summary available."
            perspectives[name] = summary
    logger.info(f"Loaded {len(perspectives)} perspectives.")
    return dict(sorted(perspectives.items()))
