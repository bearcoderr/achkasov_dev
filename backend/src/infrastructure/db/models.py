"""SQLAlchemy модели для PostgreSQL - ОБНОВЛЁННАЯ ВЕРСИЯ"""
from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from src.infrastructure.db.base import Base

class LoginRequest(Base):
    """Данные личного кабинета"""
    __tablename__ = "login_admin"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=True, index=True)
    hashed_password = Column(String, nullable=True)


class Hero(Base):
    """Главный экран"""
    __tablename__ = "hero"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(Text, nullable=True)
    cv_url_ru = Column(String(500), nullable=True)
    cv_url_en = Column(String(500), nullable=True)

    # RU Version
    title_ru = Column(String(255), nullable=True)
    subtitle_ru = Column(String(255), nullable=True)
    description_ru = Column(String(500), nullable=True)
    button_ru = Column(String(255), nullable=True)

    # EN Version (ИСПРАВЛЕНО: было _eng, теперь _en)
    title_en = Column(String(255), nullable=True)
    subtitle_en = Column(String(255), nullable=True)  # ← ИЗМЕНЕНО
    description_en = Column(String(500), nullable=True)
    button_en = Column(String(255), nullable=True)  # ← ИЗМЕНЕНО

    social_links = Column(JSON, nullable=True)


class About(Base):
    """Блок обо мне"""
    __tablename__ = "about"

    id = Column(Integer, primary_key=True, index=True)

    # RU Version
    title_ru = Column(String(255), nullable=True)
    description_ru = Column(String(500), nullable=True)

    # EN Version (ИСПРАВЛЕНО: было _eng, теперь _en)
    title_en = Column(String(255), nullable=True)
    description_en = Column(String(500), nullable=True)


class Project(Base):
    """Модель проекта"""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    # RU Version
    title_ru = Column(String(255), nullable=True)
    description_ru = Column(Text, nullable=True)

    # EN Version
    title_en = Column(String(255), nullable=True)
    description_en = Column(Text, nullable=True)

    # Остальные поля
    tech = Column(JSON, nullable=True)  # ["Django", "PostgreSQL", ...]
    demo_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    order = Column(Integer, default=0, nullable=True)  # Порядок отображения
    is_active = Column(Boolean, default=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Service(Base):
    """Модель услуги"""
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)

    # RU Version
    title_ru = Column(String(255), nullable=True)
    description_ru = Column(Text, nullable=True)
    details_ru = Column(JSON, nullable=True)  # Список деталей или текст

    # EN Version
    title_en = Column(String(255), nullable=True)
    description_en = Column(Text, nullable=True)
    details_en = Column(JSON, nullable=True)

    # Остальные поля
    icon = Column(String(100), nullable=True)
    order = Column(Integer, default=0, nullable=True)
    is_active = Column(Boolean, default=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Experience(Base):
    """Модель опыта работы"""
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, index=True)

    # RU Version
    period_ru = Column(String(100), nullable=True)  # Используется как "year" на фронте
    company_ru = Column(String(255), nullable=True)
    position_ru = Column(String(255), nullable=True)
    description_ru = Column(Text, nullable=True)

    # EN Version
    period_en = Column(String(100), nullable=True)
    company_en = Column(String(255), nullable=True)
    position_en = Column(String(255), nullable=True)
    description_en = Column(Text, nullable=True)

    # Остальные поля
    order = Column(Integer, default=0, nullable=True)
    is_active = Column(Boolean, default=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Certificate(Base):
    """Модель сертификата"""
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)

    # RU Version
    title_ru = Column(String(255), nullable=True)
    description_ru = Column(Text, nullable=True)

    # EN Version
    title_en = Column(String(255), nullable=True)
    description_en = Column(Text, nullable=True)

    # Остальные поля
    provider = Column(String(255), nullable=True)
    image_url = Column(String(500), nullable=True)
    issue_date = Column(String(50), nullable=True)
    credential_url = Column(String(500), nullable=True)
    order = Column(Integer, default=0, nullable=True)
    is_active = Column(Boolean, default=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Skills(Base):
    """Навыки по категориям"""
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)

    # RU Version
    title_ru = Column(String(255), nullable=True)
    listSkills_ru = Column(JSON, nullable=True)  # Список навыков

    # EN Version
    title_en = Column(String(255), nullable=True)
    listSkills_en = Column(JSON, nullable=True)


class Personal(Base):
    """Личные факты"""
    __tablename__ = "personal_facts"  # Исправлено: было "Pesonal_Fast"

    id = Column(Integer, primary_key=True, index=True)
    emoji = Column(String(255), nullable=True)

    # RU Version
    title_ru = Column(String(255), nullable=True)
    description_ru = Column(Text, nullable=True)

    # EN Version
    title_en = Column(String(255), nullable=True)
    description_en = Column(Text, nullable=True)

    order = Column(Integer, default=0, nullable=True)
    is_active = Column(Boolean, default=True, nullable=True)


class ContactMessage(Base):
    """Модель сообщения из контактной формы"""
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    message = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False, nullable=True)
    page_source = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Settings(Base):
    """Модель настроек (контакты, футер и т.д.)"""
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=True, index=True)
    value = Column(JSON, nullable=True)  # Хранит весь объект в JSON
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Контактная информация
    email = Column(String(100), nullable=True)
    phone = Column(String(100), nullable=True)

    # RU Version
    location_ru = Column(String(100), nullable=True)
    title_text_footer_ru = Column(String(500), nullable=True)
    desc_text_footer_ru = Column(String(500), nullable=True)
    footer_info_ru = Column(String(500), nullable=True)

    # EN Version
    location_en = Column(String(100), nullable=True)
    title_text_footer_en = Column(String(500), nullable=True)
    desc_text_footer_en = Column(String(500), nullable=True)
    footer_info_en = Column(String(500), nullable=True)


class BlogCategory(Base):
    """Blog categories"""
    __tablename__ = "blog_categories"

    id = Column(Integer, primary_key=True, index=True)
    name_ru = Column(String(255), nullable=True)
    name_en = Column(String(255), nullable=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    order = Column(Integer, default=0, nullable=True)
    is_active = Column(Boolean, default=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class BlogTag(Base):
    """Blog tags"""
    __tablename__ = "blog_tags"

    id = Column(Integer, primary_key=True, index=True)
    name_ru = Column(String(255), nullable=True)
    name_en = Column(String(255), nullable=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class BlogPost(Base):
    """Blog posts"""
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("blog_categories.id"), nullable=True)
    status = Column(String(20), nullable=False, default="draft")
    is_active = Column(Boolean, default=True, nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)

    cover_image_url = Column(String(500), nullable=True)
    og_image_url = Column(String(500), nullable=True)

    title_ru = Column(String(255), nullable=True)
    excerpt_ru = Column(Text, nullable=True)
    content_ru = Column(Text, nullable=True)
    seo_title_ru = Column(String(255), nullable=True)
    seo_description_ru = Column(Text, nullable=True)

    title_en = Column(String(255), nullable=True)
    excerpt_en = Column(Text, nullable=True)
    content_en = Column(Text, nullable=True)
    seo_title_en = Column(String(255), nullable=True)
    seo_description_en = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class BlogPostTag(Base):
    """Post-tag relation"""
    __tablename__ = "blog_post_tags"

    post_id = Column(Integer, ForeignKey("blog_posts.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("blog_tags.id"), primary_key=True)


class BlogComment(Base):
    """Blog comments"""
    __tablename__ = "blog_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("blog_posts.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    reply_message = Column(Text, nullable=True)
    replied_at = Column(DateTime(timezone=True), nullable=True)
    is_approved = Column(Boolean, default=False, nullable=True)
    is_read = Column(Boolean, default=False, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

