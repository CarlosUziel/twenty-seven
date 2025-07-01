# Dockerfile for the FastAPI backend
FROM python:3.12-slim
WORKDIR /app
COPY ../../pyproject.toml ../../uv.lock ./
RUN pip install --upgrade pip && pip install uv
RUN uv pip install --system --no-cache-dir .
COPY ../../src ./src
EXPOSE 8000
CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
