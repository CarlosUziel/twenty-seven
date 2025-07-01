"""
Logger configuration for the application.
"""

import os
import sys

from loguru import logger

# Ensure the .logs directory exists
os.makedirs(".logs", exist_ok=True)

# Remove any existing handlers
logger.remove()
# Add a file handler for app logs
logger.add(
    ".logs/app.txt",
    level="INFO",
    rotation="10 MB",
    retention="10 days",
    encoding="utf-8",
)
# Also log to stderr for development
logger.add(sys.stderr, level="INFO")
