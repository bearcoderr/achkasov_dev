# (PUT /about, POST /projects)
"""API endpoints для админки (protected)"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import jwt
import datetime
from passlib.context import CryptContext

import os

from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import (
    LoginRequest as LoginRequestModel,
    Hero, About, Service, Project,
    Experience, Skills, Personal,
    ContactMessage, Settings
)

from src.infrastructure.api.admin.schemas.admin_schemas import (
    LoginRequest, LoginResponse,
    HeroUpdateRequest, HeroResponse,
    AboutUpdateRequest, AboutResponse,
    ServiceCreateRequest, ServiceUpdateRequest, ServiceResponse,
    ProjectCreateRequest, ProjectUpdateRequest, ProjectResponse,
    ExperienceCreateRequest, ExperienceUpdateRequest, ExperienceResponse,
    SkillCategoryCreateRequest, SkillCategoryUpdateRequest, SkillCategoryResponse
)

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "CHANGE-ME-IN-PRODUCTION")
ALGORITHM = "HS256"

router = APIRouter(prefix="/admin", tags=["Admin"])

import logging

logger = logging.getLogger(__name__)


# ============= AUTH HELPERS =============

def verify_token(authorization: str = Header(None)) -> dict:
    """Проверка JWT токена"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
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
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

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
        "subtitle": {"ru": hero.subtitle_ru, "en": hero.subtitle_eng},
        "description": {"ru": hero.description_ru, "en": hero.description_eng},
        "cta": {"ru": hero.button_ru, "en": hero.button_eng},
        "image": hero.image_url
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
            subtitle_eng=request.subtitle.en,
            description_ru=request.description.ru,
            description_eng=request.description.en,
            button_ru=request.cta.ru,
            button_eng=request.cta.en,
            image_url=request.image
        )
        db.add(hero)
    else:
        # Обновляем существующий
        hero.title_ru = request.title.ru
        hero.title_en = request.title.en
        hero.subtitle_ru = request.subtitle.ru
        hero.subtitle_eng = request.subtitle.en
        hero.description_ru = request.description.ru
        hero.description_eng = request.description.en
        hero.button_ru = request.cta.ru
        hero.button_eng = request.cta.en
        hero.image_url = request.image

    db.commit()
    db.refresh(hero)

    return {
        "id": hero.id,
        "title": {"ru": hero.title_ru, "en": hero.title_en},
        "subtitle": {"ru": hero.subtitle_ru, "en": hero.subtitle_eng},
        "description": {"ru": hero.description_ru, "en": hero.description_eng},
        "cta": {"ru": hero.button_ru, "en": hero.button_eng},
        "image": hero.image_url
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
        "title": {"ru": about.title_ru, "en": about.title_en},
        "description": {"ru": about.description_ru, "en": about.description_eng}
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
            description_eng=request.description.en
        )
        db.add(about)
    else:
        about.title_ru = request.title.ru
        about.title_en = request.title.en
        about.description_ru = request.description.ru
        about.description_eng = request.description.en

    db.commit()
    db.refresh(about)

    return {
        "id": about.id,
        "title": {"ru": about.title_ru, "en": about.title_en},
        "description": {"ru": about.description_ru, "en": about.description_eng}
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
        "title": {"ru": s.title_ru, "en": s.title_en},
        "description": {"ru": s.description_ru, "en": s.description_en},
        "details": {"ru": s.details_ru, "en": s.details_en},
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
        details_ru=request.details.ru,
        details_en=request.details.en,
        icon=request.icon,
        order=max_order,
        is_active=True
    )

    db.add(service)
    db.commit()
    db.refresh(service)

    return {
        "id": service.id,
        "title": {"ru": service.title_ru, "en": service.title_en},
        "description": {"ru": service.description_ru, "en": service.description_en},
        "details": {"ru": service.details_ru, "en": service.details_en},
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
    service.details_ru = request.details.ru
    service.details_en = request.details.en
    service.icon = request.icon

    db.commit()
    db.refresh(service)

    return {
        "id": service.id,
        "title": {"ru": service.title_ru, "en": service.title_en},
        "description": {"ru": service.description_ru, "en": service.description_en},
        "details": {"ru": service.details_ru, "en": service.details_en},
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
    experiences = db.query(Experience).filter(Experience.is_active == True).order_by(Experience.order).all()

    return [{
        "id": e.id,
        "year": e.period_ru,  # используем period_ru как год
        "company": {"ru": e.company_ru, "en": e.company_en},
        "position": {"ru": e.position_ru, "en": e.position_en},
        "description": {"ru": e.description_ru, "en": e.description_en}
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
        "company": {"ru": experience.company_ru, "en": experience.company_en},
        "position": {"ru": experience.position_ru, "en": experience.position_en},
        "description": {"ru": experience.description_ru, "en": experience.description_en}
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
        "company": {"ru": experience.company_ru, "en": experience.company_en},
        "position": {"ru": experience.position_ru, "en": experience.position_en},
        "description": {"ru": experience.description_ru, "en": experience.description_en}
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
        "name": {"ru": s.title_ru, "en": s.title_en},
        "skills": s.listSkills_ru  # предполагаем что навыки одинаковые для обеих локалей
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
        "name": {"ru": skill.title_ru, "en": skill.title_en},
        "skills": skill.listSkills_ru
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
        "name": {"ru": skill.title_ru, "en": skill.title_en},
        "skills": skill.listSkills_ru
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
        "email": settings.email,
        "phone": settings.phone,
        "location": {"ru": settings.location_ru, "en": settings.location_en},
        "contact_title": {"ru": settings.title_text_footer_ru, "en": settings.title_text_footer_en},
        "contact_description": {"ru": settings.desc_text_footer_ru, "en": settings.desc_text_footer_en},
        "footer_rights": {"ru": settings.footer_info_ru, "en": settings.footer_info_en}
    }


@router.put("/settings")
def update_settings(
        email: str,
        phone: str,
        location_ru: str,
        location_en: str,
        title_text_footer_ru: str,
        title_text_footer_en: str,
        desc_text_footer_ru: str,
        desc_text_footer_en: str,
        footer_info_ru: str,
        footer_info_en: str,
        db: Session = Depends(get_db),
        user: dict = Depends(verify_token)
):
    """Обновить настройки"""
    settings = db.query(Settings).first()

    if not settings:
        # Создаём если не существует
        settings = Settings(
            email=email,
            phone=phone,
            location_ru=location_ru,
            location_en=location_en,
            title_text_footer_ru=title_text_footer_ru,
            title_text_footer_en=title_text_footer_en,
            desc_text_footer_ru=desc_text_footer_ru,
            desc_text_footer_en=desc_text_footer_en,
            footer_info_ru=footer_info_ru,
            footer_info_en=footer_info_en
        )
        db.add(settings)
    else:
        # Обновляем существующий
        settings.email = email
        settings.phone = phone
        settings.location_ru = location_ru
        settings.location_en = location_en
        settings.title_text_footer_ru = title_text_footer_ru
        settings.title_text_footer_en = title_text_footer_en
        settings.desc_text_footer_ru = desc_text_footer_ru
        settings.desc_text_footer_en = desc_text_footer_en
        settings.footer_info_ru = footer_info_ru
        settings.footer_info_en = footer_info_en

    db.commit()
    db.refresh(settings)

    return {"success": True, "message": "Settings updated"}