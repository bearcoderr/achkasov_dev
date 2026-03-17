"""Configuration settings"""
import json
from typing import List
from pydantic import Field, AliasChoices
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""

    # Application
    app_name: str = "Portfolio API"
    environment: str = "development"
    debug: bool = True
    api_port: int = 8000

    # Database - добавьте отдельные поля
    postgres_db: str = "portfolio_db"
    postgres_user: str = "portfolio_user"
    postgres_password: str = "strong_password_here_123"
    postgres_host: str = "postgres"  # Добавьте это поле!
    postgres_port: int = 5432

    # Database URL (формируется автоматически)
    @property
    def database_url(self) -> str:
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"

    # CORS (store raw string, parse in property to avoid JSON decode errors)
    allowed_origins: str = Field(
        default="http://localhost:3000,http://localhost:3001,https://yourdomain.com",
        validation_alias=AliasChoices("CORS_ORIGINS", "ALLOWED_ORIGINS"),
    )

    # Security
    secret_key: str = Field(
        default="your-secret-key-change-in-production",
        validation_alias=AliasChoices("JWT_SECRET_KEY", "SECRET_KEY"),
    )

    # Uploads
    upload_dir: str = "uploads"

    # PgAdmin
    pgadmin_email: str = "admin@admin.com"
    pgadmin_password: str = "admin123"
    pgadmin_port: int = 5050

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"
        env_ignore_empty = True

    @property
    def allowed_origins_list(self) -> List[str]:
        value = (self.allowed_origins or "").strip()
        if not value:
            return []
        if value.startswith("["):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return [str(item).strip() for item in parsed if str(item).strip()]
            except json.JSONDecodeError:
                return []
        return [origin.strip() for origin in value.split(",") if origin.strip()]


settings = Settings()
