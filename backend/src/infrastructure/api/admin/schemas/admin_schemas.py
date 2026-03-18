"""Pydantic схемы для админки (Request/Update DTOs)"""
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class UpdateAboutRequest(BaseModel):
    """Запрос на обновление раздела О себе"""
    title: Dict[str, str]
    text: Dict[str, str]


class CreateProjectRequest(BaseModel):
    """Запрос на создание проекта"""
    title: Dict[str, str]
    description: Dict[str, str]
    tech: List[str]
    demo_url: Optional[str] = None
    github_url: Optional[str] = None


class UpdateProjectRequest(BaseModel):
    """Запрос на обновление проекта"""
    title: Dict[str, str]
    description: Dict[str, str]
    tech: List[str]
    demo_url: Optional[str] = None
    github_url: Optional[str] = None

class SubmissionSchema(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: datetime  # Pydantic сериализует в ISO автоматически
    is_read: bool
    page_source: Optional[str] = None



# ============= SCHEMAS =============


class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str


class AdminCredentialsUpdateRequest(BaseModel):
    current_password: str
    new_password: Optional[str] = None
    new_username: Optional[str] = None

class LocalizedData(BaseModel):
    ru: str
    en: str

# Hero Schemas
class HeroUpdateRequest(BaseModel):
    title: LocalizedData
    subtitle: LocalizedData
    description: LocalizedData
    cta: LocalizedData
    image: str
    cv_url: LocalizedData

class HeroResponse(BaseModel):
    id: int
    title: LocalizedData
    subtitle: LocalizedData
    description: LocalizedData
    cta: LocalizedData
    image: str
    cv_url: LocalizedData

# About Schemas
class AboutUpdateRequest(BaseModel):
    title: LocalizedData
    description: LocalizedData

class AboutResponse(BaseModel):
    id: int
    title: LocalizedData
    description: LocalizedData

# Service Schemas
class ServiceCreateRequest(BaseModel):
    title: LocalizedData
    description: LocalizedData
    details: LocalizedData
    icon: str

class ServiceUpdateRequest(BaseModel):
    title: LocalizedData
    description: LocalizedData
    details: LocalizedData
    icon: str

class ServiceResponse(BaseModel):
    id: int
    title: LocalizedData
    description: LocalizedData
    details: LocalizedData
    icon: str

# Project Schemas
class ProjectCreateRequest(BaseModel):
    title: LocalizedData
    description: LocalizedData
    image: str
    tags: List[str]
    link: str

class ProjectUpdateRequest(BaseModel):
    title: LocalizedData
    description: LocalizedData
    image: str
    tags: List[str]
    link: str

class ProjectResponse(BaseModel):
    id: int
    title: LocalizedData
    description: LocalizedData
    image: str
    tags: List[str]
    link: str

# Experience Schemas
class ExperienceCreateRequest(BaseModel):
    year: str
    company: LocalizedData
    position: LocalizedData
    description: LocalizedData

class ExperienceUpdateRequest(BaseModel):
    year: str
    company: LocalizedData
    position: LocalizedData
    description: LocalizedData

class ExperienceResponse(BaseModel):
    id: int
    year: str
    company: LocalizedData
    position: LocalizedData
    description: LocalizedData

# Skills Schemas
class SkillCategoryCreateRequest(BaseModel):
    name: LocalizedData
    skills: List[str]

class SkillCategoryUpdateRequest(BaseModel):
    name: LocalizedData
    skills: List[str]

class SkillCategoryResponse(BaseModel):
    id: int
    name: LocalizedData
    skills: List[str]

# Certificate Schemas
class CertificateCreateRequest(BaseModel):
    title: LocalizedData
    description: LocalizedData
    provider: str
    image_url: str
    issue_date: str
    credential_url: Optional[str] = None
    order: Optional[int] = None

class CertificateUpdateRequest(BaseModel):
    title: LocalizedData
    description: LocalizedData
    provider: str
    image_url: str
    issue_date: str
    credential_url: Optional[str] = None
    order: Optional[int] = None

class CertificateResponse(BaseModel):
    id: int
    title: LocalizedData
    description: LocalizedData
    provider: str
    image_url: str
    issue_date: str
    credential_url: Optional[str] = None
    order: Optional[int] = None

# Personal Facts Schemas
class PersonalFactCreateRequest(BaseModel):
    emoji: str
    title: LocalizedData
    description: LocalizedData
    order: Optional[int] = None

class PersonalFactUpdateRequest(BaseModel):
    emoji: str
    title: LocalizedData
    description: LocalizedData
    order: Optional[int] = None

class PersonalFactResponse(BaseModel):
    id: int
    emoji: str
    title: LocalizedData
    description: LocalizedData
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Settings Schemas
class SettingsUpdateRequest(BaseModel):
    email: str
    phone: str
    location: LocalizedData
    contact_title: LocalizedData
    contact_description: LocalizedData
    footer_rights: LocalizedData


class SiteSettingsUpdateRequest(BaseModel):
    site_visible: bool = True
    noindex: bool = False
    sitemap_exclude: List[str] = []
    closed_message: Optional[str] = None
    site_title: Optional[str] = None
    site_description: Optional[str] = None
    favicon_light: Optional[str] = None
    favicon_dark: Optional[str] = None
    favicon_svg: Optional[str] = None
    apple_icon: Optional[str] = None
    og_default_image: Optional[str] = None

# Blog Schemas
class BlogCategoryCreateRequest(BaseModel):
    name: LocalizedData
    slug: str
    order: Optional[int] = None
    is_active: Optional[bool] = None

class BlogCategoryUpdateRequest(BaseModel):
    name: LocalizedData
    slug: str
    order: Optional[int] = None
    is_active: Optional[bool] = None

class BlogCategoryResponse(BaseModel):
    id: int
    name: LocalizedData
    slug: str
    order: Optional[int] = None
    is_active: Optional[bool] = None

class BlogTagCreateRequest(BaseModel):
    name: LocalizedData
    slug: str

class BlogTagUpdateRequest(BaseModel):
    name: LocalizedData
    slug: str

class BlogTagResponse(BaseModel):
    id: int
    name: LocalizedData
    slug: str

class BlogPostCreateRequest(BaseModel):
    slug: str
    category_id: Optional[int] = None
    status: Optional[str] = "draft"
    is_active: Optional[bool] = True
    published_at: Optional[datetime] = None
    cover_image_url: Optional[str] = None
    og_image_url: Optional[str] = None
    title: LocalizedData
    excerpt: LocalizedData
    content: LocalizedData
    seo_title: Optional[LocalizedData] = None
    seo_description: Optional[LocalizedData] = None
    tag_ids: List[int] = []

class BlogPostUpdateRequest(BaseModel):
    slug: str
    category_id: Optional[int] = None
    status: Optional[str] = "draft"
    is_active: Optional[bool] = True
    published_at: Optional[datetime] = None
    cover_image_url: Optional[str] = None
    og_image_url: Optional[str] = None
    title: LocalizedData
    excerpt: LocalizedData
    content: LocalizedData
    seo_title: Optional[LocalizedData] = None
    seo_description: Optional[LocalizedData] = None
    tag_ids: List[int] = []

class BlogPostResponse(BaseModel):
    id: int
    slug: str
    category_id: Optional[int] = None
    status: str
    is_active: Optional[bool] = None
    published_at: Optional[datetime] = None
    cover_image_url: Optional[str] = None
    og_image_url: Optional[str] = None
    title: LocalizedData
    excerpt: LocalizedData
    content: LocalizedData
    seo_title: Optional[LocalizedData] = None
    seo_description: Optional[LocalizedData] = None
    tag_ids: List[int]


class BlogCommentResponse(BaseModel):
    id: int
    post_id: int
    post_title: Optional[str] = None
    name: str
    email: Optional[str] = None
    message: str
    reply_message: Optional[str] = None
    replied_at: Optional[datetime] = None
    is_approved: Optional[bool] = None
    is_read: Optional[bool] = None
    created_at: datetime


class BlogCommentReplyRequest(BaseModel):
    message: str
