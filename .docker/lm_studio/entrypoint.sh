#!/bin/sh
# Entrypoint script for LM Studio Docker container
# Downloads all models listed in the AVAILABLE_MODELS env variable

set -e

if [ -z "$AVAILABLE_MODELS" ]; then
  echo "No AVAILABLE_MODELS specified in environment. Skipping model download."
else
  IFS=',' read -ra MODELS <<< "$AVAILABLE_MODELS"
  for model in "${MODELS[@]}"; do
    echo "Downloading model: $model"
    lmstudio models download "$model"
  done
fi

exec "$@"
