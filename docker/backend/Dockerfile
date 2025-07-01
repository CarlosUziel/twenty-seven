# Dockerfile for the FastAPI backend

FROM python:3.12-slim
WORKDIR /app

# Copy project files first (needed for uv sync)
COPY ../../pyproject.toml ../../uv.lock ../../README.md ./

# Install dependencies
RUN pip install --upgrade pip && pip install uv

# Copy the source code (needed for the package build)
COPY ../../src ./src

# Now sync and install the package
RUN uv sync

# Copy data
RUN mkdir -p .data/how_to_live__sivers/summaries
COPY ../../.data/how_to_live__sivers/summaries ./.data/how_to_live__sivers/summaries

# Copy .env file
COPY ../../.env ./

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "twentyseven.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
