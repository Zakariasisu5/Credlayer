from typing import Any


class CredLayerError(Exception):
    """Base class for domain errors that map directly to the API error envelope."""

    code: str = "INTERNAL_ERROR"
    status_code: int = 500

    def __init__(self, message: str, *, details: dict[str, Any] | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.details = details


class NotFoundError(CredLayerError):
    code = "NOT_FOUND"
    status_code = 404


class ValidationFailedError(CredLayerError):
    code = "VALIDATION_ERROR"
    status_code = 422


class RateLimitedError(CredLayerError):
    code = "RATE_LIMITED"
    status_code = 429
