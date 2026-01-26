from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.infrastructure.api.v1.endpoints.page import router as page_router
from src.infrastructure.api.admin.endpoints.sections import router as admin_router

app = FastAPI(
    title="Portfolio API",
    version="1.0.0",
    description="Backend API для портфолио с Clean Architecture"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],  # из ENV
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

