from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from starlette.responses import Response

from src.infrastructure.api.v1.endpoints.page import router as page_router
from src.infrastructure.api.admin.endpoints.sections import router as admin_router
from src.shared.config import settings
from src.shared.cache import get_cached_response, set_cached_response, clear_cache, get_cache_config

app = FastAPI(
    title="Portfolio API",
    version="1.0.0",
    description="Backend API для портфолио с Clean Architecture"
)
upload_dir = Path(settings.upload_dir)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def redis_cache_middleware(request: Request, call_next):
    cache_enabled, _ = get_cache_config()
    if not cache_enabled:
        return await call_next(request)

    path = request.url.path
    if request.method == "GET":
        if path.startswith(("/docs", "/redoc", "/openapi.json", "/uploads")):
            return await call_next(request)

        cached = await get_cached_response(request)
        if cached is not None:
            return cached

        response = await call_next(request)
        body = b""
        async for chunk in response.body_iterator:
            body += chunk

        new_response = Response(
            content=body,
            status_code=response.status_code,
            headers=dict(response.headers),
            media_type=response.media_type,
        )
        new_response.headers["X-Cache"] = "MISS"
        await set_cached_response(request, response, body)
        return new_response

    response = await call_next(request)
    if request.method in {"POST", "PUT", "PATCH", "DELETE"} and response.status_code < 400:
        await clear_cache()
    return response

app.include_router(page_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {
        "message": "Portfolio API with Clean Architecture",
        "version": "1.0.0",
        "docs": "/docs"
    }

