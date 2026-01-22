"""SQLAlchemy модели для PostgreSQL"""
from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, Boolean
from sqlalchemy.sql import func
from src.infrastructure.db.base import Base

class LoginRequest(Base):
    """Данные личного кабинета"""
    __tablename__ = "login_admin"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)

class Hero(Base):

    """Главный экран"""
    __tablename__ = "hero"
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(500), nullable=False)

    """RU Version"""
    title_ru = Column(String(255), nullable=False)
    subtitle_ru = Column(String(255), nullable=False)
    description_ru = Column(String(500), nullable=False)
    button_ru = Column(String(255), nullable=False)


    """ENG Version"""
    title_en = Column(String(255), nullable=False)
    subtitle_eng = Column(String(255), nullable=False)
    description_eng = Column(String(500), nullable=False)
    button_eng = Column(String(255), nullable=False)

    social_links = Column(JSON, nullable=True)

class About(Base):
    """Блок обо мне"""
    __tablename__ = "about"

    id = Column(Integer, primary_key=True, index=True)

    """RU Version"""
    title_ru = Column(String(255), nullable=False)
    description_ru = Column(String(500), nullable=False)

    """ENG Version"""
    title_en = Column(String(255), nullable=False)
    description_eng = Column(String(500), nullable=False)


class Project(Base):
    """Модель проекта"""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    """RU Version"""
    title_ru = Column(String(255), nullable=False)
    description_ru = Column(Text, nullable=False)

    """ENG Version"""
    title_en = Column(String(255), nullable=False)
    description_en = Column(Text, nullable=False)

    """Last Column"""
    tech = Column(JSON, nullable=False)  # ["Django", "PostgreSQL", ...]
    demo_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    order = Column(Integer, default=0)  # Порядок отображения
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Service(Base):
    """Модель услуги"""
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)

    """RU Version"""
    title_ru = Column(String(255), nullable=False)
    description_ru = Column(Text, nullable=False)
    details_ru = Column(JSON, nullable=False)  # ["Пункт 1", "Пункт 2", ...]

    """ENG Version"""
    title_en = Column(String(255), nullable=False)
    description_en = Column(Text, nullable=False)
    details_en = Column(JSON, nullable=False)

    """Last Column"""
    icon = Column(String(100), nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Experience(Base):
    """Модель опыта работы"""
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, index=True)

    """RU Version"""
    period_ru = Column(String(100), nullable=False)
    position_ru = Column(String(255), nullable=False)
    company_ru = Column(String(255), nullable=False)
    description_ru = Column(Text, nullable=False)

    """ENG Version"""
    period_en = Column(String(100), nullable=False)
    company_en = Column(String(255), nullable=False)
    position_en = Column(String(255), nullable=False)
    description_en = Column(Text, nullable=False)

    """Last Column"""
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Certificate(Base):
    """Модель сертификата"""
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)

    """RU Version"""
    title_ru = Column(String(255), nullable=False)
    provider = Column(String(255), nullable=False)
    description_en = Column(Text, nullable=False)

    """ENG Version"""
    title_en = Column(String(255), nullable=False)
    description_ru = Column(Text, nullable=False)

    """Last Column"""
    image_url = Column(String(500), nullable=False)
    issue_date = Column(String(50), nullable=False)
    credential_url = Column(String(500), nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Skills(Base):
    """Навыки"""
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)

    """RU Version"""
    title_ru = Column(String(255), nullable=False)
    listSkills_ru = Column(JSON, nullable=False)

    """ENG Version"""
    title_en = Column(String(255), nullable=False)
    listSkills_en = Column(JSON, nullable=False)


class ContactMessage(Base):
    """Модель сообщения из контактной формы"""
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    page_source = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Settings(Base):
    """Модель настроек (Hero, About, Contact Info)"""
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(JSON, nullable=False)  # Хранит весь объект в JSON
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())





