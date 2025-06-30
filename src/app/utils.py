"""
Utility functions for the API application.
"""

from pathlib import Path
from typing import List

from config.logger import logger
from config.settings import settings


def get_perspectives() -> List[str]:
    """
    Get the available philosophical perspectives from the configured directory.

    The function reads the filenames from the directory specified in the
    `perspectives_dir` setting, expecting files with a `.txt` extension that
    contain "summary" in their names. It formats the filenames into titles.

    Returns:
        List[str]: A sorted list of formatted perspective names.

    Raises:
        FileNotFoundError: If the perspectives directory does not exist.
    """
    perspectives_dir = Path(settings.perspectives_dir)
    if not perspectives_dir.exists():
        logger.error(f"Perspectives directory not found: {perspectives_dir}")
        raise FileNotFoundError(f"Directory not found: {perspectives_dir}")
    perspectives = [f.stem for f in perspectives_dir.glob("*.txt") if f.is_file()]
    logger.info(f"Loaded {len(perspectives)} perspectives.")
    formatted = [p.replace("_", " ").title() for p in perspectives]
    return sorted(formatted)
