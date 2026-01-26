from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.shared.config import settings

engine = None
SessionLocal = None


def get_engine():
    global engine
    if engine is None:
        engine = create_engine(
            settings.database_url,
            echo=settings.debug,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
        )
    return engine


def get_session_local():
    global SessionLocal
    if SessionLocal is None:
        SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=get_engine(),
        )
    return SessionLocal


def get_db():
    db = get_session_local()()
    try:
        yield db
    finally:
        db.close()
