# (PUT /about, POST /projects)
"""API endpoints для админки (protected)"""
from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy import or_
from typing import List, Optional
import jwt
import datetime
from passlib.context import CryptContext
from pathlib import Path
import os
import uuid
import shutil
from PIL import Image

from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import (
    LoginRequest as LoginRequestModel,
    Hero, About, Service, Project,
    Experience, Skills, Personal, Certificate,
    ContactMessage, Settings,
    BlogCategory, BlogTag, BlogPost, BlogPostTag, BlogComment
)

from src.infrastructure.api.admin.schemas.admin_schemas import (
    LoginRequest, LoginResponse,
    AdminCredentialsUpdateRequest,
    HeroUpdateRequest, HeroResponse,
    AboutUpdateRequest, AboutResponse,
    ServiceCreateRequest, ServiceUpdateRequest, ServiceResponse,
    ProjectCreateRequest, ProjectUpdateRequest, ProjectResponse,
    ExperienceCreateRequest, ExperienceUpdateRequest, ExperienceResponse,
    SkillCategoryCreateRequest, SkillCategoryUpdateRequest, SkillCategoryResponse,
    CertificateCreateRequest, CertificateUpdateRequest, CertificateResponse,
    PersonalFactCreateRequest, PersonalFactUpdateRequest, PersonalFactResponse,
    SettingsUpdateRequest, SiteSettingsUpdateRequest,
    BlogCategoryCreateRequest, BlogCategoryUpdateRequest, BlogCategoryResponse,
    BlogTagCreateRequest, BlogTagUpdateRequest, BlogTagResponse,
    BlogPostCreateRequest, BlogPostUpdateRequest, BlogPostResponse,
    BlogCommentResponse, BlogCommentReplyRequest
)
from src.shared.config import settings
from src.shared.cache import clear_cache, get_cache_status

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
ALGORITHM = "HS256"

router = APIRouter(prefix="/admin", tags=["Admin"])

import logging

logger = logging.getLogger(__name__)

PROJECTS_UPLOAD_DIR = Path(settings.upload_dir) / "projects"
CERTIFICATES_UPLOAD_DIR = Path(settings.upload_dir) / "certificates"
BLOG_UPLOAD_DIR = Path(settings.upload_dir) / "blog"
BLOG_UPLOAD_DIR = Path(settings.upload_dir) / "blog"
RESUME_UPLOAD_DIR = Path(settings.upload_dir) / "resume"
SITE_UPLOAD_DIR = Path(settings.upload_dir) / "site"
HERO_UPLOAD_DIR = Path(settings.upload_dir) / "hero"

for _dir in [PROJECTS_UPLOAD_DIR, CERTIFICATES_UPLOAD_DIR, BLOG_UPLOAD_DIR, RESUME_UPLOAD_DIR, SITE_UPLOAD_DIR, HERO_UPLOAD_DIR]:
    _dir.mkdir(parents=True, exist_ok=True)

def localized(ru_value: Optional[str], en_value: Optional[str]) -> dict:
    """Normalize localized fields to always be strings."""
    return {"ru": ru_value or "", "en": en_value or ""}


def localized_list(ru_value: Optional[list], en_value: Optional[list]) -> dict:
    """Normalize localized list fields to always be lists."""
    return {"ru": ru_value or [], "en": en_value or []}


def get_site_settings(settings: Settings) -> dict:
    value = settings.value if isinstance(settings.value, dict) else {}
    site = value.get("site_settings") if isinstance(value, dict) else {}
    return {
        "site_visible": site.get("site_visible", True),
        "noindex": site.get("noindex", False),
        "sitemap_exclude": site.get("sitemap_exclude", []),
        "closed_message": site.get("closed_message", None),
        "site_title": site.get("site_title", None),
        "site_description": site.get("site_description", None),
        "favicon_light": site.get("favicon_light", None),
        "favicon_dark": site.get("favicon_dark", None),
        "favicon_svg": site.get("favicon_svg", None),
        "apple_icon": site.get("apple_icon", None),
        "og_default_image": site.get("og_default_image", None),
        "cache_enabled": site.get("cache_enabled", None),
        "cache_ttl_seconds": site.get("cache_ttl_seconds", None),
    }

def details_to_admin(value: Optional[object]) -> str:
    """Convert stored details (list or str) to admin textarea string."""
    if value is None:
        return ""
    if isinstance(value, list):
        return "\n".join([str(item) for item in value if item is not None])
    return str(value)


def details_to_storage(value: Optional[object]) -> list:
    """Convert admin textarea string to list for storage."""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    text = str(value)
    if not text.strip():
        return []
    return [line.strip() for line in text.splitlines() if line.strip()]

def save_uploaded_file(file: UploadFile, target_dir: Path, convert_to_webp: bool = True) -> dict:
    """Save uploaded file and return public URLs (original + webp)."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is required")

    target_dir.mkdir(parents=True, exist_ok=True)
    suffix = Path(file.filename).suffix.lower()
    filename = f"{uuid.uuid4().hex}{suffix}"
    file_path = target_dir / filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    original_url = f"/uploads/{target_dir.name}/{filename}"
    webp_url = None

    if convert_to_webp and suffix not in {".svg", ".ico"}:
        try:
            img = Image.open(file_path)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            webp_name = f"{file_path.stem}.webp"
            webp_path = file_path.with_name(webp_name)
            img.save(webp_path, format="WEBP", quality=85, method=6)
            webp_url = f"/uploads/{target_dir.name}/{webp_name}"
        except Exception:
            webp_url = None

    return {"url": original_url, "webp_url": webp_url}


def _build_media_usage_map(db: Session, paths: List[str]) -> dict:
    usage = {path: [] for path in paths}
    needles = {path: f"/uploads/{path}" for path in paths}

    def record(path: str, model: str, field: str, record_id: int):
        usage[path].append({"model": model, "field": field, "id": record_id})

    def match_value(value: Optional[str], model: str, field: str, record_id: int):
        if not value:
            return
        for path, needle in needles.items():
            if needle in value:
                record(path, model, field, record_id)

    hero = db.query(Hero).first()
    if hero:
        match_value(hero.image_url, "hero", "image_url", hero.id)

    for project in db.query(Project).all():
        match_value(project.image_url, "projects", "image_url", project.id)

    for cert in db.query(Certificate).all():
        match_value(cert.image_url, "certificates", "image_url", cert.id)

    for post in db.query(BlogPost).all():
        match_value(post.cover_image_url, "blog_posts", "cover_image_url", post.id)
        match_value(post.og_image_url, "blog_posts", "og_image_url", post.id)
        match_value(post.content_ru, "blog_posts", "content_ru", post.id)
        match_value(post.content_en, "blog_posts", "content_en", post.id)

    settings_row = db.query(Settings).first()
    if settings_row and isinstance(settings_row.value, dict):
        site = settings_row.value.get("site_settings", {}) if isinstance(settings_row.value, dict) else {}
        for field in ["favicon_light", "favicon_dark", "favicon_svg", "apple_icon", "og_default_image"]:
            match_value(site.get(field), "settings", field, settings_row.id)

    return usage


def get_secret_key() -> str:
    """Resolve JWT secret key from settings with safe dev fallback."""
    secret_key = settings.secret_key
    if not secret_key:
        if settings.environment.lower() != "production":
            logger.warning("JWT secret key is not set; using empty value in non-production.")
            return ""
        raise RuntimeError("JWT_SECRET_KEY is required in production")

    if secret_key == "your-secret-key-change-in-production":
        if settings.environment.lower() != "production":
            logger.warning("JWT secret key is using the default placeholder in non-production.")
            return secret_key
        raise RuntimeError("JWT_SECRET_KEY is required in production")

    return secret_key


# ============= AUTH HELPERS =============

def verify_token(authorization: str = Header(None)) -> dict:
    """Проверка JWT токена"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, get_secret_key(), algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ============= AUTH ENDPOINT =============

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Авторизация администратора"""
    user = db.query(LoginRequestModel).filter(
        LoginRequestModel.username == req.username
    ).first()

    if not user or not pwd_context.verify(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    payload = {
        "sub": user.username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, get_secret_key(), algorithm=ALGORITHM)

    return {"token": token}


@router.put("/credentials", response_model=LoginResponse)
def update_credentials(
        request: AdminCredentialsUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Update admin username and/or password."""
    current_user = db.query(LoginRequestModel).filter(LoginRequestModel.username == user.get("sub")).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(request.current_password, current_user.hashed_password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    if request.new_username:
        existing = db.query(LoginRequestModel).filter(LoginRequestModel.username == request.new_username).first()
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=400, detail="Username already exists")
        current_user.username = request.new_username

    if request.new_password:
        current_user.hashed_password = pwd_context.hash(request.new_password)

    db.commit()
    db.refresh(current_user)

    payload = {
        "sub": current_user.username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, get_secret_key(), algorithm=ALGORITHM)
    return {"token": token}


# ============= HERO ENDPOINTS =============

@router.get("/hero", response_model=HeroResponse)
def get_hero_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Получить Hero данные для админки"""
    hero = db.query(Hero).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero data not found")

    return {
        "id": hero.id,
        "title": {"ru": hero.title_ru, "en": hero.title_en},
        "subtitle": {"ru": hero.subtitle_ru, "en": hero.subtitle_en},
        "description": {"ru": hero.description_ru, "en": hero.description_en},
        "cta": {"ru": hero.button_ru, "en": hero.button_en},
        "image": hero.image_url,
        "cv_url": {"ru": hero.cv_url_ru or "", "en": hero.cv_url_en or ""}
    }


@router.put("/hero", response_model=HeroResponse)
def update_hero(
        request: HeroUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить Hero секцию"""
    hero = db.query(Hero).first()

    if not hero:
        # Создаём если не существует
        hero = Hero(
            title_ru=request.title.ru,
            title_en=request.title.en,
            subtitle_ru=request.subtitle.ru,
            subtitle_en=request.subtitle.en,
            description_ru=request.description.ru,
            description_en=request.description.en,
            button_ru=request.cta.ru,
            button_en=request.cta.en,
            image_url=request.image,
            cv_url_ru=request.cv_url.ru,
            cv_url_en=request.cv_url.en
        )
        db.add(hero)
    else:
        # Обновляем существующий
        hero.title_ru = request.title.ru
        hero.title_en = request.title.en
        hero.subtitle_ru = request.subtitle.ru
        hero.subtitle_en = request.subtitle.en
        hero.description_ru = request.description.ru
        hero.description_en = request.description.en
        hero.button_ru = request.cta.ru
        hero.button_en = request.cta.en
        hero.image_url = request.image
        hero.cv_url_ru = request.cv_url.ru
        hero.cv_url_en = request.cv_url.en

    db.commit()
    db.refresh(hero)

    return {
        "id": hero.id,
        "title": {"ru": hero.title_ru, "en": hero.title_en},
        "subtitle": {"ru": hero.subtitle_ru, "en": hero.subtitle_en},
        "description": {"ru": hero.description_ru, "en": hero.description_en},
        "cta": {"ru": hero.button_ru, "en": hero.button_en},
        "image": hero.image_url,
        "cv_url": {"ru": hero.cv_url_ru or "", "en": hero.cv_url_en or ""}
    }


# ============= ABOUT ENDPOINTS =============

@router.get("/about", response_model=AboutResponse)
def get_about_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Получить About данные для админки"""
    about = db.query(About).first()
    if not about:
        raise HTTPException(status_code=404, detail="About data not found")

    return {
        "id": about.id,
        "title": localized(about.title_ru, about.title_en),
        "description": localized(about.description_ru, about.description_en)
    }


@router.put("/about", response_model=AboutResponse)
def update_about(
        request: AboutUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить About секцию"""
    about = db.query(About).first()

    if not about:
        about = About(
            title_ru=request.title.ru,
            title_en=request.title.en,
            description_ru=request.description.ru,
            description_en=request.description.en
        )
        db.add(about)
    else:
        about.title_ru = request.title.ru
        about.title_en = request.title.en
        about.description_ru = request.description.ru
        about.description_en = request.description.en

    db.commit()
    db.refresh(about)

    return {
        "id": about.id,
        "title": localized(about.title_ru, about.title_en),
        "description": localized(about.description_ru, about.description_en)
    }


# ============= SERVICES ENDPOINTS =============

@router.get("/services", response_model=List[ServiceResponse])
def get_services_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Получить все услуги для админки"""
    services = db.query(Service).filter(Service.is_active == True).order_by(Service.order).all()

    return [{
        "id": s.id,
        "title": localized(s.title_ru, s.title_en),
        "description": localized(s.description_ru, s.description_en),
        "details": {
            "ru": details_to_admin(s.details_ru),
            "en": details_to_admin(s.details_en),
        },
        "icon": s.icon or "🚀"
    } for s in services]


@router.post("/services", response_model=ServiceResponse)
def create_service(
        request: ServiceCreateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Создать новую услугу"""
    # Получаем максимальный order
    max_order = db.query(Service).count()

    service = Service(
        title_ru=request.title.ru,
        title_en=request.title.en,
        description_ru=request.description.ru,
        description_en=request.description.en,
        details_ru=details_to_storage(request.details.ru),
        details_en=details_to_storage(request.details.en),
        icon=request.icon,
        order=max_order,
        is_active=True
    )

    db.add(service)
    db.commit()
    db.refresh(service)

    return {
        "id": service.id,
        "title": localized(service.title_ru, service.title_en),
        "description": localized(service.description_ru, service.description_en),
        "details": {
            "ru": details_to_admin(service.details_ru),
            "en": details_to_admin(service.details_en),
        },
        "icon": service.icon
    }


@router.put("/services/{service_id}", response_model=ServiceResponse)
def update_service(
        service_id: int,
        request: ServiceUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить услугу"""
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    service.title_ru = request.title.ru
    service.title_en = request.title.en
    service.description_ru = request.description.ru
    service.description_en = request.description.en
    service.details_ru = details_to_storage(request.details.ru)
    service.details_en = details_to_storage(request.details.en)
    service.icon = request.icon

    db.commit()
    db.refresh(service)

    return {
        "id": service.id,
        "title": localized(service.title_ru, service.title_en),
        "description": localized(service.description_ru, service.description_en),
        "details": {
            "ru": details_to_admin(service.details_ru),
            "en": details_to_admin(service.details_en),
        },
        "icon": service.icon
    }


@router.delete("/services/{service_id}")
def delete_service(
        service_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Удалить услугу (soft delete)"""
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    service.is_active = False
    db.commit()

    return {"success": True, "message": "Service deleted"}


# ============= PROJECTS ENDPOINTS =============

@router.post("/projects/upload-image")
def upload_project_image(
        file: UploadFile = File(...),
        user: dict = Depends(verify_token)
):
    """Upload project image and return public URL."""
    result = save_uploaded_file(file, PROJECTS_UPLOAD_DIR, convert_to_webp=True)
    return result


@router.post("/hero/upload-resume")
def upload_resume(
        lang: str,
        file: UploadFile = File(...),
        user: dict = Depends(verify_token)
):
    """Upload resume file for specific language and return public URL."""
    lang_value = (lang or "").lower()
    if lang_value not in {"ru", "en"}:
        raise HTTPException(status_code=400, detail="Invalid lang. Use ru or en.")
    result = save_uploaded_file(file, RESUME_UPLOAD_DIR, convert_to_webp=False)
    return {"url": result.get("url"), "webp_url": result.get("webp_url"), "lang": lang_value}


@router.post("/hero/upload-image")
def upload_hero_image(
        file: UploadFile = File(...),
        user: dict = Depends(verify_token)
):
    """Upload hero image and return public URL (original + webp)."""
    return save_uploaded_file(file, HERO_UPLOAD_DIR, convert_to_webp=True)


@router.get("/projects", response_model=List[ProjectResponse])
def get_projects_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Получить все проекты для админки"""
    projects = db.query(Project).filter(Project.is_active == True).order_by(Project.order).all()

    return [{
        "id": p.id,
        "title": {"ru": p.title_ru, "en": p.title_en},
        "description": {"ru": p.description_ru, "en": p.description_en},
        "image": p.image_url or "",
        "tags": p.tech or [],
        "link": p.demo_url or ""
    } for p in projects]


@router.post("/projects", response_model=ProjectResponse)
def create_project(
        request: ProjectCreateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Создать новый проект"""
    max_order = db.query(Project).count()

    project = Project(
        title_ru=request.title.ru,
        title_en=request.title.en,
        description_ru=request.description.ru,
        description_en=request.description.en,
        image_url=request.image,
        tech=request.tags,
        demo_url=request.link,
        order=max_order,
        is_active=True
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return {
        "id": project.id,
        "title": {"ru": project.title_ru, "en": project.title_en},
        "description": {"ru": project.description_ru, "en": project.description_en},
        "image": project.image_url,
        "tags": project.tech,
        "link": project.demo_url
    }


@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
        project_id: int,
        request: ProjectUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить проект"""
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.title_ru = request.title.ru
    project.title_en = request.title.en
    project.description_ru = request.description.ru
    project.description_en = request.description.en
    project.image_url = request.image
    project.tech = request.tags
    project.demo_url = request.link

    db.commit()
    db.refresh(project)

    return {
        "id": project.id,
        "title": {"ru": project.title_ru, "en": project.title_en},
        "description": {"ru": project.description_ru, "en": project.description_en},
        "image": project.image_url,
        "tags": project.tech,
        "link": project.demo_url
    }


@router.delete("/projects/{project_id}")
def delete_project(
        project_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Удалить проект"""
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.is_active = False
    db.commit()

    return {"success": True, "message": "Project deleted"}


# ============= EXPERIENCE ENDPOINTS =============

@router.get("/experience", response_model=List[ExperienceResponse])
def get_experience_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Получить весь опыт работы для админки"""
    experiences = db.query(Experience).filter(
        or_(Experience.is_active == True, Experience.is_active.is_(None))
    ).order_by(Experience.order).all()

    return [{
        "id": e.id,
        "year": e.period_ru or "",  # используем period_ru как год
        "company": localized(e.company_ru, e.company_en),
        "position": localized(e.position_ru, e.position_en),
        "description": localized(e.description_ru, e.description_en)
    } for e in experiences]


@router.post("/experience", response_model=ExperienceResponse)
def create_experience(
        request: ExperienceCreateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Создать новый опыт работы"""
    max_order = db.query(Experience).count()

    experience = Experience(
        period_ru=request.year,
        period_en=request.year,  # копируем year для обеих локалей
        company_ru=request.company.ru,
        company_en=request.company.en,
        position_ru=request.position.ru,
        position_en=request.position.en,
        description_ru=request.description.ru,
        description_en=request.description.en,
        order=max_order,
        is_active=True
    )

    db.add(experience)
    db.commit()
    db.refresh(experience)

    return {
        "id": experience.id,
        "year": experience.period_ru,
        "company": localized(experience.company_ru, experience.company_en),
        "position": localized(experience.position_ru, experience.position_en),
        "description": localized(experience.description_ru, experience.description_en)
    }


@router.put("/experience/{experience_id}", response_model=ExperienceResponse)
def update_experience(
        experience_id: int,
        request: ExperienceUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить опыт работы"""
    experience = db.query(Experience).filter(Experience.id == experience_id).first()

    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")

    experience.period_ru = request.year
    experience.period_en = request.year
    experience.company_ru = request.company.ru
    experience.company_en = request.company.en
    experience.position_ru = request.position.ru
    experience.position_en = request.position.en
    experience.description_ru = request.description.ru
    experience.description_en = request.description.en

    db.commit()
    db.refresh(experience)

    return {
        "id": experience.id,
        "year": experience.period_ru,
        "company": localized(experience.company_ru, experience.company_en),
        "position": localized(experience.position_ru, experience.position_en),
        "description": localized(experience.description_ru, experience.description_en)
    }


@router.delete("/experience/{experience_id}")
def delete_experience(
        experience_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Удалить опыт работы"""
    experience = db.query(Experience).filter(Experience.id == experience_id).first()

    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")

    experience.is_active = False
    db.commit()

    return {"success": True, "message": "Experience deleted"}


# ============= SKILLS ENDPOINTS =============

@router.get("/skills", response_model=List[SkillCategoryResponse])
def get_skills_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Получить все категории навыков для админки"""
    skills = db.query(Skills).all()

    return [{
        "id": s.id,
        "name": localized(s.title_ru, s.title_en),
        "skills": s.listSkills_ru or s.listSkills_en or []
    } for s in skills]


@router.post("/skills", response_model=SkillCategoryResponse)
def create_skill_category(
        request: SkillCategoryCreateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Создать новую категорию навыков"""
    skill = Skills(
        title_ru=request.name.ru,
        title_en=request.name.en,
        listSkills_ru=request.skills,
        listSkills_en=request.skills  # копируем те же навыки
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return {
        "id": skill.id,
        "name": localized(skill.title_ru, skill.title_en),
        "skills": skill.listSkills_ru or skill.listSkills_en or []
    }


@router.put("/skills/{skill_id}", response_model=SkillCategoryResponse)
def update_skill_category(
        skill_id: int,
        request: SkillCategoryUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить категорию навыков"""
    skill = db.query(Skills).filter(Skills.id == skill_id).first()

    if not skill:
        raise HTTPException(status_code=404, detail="Skill category not found")

    skill.title_ru = request.name.ru
    skill.title_en = request.name.en
    skill.listSkills_ru = request.skills
    skill.listSkills_en = request.skills

    db.commit()
    db.refresh(skill)

    return {
        "id": skill.id,
        "name": localized(skill.title_ru, skill.title_en),
        "skills": skill.listSkills_ru or skill.listSkills_en or []
    }


@router.delete("/skills/{skill_id}")
def delete_skill_category(
        skill_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Удалить категорию навыков"""
    skill = db.query(Skills).filter(Skills.id == skill_id).first()

    if not skill:
        raise HTTPException(status_code=404, detail="Skill category not found")

    db.delete(skill)
    db.commit()

    return {"success": True, "message": "Skill category deleted"}


# ============= CERTIFICATES ENDPOINTS =============

@router.get("/certificates", response_model=List[CertificateResponse])
def get_certificates_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token),
        include_archived: bool = False
):
    """Получить все сертификаты для админки"""
    if include_archived:
        certificates = db.query(Certificate).order_by(Certificate.order).all()
    else:
        certificates = db.query(Certificate).filter(
            or_(Certificate.is_active == True, Certificate.is_active.is_(None))
        ).order_by(Certificate.order).all()

    return [{
        "id": c.id,
        "title": localized(c.title_ru, c.title_en),
        "description": localized(c.description_ru, c.description_en),
        "provider": c.provider or "",
        "image_url": c.image_url or "",
        "issue_date": c.issue_date or "",
        "credential_url": c.credential_url or None,
        "order": c.order,
        "is_active": c.is_active,
    } for c in certificates]


@router.post("/certificates", response_model=CertificateResponse)
def create_certificate(
        request: CertificateCreateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Создать новый сертификат"""
    max_order = db.query(Certificate).count()
    order_value = request.order if request.order is not None else max_order

    certificate = Certificate(
        title_ru=request.title.ru,
        title_en=request.title.en,
        description_ru=request.description.ru,
        description_en=request.description.en,
        provider=request.provider,
        image_url=request.image_url,
        issue_date=request.issue_date,
        credential_url=request.credential_url,
        order=order_value,
        is_active=True
    )

    db.add(certificate)
    db.commit()
    db.refresh(certificate)

    return {
        "id": certificate.id,
        "title": localized(certificate.title_ru, certificate.title_en),
        "description": localized(certificate.description_ru, certificate.description_en),
        "provider": certificate.provider or "",
        "image_url": certificate.image_url or "",
        "issue_date": certificate.issue_date or "",
        "credential_url": certificate.credential_url or None,
        "order": certificate.order,
        "is_active": certificate.is_active,
    }


@router.put("/certificates/{certificate_id}", response_model=CertificateResponse)
def update_certificate(
        certificate_id: int,
        request: CertificateUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить сертификат"""
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id).first()

    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")

    certificate.title_ru = request.title.ru
    certificate.title_en = request.title.en
    certificate.description_ru = request.description.ru
    certificate.description_en = request.description.en
    certificate.provider = request.provider
    certificate.image_url = request.image_url
    certificate.issue_date = request.issue_date
    certificate.credential_url = request.credential_url
    if request.order is not None:
        certificate.order = request.order

    db.commit()
    db.refresh(certificate)

    return {
        "id": certificate.id,
        "title": localized(certificate.title_ru, certificate.title_en),
        "description": localized(certificate.description_ru, certificate.description_en),
        "provider": certificate.provider or "",
        "image_url": certificate.image_url or "",
        "issue_date": certificate.issue_date or "",
        "credential_url": certificate.credential_url or None,
        "order": certificate.order,
        "is_active": certificate.is_active,
    }


@router.delete("/certificates/{certificate_id}")
def delete_certificate(
        certificate_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Удалить сертификат (soft delete)"""
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id).first()

    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")

    certificate.is_active = False
    db.commit()

    return {"success": True, "message": "Certificate deleted"}


@router.post("/certificates/{certificate_id}/restore")
def restore_certificate(
        certificate_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Восстановить сертификат"""
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id).first()

    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")

    certificate.is_active = True
    db.commit()

    return {"success": True, "message": "Certificate restored"}


@router.post("/certificates/upload-image")
def upload_certificate_image(
        file: UploadFile = File(...),
        user: dict = Depends(verify_token)
):
    """Upload certificate image and return public URL."""
    result = save_uploaded_file(file, CERTIFICATES_UPLOAD_DIR, convert_to_webp=True)
    return result


@router.post("/blog/upload-image")
def upload_blog_image(
        file: UploadFile = File(...),
        user: dict = Depends(verify_token)
):
    """Upload blog image and return public URL."""
    result = save_uploaded_file(file, BLOG_UPLOAD_DIR, convert_to_webp=True)
    return result


# ============= PERSONAL FACTS ENDPOINTS =============

@router.get("/personal", response_model=List[PersonalFactResponse])
def get_personal_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token),
        include_archived: bool = False
):
    """Получить личные факты для админки"""
    if include_archived:
        facts = db.query(Personal).order_by(Personal.order).all()
    else:
        facts = db.query(Personal).filter(
            or_(Personal.is_active == True, Personal.is_active.is_(None))
        ).order_by(Personal.order).all()

    return [{
        "id": f.id,
        "emoji": f.emoji or "",
        "title": localized(f.title_ru, f.title_en),
        "description": localized(f.description_ru, f.description_en),
        "order": f.order,
        "is_active": f.is_active,
    } for f in facts]


@router.post("/personal", response_model=PersonalFactResponse)
def create_personal_fact(
        request: PersonalFactCreateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Создать личный факт"""
    max_order = db.query(Personal).count()
    order_value = request.order if request.order is not None else max_order

    fact = Personal(
        emoji=request.emoji,
        title_ru=request.title.ru,
        title_en=request.title.en,
        description_ru=request.description.ru,
        description_en=request.description.en,
        order=order_value,
        is_active=True
    )

    db.add(fact)
    db.commit()
    db.refresh(fact)

    return {
        "id": fact.id,
        "emoji": fact.emoji or "",
        "title": localized(fact.title_ru, fact.title_en),
        "description": localized(fact.description_ru, fact.description_en),
        "order": fact.order,
        "is_active": fact.is_active,
    }


@router.put("/personal/{fact_id}", response_model=PersonalFactResponse)
def update_personal_fact(
        fact_id: int,
        request: PersonalFactUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить личный факт"""
    fact = db.query(Personal).filter(Personal.id == fact_id).first()

    if not fact:
        raise HTTPException(status_code=404, detail="Personal fact not found")

    fact.emoji = request.emoji
    fact.title_ru = request.title.ru
    fact.title_en = request.title.en
    fact.description_ru = request.description.ru
    fact.description_en = request.description.en
    if request.order is not None:
        fact.order = request.order

    db.commit()
    db.refresh(fact)

    return {
        "id": fact.id,
        "emoji": fact.emoji or "",
        "title": localized(fact.title_ru, fact.title_en),
        "description": localized(fact.description_ru, fact.description_en),
        "order": fact.order,
        "is_active": fact.is_active,
    }


@router.delete("/personal/{fact_id}")
def delete_personal_fact(
        fact_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Удалить личный факт (soft delete)"""
    fact = db.query(Personal).filter(Personal.id == fact_id).first()

    if not fact:
        raise HTTPException(status_code=404, detail="Personal fact not found")

    fact.is_active = False
    db.commit()

    return {"success": True, "message": "Personal fact deleted"}


@router.post("/personal/{fact_id}/restore")
def restore_personal_fact(
        fact_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Восстановить личный факт"""
    fact = db.query(Personal).filter(Personal.id == fact_id).first()

    if not fact:
        raise HTTPException(status_code=404, detail="Personal fact not found")

    fact.is_active = True
    db.commit()

    return {"success": True, "message": "Personal fact restored"}


# ============= BLOG ENDPOINTS =============

def _ensure_blog_category(db: Session, category_id: Optional[int]) -> None:
    if category_id is None:
        return
    exists = db.query(BlogCategory).filter(BlogCategory.id == category_id).first()
    if not exists:
        raise HTTPException(status_code=400, detail="Blog category not found")


def _ensure_blog_tags(db: Session, tag_ids: List[int]) -> None:
    if not tag_ids:
        return
    existing = db.query(BlogTag.id).filter(BlogTag.id.in_(tag_ids)).all()
    existing_ids = {row[0] for row in existing}
    missing = sorted(set(tag_ids) - existing_ids)
    if missing:
        raise HTTPException(status_code=400, detail=f"Blog tags not found: {missing}")


def _get_post_tag_ids(db: Session, post_id: int) -> List[int]:
    rows = db.query(BlogPostTag.tag_id).filter(BlogPostTag.post_id == post_id).all()
    return [row[0] for row in rows]


@router.get("/blog/categories", response_model=List[BlogCategoryResponse])
def get_blog_categories_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    categories = db.query(BlogCategory).order_by(BlogCategory.order).all()
    return [{
        "id": c.id,
        "name": localized(c.name_ru, c.name_en),
        "slug": c.slug,
        "order": c.order,
        "is_active": c.is_active,
    } for c in categories]


@router.post("/blog/categories", response_model=BlogCategoryResponse)
def create_blog_category(
        request: BlogCategoryCreateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    exists = db.query(BlogCategory).filter(BlogCategory.slug == request.slug).first()
    if exists:
        raise HTTPException(status_code=400, detail="Category slug already exists")

    max_order = db.query(BlogCategory).count()
    order_value = request.order if request.order is not None else max_order
    is_active_value = True if request.is_active is None else request.is_active

    category = BlogCategory(
        name_ru=request.name.ru,
        name_en=request.name.en,
        slug=request.slug,
        order=order_value,
        is_active=is_active_value
    )
    db.add(category)
    db.commit()
    db.refresh(category)

    return {
        "id": category.id,
        "name": localized(category.name_ru, category.name_en),
        "slug": category.slug,
        "order": category.order,
        "is_active": category.is_active,
    }


@router.put("/blog/categories/{category_id}", response_model=BlogCategoryResponse)
def update_blog_category(
        category_id: int,
        request: BlogCategoryUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    category = db.query(BlogCategory).filter(BlogCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    slug_exists = db.query(BlogCategory).filter(
        BlogCategory.slug == request.slug,
        BlogCategory.id != category_id
    ).first()
    if slug_exists:
        raise HTTPException(status_code=400, detail="Category slug already exists")

    category.name_ru = request.name.ru
    category.name_en = request.name.en
    category.slug = request.slug
    if request.order is not None:
        category.order = request.order
    if request.is_active is not None:
        category.is_active = request.is_active

    db.commit()
    db.refresh(category)

    return {
        "id": category.id,
        "name": localized(category.name_ru, category.name_en),
        "slug": category.slug,
        "order": category.order,
        "is_active": category.is_active,
    }


@router.delete("/blog/categories/{category_id}")
def delete_blog_category(
        category_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    category = db.query(BlogCategory).filter(BlogCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category.is_active = False
    db.commit()
    return {"success": True, "message": "Category archived"}


@router.get("/blog/tags", response_model=List[BlogTagResponse])
def get_blog_tags_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    tags = db.query(BlogTag).order_by(BlogTag.id.desc()).all()
    return [{
        "id": t.id,
        "name": localized(t.name_ru, t.name_en),
        "slug": t.slug,
    } for t in tags]


@router.post("/blog/tags", response_model=BlogTagResponse)
def create_blog_tag(
        request: BlogTagCreateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    exists = db.query(BlogTag).filter(BlogTag.slug == request.slug).first()
    if exists:
        raise HTTPException(status_code=400, detail="Tag slug already exists")

    tag = BlogTag(
        name_ru=request.name.ru,
        name_en=request.name.en,
        slug=request.slug
    )
    db.add(tag)
    db.commit()
    db.refresh(tag)

    return {
        "id": tag.id,
        "name": localized(tag.name_ru, tag.name_en),
        "slug": tag.slug,
    }


@router.put("/blog/tags/{tag_id}", response_model=BlogTagResponse)
def update_blog_tag(
        tag_id: int,
        request: BlogTagUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    tag = db.query(BlogTag).filter(BlogTag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    slug_exists = db.query(BlogTag).filter(
        BlogTag.slug == request.slug,
        BlogTag.id != tag_id
    ).first()
    if slug_exists:
        raise HTTPException(status_code=400, detail="Tag slug already exists")

    tag.name_ru = request.name.ru
    tag.name_en = request.name.en
    tag.slug = request.slug

    db.commit()
    db.refresh(tag)

    return {
        "id": tag.id,
        "name": localized(tag.name_ru, tag.name_en),
        "slug": tag.slug,
    }


@router.delete("/blog/tags/{tag_id}")
def delete_blog_tag(
        tag_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    tag = db.query(BlogTag).filter(BlogTag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    db.query(BlogPostTag).filter(BlogPostTag.tag_id == tag_id).delete()
    db.delete(tag)
    db.commit()
    return {"success": True, "message": "Tag deleted"}


@router.get("/blog/posts", response_model=List[BlogPostResponse])
def get_blog_posts_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    return [{
        "id": p.id,
        "slug": p.slug,
        "category_id": p.category_id,
        "status": p.status,
        "is_active": p.is_active,
        "published_at": p.published_at,
        "cover_image_url": p.cover_image_url or "",
        "og_image_url": p.og_image_url or "",
        "title": localized(p.title_ru, p.title_en),
        "excerpt": localized(p.excerpt_ru, p.excerpt_en),
        "content": localized(p.content_ru, p.content_en),
        "seo_title": localized(p.seo_title_ru, p.seo_title_en),
        "seo_description": localized(p.seo_description_ru, p.seo_description_en),
        "tag_ids": _get_post_tag_ids(db, p.id)
    } for p in posts]


@router.get("/blog/posts/{post_id}", response_model=BlogPostResponse)
def get_blog_post_admin(
        post_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return {
        "id": post.id,
        "slug": post.slug,
        "category_id": post.category_id,
        "status": post.status,
        "is_active": post.is_active,
        "published_at": post.published_at,
        "cover_image_url": post.cover_image_url or "",
        "og_image_url": post.og_image_url or "",
        "title": localized(post.title_ru, post.title_en),
        "excerpt": localized(post.excerpt_ru, post.excerpt_en),
        "content": localized(post.content_ru, post.content_en),
        "seo_title": localized(post.seo_title_ru, post.seo_title_en),
        "seo_description": localized(post.seo_description_ru, post.seo_description_en),
        "tag_ids": _get_post_tag_ids(db, post.id)
    }


@router.post("/blog/posts", response_model=BlogPostResponse)
def create_blog_post(
        request: BlogPostCreateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    exists = db.query(BlogPost).filter(BlogPost.slug == request.slug).first()
    if exists:
        raise HTTPException(status_code=400, detail="Post slug already exists")

    _ensure_blog_category(db, request.category_id)
    _ensure_blog_tags(db, request.tag_ids)

    status_value = (request.status or "draft").lower()
    if status_value not in {"draft", "published", "archived"}:
        raise HTTPException(status_code=400, detail="Invalid status")

    published_at_value = request.published_at
    if status_value == "published" and published_at_value is None:
        published_at_value = datetime.datetime.utcnow()

    post = BlogPost(
        slug=request.slug,
        category_id=request.category_id,
        status=status_value,
        is_active=True if request.is_active is None else request.is_active,
        published_at=published_at_value,
        cover_image_url=request.cover_image_url,
        og_image_url=request.og_image_url,
        title_ru=request.title.ru,
        excerpt_ru=request.excerpt.ru,
        content_ru=request.content.ru,
        seo_title_ru=(request.seo_title.ru if request.seo_title else request.title.ru),
        seo_description_ru=(request.seo_description.ru if request.seo_description else request.excerpt.ru),
        title_en=request.title.en,
        excerpt_en=request.excerpt.en,
        content_en=request.content.en,
        seo_title_en=(request.seo_title.en if request.seo_title else request.title.en),
        seo_description_en=(request.seo_description.en if request.seo_description else request.excerpt.en)
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    for tag_id in set(request.tag_ids or []):
        db.add(BlogPostTag(post_id=post.id, tag_id=tag_id))
    db.commit()

    return {
        "id": post.id,
        "slug": post.slug,
        "category_id": post.category_id,
        "status": post.status,
        "is_active": post.is_active,
        "published_at": post.published_at,
        "cover_image_url": post.cover_image_url or "",
        "og_image_url": post.og_image_url or "",
        "title": localized(post.title_ru, post.title_en),
        "excerpt": localized(post.excerpt_ru, post.excerpt_en),
        "content": localized(post.content_ru, post.content_en),
        "seo_title": localized(post.seo_title_ru, post.seo_title_en),
        "seo_description": localized(post.seo_description_ru, post.seo_description_en),
        "tag_ids": _get_post_tag_ids(db, post.id)
    }


@router.put("/blog/posts/{post_id}", response_model=BlogPostResponse)
def update_blog_post(
        post_id: int,
        request: BlogPostUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    slug_exists = db.query(BlogPost).filter(
        BlogPost.slug == request.slug,
        BlogPost.id != post_id
    ).first()
    if slug_exists:
        raise HTTPException(status_code=400, detail="Post slug already exists")

    _ensure_blog_category(db, request.category_id)
    _ensure_blog_tags(db, request.tag_ids)

    status_value = (request.status or "draft").lower()
    if status_value not in {"draft", "published", "archived"}:
        raise HTTPException(status_code=400, detail="Invalid status")

    post.slug = request.slug
    post.category_id = request.category_id
    post.status = status_value
    if request.is_active is not None:
        post.is_active = request.is_active

    if status_value == "published" and request.published_at is None and post.published_at is None:
        post.published_at = datetime.datetime.utcnow()
    else:
        post.published_at = request.published_at

    post.cover_image_url = request.cover_image_url
    post.og_image_url = request.og_image_url
    post.title_ru = request.title.ru
    post.excerpt_ru = request.excerpt.ru
    post.content_ru = request.content.ru
    post.seo_title_ru = request.seo_title.ru if request.seo_title else post.title_ru
    post.seo_description_ru = request.seo_description.ru if request.seo_description else post.excerpt_ru
    post.title_en = request.title.en
    post.excerpt_en = request.excerpt.en
    post.content_en = request.content.en
    post.seo_title_en = request.seo_title.en if request.seo_title else post.title_en
    post.seo_description_en = request.seo_description.en if request.seo_description else post.excerpt_en

    db.query(BlogPostTag).filter(BlogPostTag.post_id == post_id).delete()
    for tag_id in set(request.tag_ids or []):
        db.add(BlogPostTag(post_id=post_id, tag_id=tag_id))

    db.commit()
    db.refresh(post)

    return {
        "id": post.id,
        "slug": post.slug,
        "category_id": post.category_id,
        "status": post.status,
        "is_active": post.is_active,
        "published_at": post.published_at,
        "cover_image_url": post.cover_image_url or "",
        "og_image_url": post.og_image_url or "",
        "title": localized(post.title_ru, post.title_en),
        "excerpt": localized(post.excerpt_ru, post.excerpt_en),
        "content": localized(post.content_ru, post.content_en),
        "seo_title": localized(post.seo_title_ru, post.seo_title_en),
        "seo_description": localized(post.seo_description_ru, post.seo_description_en),
        "tag_ids": _get_post_tag_ids(db, post.id)
    }


@router.delete("/blog/posts/{post_id}")
def delete_blog_post(
        post_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.is_active = False
    db.commit()
    return {"success": True, "message": "Post archived"}


# ============= BLOG COMMENTS (ADMIN) =============

@router.get("/blog/comments", response_model=List[BlogCommentResponse])
def get_blog_comments(
        post_id: Optional[int] = None,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    query = db.query(BlogComment, BlogPost).join(BlogPost, BlogComment.post_id == BlogPost.id)
    if post_id:
        query = query.filter(BlogComment.post_id == post_id)

    comments = query.order_by(BlogComment.created_at.desc()).all()

    return [
        BlogCommentResponse(
            id=comment.id,
            post_id=comment.post_id,
            post_title=post.title_ru or post.title_en or "",
            name=comment.name,
            email=comment.email,
            message=comment.message,
            reply_message=comment.reply_message,
            replied_at=comment.replied_at,
            is_approved=comment.is_approved,
            is_read=comment.is_read,
            created_at=comment.created_at,
        )
        for comment, post in comments
    ]


@router.put("/blog/comments/{comment_id}/approve")
def approve_blog_comment(
        comment_id: int,
        approved: bool = True,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    comment = db.query(BlogComment).filter(BlogComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.is_approved = approved
    db.commit()
    db.refresh(comment)
    return {"success": True}


@router.put("/blog/comments/{comment_id}/read")
def mark_comment_read(
        comment_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    comment = db.query(BlogComment).filter(BlogComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.is_read = True
    db.commit()
    db.refresh(comment)
    return {"success": True}


@router.put("/blog/comments/{comment_id}/reply")
def reply_blog_comment(
        comment_id: int,
        request: BlogCommentReplyRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    comment = db.query(BlogComment).filter(BlogComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.reply_message = request.message
    comment.replied_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(comment)
    return {"success": True}


@router.delete("/blog/comments/{comment_id}")
def delete_blog_comment(
        comment_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    comment = db.query(BlogComment).filter(BlogComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    db.delete(comment)
    db.commit()
    return {"success": True}


# ============= SUBMISSIONS ENDPOINTS (без изменений) =============

@router.get("/submissions")
def get_submissions(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Получить все сообщения из контактной формы"""
    submissions = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return submissions


@router.put("/submissions/{submission_id}/read")
def mark_read(
        submission_id: int,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Отметить сообщение как прочитанное"""
    submission = db.query(ContactMessage).filter(ContactMessage.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission.is_read = True
    db.commit()
    db.refresh(submission)

    return submission


@router.get("/settings", response_model=dict)
def get_settings_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Получить настройки (контакты, футер)"""
    settings = db.query(Settings).first()

    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")

    return {
        "id": settings.id,
        "email": settings.email or "",
        "phone": settings.phone or "",
        "location": localized(settings.location_ru, settings.location_en),
        "contact_title": localized(settings.title_text_footer_ru, settings.title_text_footer_en),
        "contact_description": localized(settings.desc_text_footer_ru, settings.desc_text_footer_en),
        "footer_rights": localized(settings.footer_info_ru, settings.footer_info_en)
    }


@router.put("/settings")
def update_settings(
        request: SettingsUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить настройки"""
    settings = db.query(Settings).first()

    if not settings:
        # Создаём если не существует
        settings = Settings(
            email=request.email,
            phone=request.phone,
            location_ru=request.location.ru,
            location_en=request.location.en,
            title_text_footer_ru=request.contact_title.ru,
            title_text_footer_en=request.contact_title.en,
            desc_text_footer_ru=request.contact_description.ru,
            desc_text_footer_en=request.contact_description.en,
            footer_info_ru=request.footer_rights.ru,
            footer_info_en=request.footer_rights.en
        )
        db.add(settings)
    else:
        # Обновляем существующий
        settings.email = request.email
        settings.phone = request.phone
        settings.location_ru = request.location.ru
        settings.location_en = request.location.en
        settings.title_text_footer_ru = request.contact_title.ru
        settings.title_text_footer_en = request.contact_title.en
        settings.desc_text_footer_ru = request.contact_description.ru
        settings.desc_text_footer_en = request.contact_description.en
        settings.footer_info_ru = request.footer_rights.ru
        settings.footer_info_en = request.footer_rights.en

    db.commit()
    db.refresh(settings)

    return {"success": True, "message": "Settings updated"}


@router.get("/site-settings")
def get_site_settings_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return get_site_settings(settings)


@router.put("/site-settings")
def update_site_settings_admin(
        request: SiteSettingsUpdateRequest,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)

    value = settings.value if isinstance(settings.value, dict) else {}
    value["site_settings"] = {
        "site_visible": request.site_visible,
        "noindex": request.noindex,
        "sitemap_exclude": request.sitemap_exclude or [],
        "closed_message": request.closed_message,
        "site_title": request.site_title,
        "site_description": request.site_description,
        "favicon_light": request.favicon_light,
        "favicon_dark": request.favicon_dark,
        "favicon_svg": request.favicon_svg,
        "apple_icon": request.apple_icon,
        "og_default_image": request.og_default_image,
        "cache_enabled": request.cache_enabled,
        "cache_ttl_seconds": request.cache_ttl_seconds,
    }
    settings.value = value
    flag_modified(settings, "value")
    db.commit()
    db.refresh(settings)

    return {"success": True}


@router.post("/site-settings/upload")
def upload_site_asset(
        type: str,
        file: UploadFile = File(...),
        user: dict = Depends(verify_token)
):
    """Upload site asset (favicon/og)."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="File is required")

    safe_name = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = SITE_UPLOAD_DIR / safe_name
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"url": f"/uploads/site/{safe_name}", "type": type}


@router.get("/media")
def list_media_files(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """List all media files from uploads."""
    base_dir = Path(settings.upload_dir)
    items = []
    paths = []
    for root, _, files in os.walk(base_dir):
        for name in files:
            file_path = Path(root) / name
            rel_path = file_path.relative_to(base_dir)
            url = f"/uploads/{rel_path.as_posix()}"
            stat = file_path.stat()
            rel = str(rel_path.as_posix())
            paths.append(rel)
            items.append({
                "path": rel,
                "url": url,
                "size": stat.st_size,
                "modified_at": datetime.datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "is_webp": file_path.suffix.lower() == ".webp",
                "folder": rel_path.parts[0] if rel_path.parts else "",
            })
    usage_map = _build_media_usage_map(db, paths)
    for item in items:
        item["usage"] = usage_map.get(item["path"], [])
        item["is_used"] = len(item["usage"]) > 0

    items.sort(key=lambda x: x["modified_at"], reverse=True)
    return items


@router.post("/media/delete")
def delete_media_files(paths: List[str], user: dict = Depends(verify_token)):
    """Delete selected media files by relative path."""
    base_dir = Path(settings.upload_dir).resolve()
    deleted = []
    for rel in paths:
        try:
            candidate = (base_dir / rel).resolve()
            if base_dir not in candidate.parents:
                continue
            if candidate.exists() and candidate.is_file():
                candidate.unlink()
                deleted.append(rel)
        except Exception:
            continue
    return {"success": True, "deleted": deleted}


@router.post("/cache/clear")
async def clear_cache_admin(
        user: dict = Depends(verify_token)
):
    """Clear Redis cache manually from admin."""
    await clear_cache()
    return {"success": True, "message": "Cache cleared"}


@router.get("/cache/status")
async def cache_status_admin(user: dict = Depends(verify_token)):
    return await get_cache_status()


@router.get("/social-links", response_model=dict)
def get_social_links_admin(
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Получить социальные ссылки"""
    hero = db.query(Hero).first()
    return hero.social_links if hero and hero.social_links else {}


@router.put("/social-links")
def update_social_links(
        links: dict,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить социальные ссылки"""
    hero = db.query(Hero).first()
    if not hero:
        hero = Hero(
            title_ru="",
            title_en="",
            subtitle_ru="",
            subtitle_en="",
            description_ru="",
            description_en="",
            button_ru="",
            button_en="",
            image_url=""
        )
        db.add(hero)
    hero.social_links = links or {}
    db.commit()
    db.refresh(hero)
    return {"success": True}



