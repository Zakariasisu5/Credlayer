from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base for response/request schemas. Frontend types (Frontend/src/types/*.ts)
    are camelCase; this keeps Python fields snake_case while serializing camelCase."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Pagination(CamelModel):
    page: int
    limit: int
    total: int
    total_pages: int
    has_next: bool
    has_prev: bool
