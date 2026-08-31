from fastapi import APIRouter

from credlayer.api.v1.scores import router as scores_router
from credlayer.api.v1.credentials import router as credentials_router
from credlayer.api.v1.connections import router as connections_router

# v1 endpoint modules register themselves here as they're built.
api_router = APIRouter()
api_router.include_router(scores_router)
api_router.include_router(credentials_router)
api_router.include_router(connections_router)
