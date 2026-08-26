from fastapi import APIRouter

from credlayer.api.v1.scores import router as scores_router

# v1 endpoint modules register themselves here as they're built.
api_router = APIRouter()
api_router.include_router(scores_router)
