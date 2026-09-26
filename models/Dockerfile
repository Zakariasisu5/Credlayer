# Build stage: build the local package
FROM python:3.12-slim as builder

WORKDIR /build

# Copy the local project
COPY . .

# Build the wheel for credlayer-ml
RUN pip install build && python -m build --wheel

# Runtime stage
FROM python:3.12-slim

WORKDIR /app

# Copy the built wheel from builder
COPY --from=builder /build/dist/credlayer_ml-*.whl /tmp/

# Install the built wheel plus other dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir /tmp/credlayer_ml-*.whl && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src src

# Run the app
EXPOSE 8001
CMD ["uvicorn", "credlayer_ml.main:app", "--host", "0.0.0.0", "--port", "8001"]

