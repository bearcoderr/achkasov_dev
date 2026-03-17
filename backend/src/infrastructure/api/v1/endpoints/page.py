"""API endpoints для фронтенда (public) - ПОЛНАЯ ВЕРСИЯ"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import (
    Hero, About, Service, Project,
    Experience, Skills, ContactMessage, Settings, Personal, Certificate,
    BlogPost, BlogCategory
)

import logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Portfolio"])


# ============= ROOT =============

@router.get("/")
def root():
    """Список доступных endpoints"""
    return {
        "message": "Portfolio API",
        "version": "2.0.0",
        "endpoints": {
            "hero": "/api/hero",
            "about": "/api/about",
            "services": "/api/services",
            "projects": "/api/projects",
            "experience": "/api/experience",
            "skills": "/api/skills",
            "contact": "/api/contact/send",
            "personal": "/api/personal",
            "page_data": "/api/page-data"
        }
    }


# ============= HERO =============

@router.get("/hero")
def get_hero(db: Session = Depends(get_db)):
    """Получить данные hero секции"""
    hero = db.query(Hero).first()

    if not hero:
        raise HTTPException(status_code=404, detail="Hero data not found")

    return {
        "greeting": {"ru": "Привет, я", "en": "Hi, I'm"},
        "img": hero.image_url,
        "name": {"ru": hero.title_ru, "en": hero.title_en},
        "title": {"ru": hero.subtitle_ru, "en": hero.subtitle_en},
        "subtitle": {"ru": hero.description_ru, "en": hero.description_en},
        "cv_url": {"ru": hero.cv_url_ru or "", "en": hero.cv_url_en or ""},
        "social_links": hero.social_links or {}
    }


# ============= ABOUT =============

@router.get("/about")
def get_about(db: Session = Depends(get_db)):
    """Получить информацию о себе"""
    about = db.query(About).first()

    if not about:
        raise HTTPException(status_code=404, detail="About data not found")

    return {
        "title": {"ru": about.title_ru, "en": about.title_en},
        "description": {"ru": about.description_ru, "en": about.description_en}
    }


# ============= PERSONAL =============

@router.get("/personal")
def get_personal_facts(db: Session = Depends(get_db)):
    """Получить личные факты"""
    from sqlalchemy import or_
    facts = db.query(Personal).filter(
        or_(Personal.is_active == True, Personal.is_active.is_(None))
    ).order_by(Personal.order).all()
    if not facts:
        raise HTTPException(status_code=404, detail="Personal data not found")

    return [
        {
            "id": str(fact.id),
            "emoji": fact.emoji,
            "title": {"ru": fact.title_ru, "en": fact.title_en},
            "description": {"ru": fact.description_ru, "en": fact.description_en}
        }
        for fact in facts
    ]


# ============= SERVICES =============

@router.get("/services")
def get_services(db: Session = Depends(get_db)):
    """Получить список услуг"""
    services = db.query(Service).filter(
        Service.is_active == True
    ).order_by(Service.order).all()

    return [{
        "id": str(s.id),
        "title": {"ru": s.title_ru, "en": s.title_en},
        "description": {"ru": s.description_ru, "en": s.description_en},
        "details": {"ru": s.details_ru or [], "en": s.details_en or []},
        "icon": s.icon or "🚀"
    } for s in services]


@router.get("/services/{service_id}")
def get_service(service_id: int, db: Session = Depends(get_db)):
    """Получить конкретную услугу"""
    service = db.query(Service).filter(
        Service.id == service_id,
        Service.is_active == True
    ).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    return {
        "id": str(service.id),
        "title": {"ru": service.title_ru, "en": service.title_en},
        "description": {"ru": service.description_ru, "en": service.description_en},
        "details": {"ru": service.details_ru or [], "en": service.details_en or []},
        "icon": service.icon
    }


# ============= PROJECTS =============

@router.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    """Получить список проектов"""
    projects = db.query(Project).filter(
        Project.is_active == True
    ).order_by(Project.order).all()

    return [{
        "id": str(p.id),
        "title": {"ru": p.title_ru, "en": p.title_en},
        "description": {"ru": p.description_ru, "en": p.description_en},
        "image": p.image_url or "",
        "tags": p.tech or [],
        "link": p.demo_url or "#"
    } for p in projects]


@router.get("/projects/{project_id}")
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Получить конкретный проект"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.is_active == True
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return {
        "id": str(project.id),
        "title": {"ru": project.title_ru, "en": project.title_en},
        "description": {"ru": project.description_ru, "en": project.description_en},
        "image": project.image_url,
        "tags": project.tech,
        "link": project.demo_url
    }


# ============= EXPERIENCE =============

@router.get("/experience")
def get_experience(db: Session = Depends(get_db)):
    """Получить опыт работы"""
    experiences = db.query(Experience).filter(
        Experience.is_active == True
    ).order_by(Experience.order).all()

    return [{
        "id": str(e.id),
        "year": e.period_ru,
        "company": {"ru": e.company_ru, "en": e.company_en},
        "position": {"ru": e.position_ru, "en": e.position_en},
        "description": {"ru": e.description_ru, "en": e.description_en}
    } for e in experiences]


# ============= SKILLS =============

@router.get("/skills")
def get_skills(db: Session = Depends(get_db)):
    """Получить навыки по категориям"""
    skills = db.query(Skills).all()

    return [{
        "id": str(s.id),
        "name": {"ru": s.title_ru, "en": s.title_en},
        "items": {
            "ru": s.listSkills_ru or [],
            "en": s.listSkills_en or s.listSkills_ru or []
        }
    } for s in skills]


# ============= CERTIFICATES =============

@router.get("/certificates")
def get_certificates(db: Session = Depends(get_db)):
    """Получить сертификаты"""
    certificates = db.query(Certificate).filter(
        Certificate.is_active == True
    ).order_by(Certificate.order).all()

    return [{
        "id": str(c.id),
        "title": {"ru": c.title_ru, "en": c.title_en},
        "provider": c.provider,
        "description": {"ru": c.description_ru, "en": c.description_en},
        "image_url": c.image_url,
        "issue_date": c.issue_date
    } for c in certificates]


# ============= SETTINGS / CONTACT INFO =============

@router.get("/contact-info")
def get_contact_info(db: Session = Depends(get_db)):
    """Получить контактную информацию"""
    settings = db.query(Settings).first()

    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")

    return {
        "email": settings.email,
        "phone": settings.phone,
        "location": {"ru": settings.location_ru, "en": settings.location_en},
        "title": {"ru": settings.title_text_footer_ru, "en": settings.title_text_footer_en},
        "description": {"ru": settings.desc_text_footer_ru, "en": settings.desc_text_footer_en}
    }


@router.get("/footer-info")
def get_footer_info(db: Session = Depends(get_db)):
    """Получить информацию для футера"""
    settings = db.query(Settings).first()
    hero = db.query(Hero).first()

    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")

    return {
        "rights": {"ru": settings.footer_info_ru, "en": settings.footer_info_en},
        "privacy": {"ru": "Политика конфиденциальности", "en": "Privacy Policy"},
        "social_links": hero.social_links if hero else {}
    }


# ============= CONTACT =============

@router.post("/contact/send")
def send_contact_form(
    name: str,
    email: str,
    message: str,
    phone: str = "",
    db: Session = Depends(get_db)
):
    """Отправить форму обратной связи и сохранить в БД"""

    contact = ContactMessage(
        name=name,
        email=email,
        message=message,
        phone=phone,
        created_at=datetime.now()
    )

    db.add(contact)
    db.commit()
    db.refresh(contact)

    return {
        "success": True,
        "message": "Message sent successfully",
        "timestamp": datetime.now().isoformat(),
        "id": contact.id
    }


# ============= PAGE DATA (ALL IN ONE) =============

@router.get("/page-data")
def get_full_page_data(db: Session = Depends(get_db)):
    """Получить все данные страницы одним запросом через репозиторий"""
    from src.infrastructure.db.repositories.page_repo_impl import PageRepositoryImpl
    repo = PageRepositoryImpl(db)
    
    try:
        page_data = repo.get_all_page_data()
        return page_data.to_dict()
    except Exception as e:
        logger.error(f"Error fetching page data: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= BLOG (PUBLIC) =============

@router.get("/blog/posts")
def get_blog_posts(limit: int = 3, db: Session = Depends(get_db)):
    """Get latest published blog posts for public frontend."""
    from sqlalchemy import desc

    posts = (
        db.query(BlogPost, BlogCategory)
        .outerjoin(BlogCategory, BlogPost.category_id == BlogCategory.id)
        .filter(BlogPost.is_active == True, BlogPost.status == "published")
        .order_by(desc(BlogPost.published_at), desc(BlogPost.created_at))
        .limit(limit)
        .all()
    )

    return [
        {
            "id": post.id,
            "slug": post.slug,
            "title": {"ru": post.title_ru or "", "en": post.title_en or ""},
            "excerpt": {"ru": post.excerpt_ru or "", "en": post.excerpt_en or ""},
            "cover_image_url": post.cover_image_url or "",
            "published_at": post.published_at.isoformat() if post.published_at else None,
            "category": {
                "id": category.id,
                "name": {"ru": category.name_ru or "", "en": category.name_en or ""},
                "slug": category.slug,
            } if category else None,
        }
        for post, category in posts
    ]
