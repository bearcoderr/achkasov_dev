from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from src.infrastructure.api.v1.endpoints.page import router as page_router
from src.infrastructure.api.admin.endpoints.sections import router as admin_router
from src.shared.config import settings

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
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(page_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {
        "message": "Portfolio API with Clean Architecture",
        "version": "1.0.0",
        "docs": "/docs"
    }

