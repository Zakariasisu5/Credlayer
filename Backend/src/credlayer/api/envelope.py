from datetime import UTC, datetime
from typing import Generic, TypeVar

from pydantic import BaseModel

from credlayer.schemas.common import CamelModel, Pagination

T = TypeVar("T")


def _now_iso() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


class Envelope(BaseModel, Generic[T]):
    success: bool = True
    data: T
    message: str | None = None
    timestamp: str


class PagedEnvelope(BaseModel, Generic[T]):
    success: bool = True
    data: list[T]
    pagination: Pagination
    timestamp: str


class ErrorDetail(CamelModel):
    code: str
    message: str
    details: dict | None = None
    status_code: int


class ErrorEnvelope(BaseModel):
    success: bool = False
    error: ErrorDetail
    timestamp: str


def ok(data: T, message: str | None = None) -> Envelope[T]:
    return Envelope(data=data, message=message, timestamp=_now_iso())


def paginated(items: list[T], pagination: Pagination) -> PagedEnvelope[T]:
    return PagedEnvelope(data=items, pagination=pagination, timestamp=_now_iso())


def error_envelope(
    code: str, message: str, status_code: int, details: dict | None = None
) -> ErrorEnvelope:
    return ErrorEnvelope(
        error=ErrorDetail(code=code, message=message, status_code=status_code, details=details),
        timestamp=_now_iso(),
    )
