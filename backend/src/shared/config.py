"""Configuration settings"""
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

    # CORS
    allowed_origins: List[str] = Field(
        default=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://yourdomain.com"
        ],
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

        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str):
            """Parse comma-separated ALLOWED_ORIGINS"""
            if field_name == 'allowed_origins':
                return [origin.strip() for origin in raw_val.split(',')]
            return raw_val


settings = Settings()
