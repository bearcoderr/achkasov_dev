"""API endpoints для фронтенда (public) - ПОЛНАЯ ВЕРСИЯ"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import (
    Hero, About, Service, Project,
    Experience, Skills, ContactMessage, Settings, Personal, Certificate
)

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
        "name": hero.title_ru,
        "title": {"ru": hero.subtitle_ru, "en": hero.subtitle_en},
        "subtitle": {"ru": hero.description_ru, "en": hero.description_en},
        "cv_url": "/resume.pdf",
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
    facts = db.query(Personal).all()
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
    phone: str = None,
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
    """Получить все данные страницы одним запросом"""

    # Hero
    hero = db.query(Hero).first()
    hero_data = {
        "greeting": {"ru": "Привет, я", "en": "Hi, I'm"},
        "img": hero.image_url if hero else "",
        "name": hero.title_ru if hero else "",
        "title": {"ru": hero.subtitle_ru, "en": hero.subtitle_en} if hero else {"ru": "", "en": ""},
        "subtitle": {"ru": hero.description_ru, "en": hero.description_en} if hero else {"ru": "", "en": ""},
        "cv_url": "/resume.pdf",
        "social_links": hero.social_links if hero else {}
    } if hero else None

    # About
    about = db.query(About).first()
    about_data = {
        "title": {"ru": about.title_ru, "en": about.title_en},
        "text": {"ru": about.description_ru, "en": about.description_en}
    } if about else None

    # Personal Facts
    facts = db.query(Personal).all()
    personal_data = [{
        "emoji": fact.emoji,
        "title": {"ru": fact.title_ru, "en": fact.title_en},
        "description": {"ru": fact.description_ru, "en": fact.description_en}
    } for fact in facts]

    # Services
    services = db.query(Service).filter(Service.is_active == True).order_by(Service.order).all()
    services_data = [{
        "title": {"ru": s.title_ru, "en": s.title_en},
        "description": {"ru": s.description_ru, "en": s.description_en},
        "details": {"ru": s.details_ru or [], "en": s.details_en or []},
        "icon": s.icon or "🚀"
    } for s in services]

    # Projects
    projects = db.query(Project).filter(Project.is_active == True).order_by(Project.order).all()
    projects_data = [{
        "title": {"ru": p.title_ru, "en": p.title_en},
        "description": {"ru": p.description_ru, "en": p.description_en},
        "tech": p.tech or [],
        "demo_url": p.demo_url,
        "github_url": p.github_url
    } for p in projects]

    # Experience
    experiences = db.query(Experience).filter(Experience.is_active == True).order_by(Experience.order).all()
    experience_data = [{
        "period": {"ru": e.period_ru, "en": e.period_en},
        "position": {"ru": e.position_ru, "en": e.position_en},
        "company": e.company_ru,
        "description": {"ru": e.description_ru, "en": e.description_en}
    } for e in experiences]

    # Skills - ИСПРАВЛЕНО
    skills = db.query(Skills).all()
    skills_data = [{
        "name": {"ru": s.title_ru, "en": s.title_en},
        "items": {
            "ru": s.listSkills_ru or [],
            "en": s.listSkills_en or s.listSkills_ru or []
        }
    } for s in skills]

    # Certificates
    certificates = db.query(Certificate).filter(Certificate.is_active == True).order_by(Certificate.order).all()
    certificates_data = [{
        "title": {"ru": c.title_ru, "en": c.title_en},
        "provider": c.provider,
        "description": {"ru": c.description_ru, "en": c.description_en},
        "image_url": c.image_url,
        "issue_date": c.issue_date
    } for c in certificates]

    # Settings (Contact & Footer)
    settings = db.query(Settings).first()

    # Contact Info
    contact_data = {
        "email": settings.email,
        "phone": settings.phone,
        "location": {
            "ru": settings.location_ru,
            "en": settings.location_en
        },
        "title": {
            "ru": settings.title_text_footer_ru if settings else "Контакты",
            "en": settings.title_text_footer_en if settings else "Contact"
        },
        "description": {
            "ru": settings.desc_text_footer_ru,
            "en": settings.desc_text_footer_en
        }
    }

    # Footer Info
    footer_data = {
        "rights": {
            "ru": settings.footer_info_ru if settings else "Все права защищены",
            "en": settings.footer_info_en if settings else "All rights reserved"
        },
        "privacy": {"ru": "Политика конфиденциальности", "en": "Privacy Policy"},
        "social_links": hero.social_links if hero else {}
    }

    return {
        "hero": hero_data,
        "about": about_data,
        "personal": personal_data,
        "services": services_data,
        "projects": projects_data,
        "experience": experience_data,
        "skills": skills_data,
        "certificates": certificates_data,
        "contact": contact_data,
        "footer": footer_data
    }