"""API endpoints для фронтенда (public)"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import ContactMessage

from src.application.use_cases.page.get_page_data import (
    GetPageDataUseCase, GetHeroUseCase, GetAboutUseCase,
    GetServicesUseCase, GetServiceByIdUseCase,
    GetProjectsUseCase, GetProjectByIdUseCase,
    GetExperienceUseCase, GetSkillsUseCase,
    GetCertificatesUseCase, GetPersonalFactsUseCase,
    GetContactInfoUseCase
)
from src.infrastructure.api.v1.schemas.page import (
    HeroDataSchema, AboutDataSchema, ServiceSchema,
    ProjectSchema, ExperienceSchema, SkillCategorySchema,
    CertificateSchema, PersonalFactSchema, ContactInfoSchema,
    PageDataSchema, ContactFormSchema
)
from src.infrastructure.api.dependencies import (
    get_page_data_use_case, get_hero_use_case, get_about_use_case,
    get_services_use_case, get_service_by_id_use_case,
    get_projects_use_case, get_project_by_id_use_case,
    get_experience_use_case, get_skills_use_case,
    get_certificates_use_case, get_personal_facts_use_case,
    get_contact_info_use_case
)
from src.core.exceptions.domain import EntityNotFoundException

router = APIRouter(prefix="/api", tags=["Portfolio"])


@router.get("/")
def root():
    """Список доступных endpoints"""
    return {
        "message": "Portfolio API",
        "version": "1.0.0",
        "endpoints": {
            "hero": "/api/hero",
            "about": "/api/about",
            "services": "/api/services",
            "projects": "/api/projects",
            "experience": "/api/experience",
            "skills": "/api/skills",
            "certificates": "/api/certificates",
            "personal": "/api/personal",
            "contact": "/api/contact",
            "page_data": "/api/page-data"
        }
    }


@router.get("/hero", response_model=HeroDataSchema)
def get_hero(use_case: GetHeroUseCase = Depends(get_hero_use_case)):
    """Получить данные hero секции"""
    hero = use_case.execute()
    return hero


@router.get("/about", response_model=AboutDataSchema)
def get_about(use_case: GetAboutUseCase = Depends(get_about_use_case)):
    """Получить информацию о себе"""
    about = use_case.execute()
    return about.to_dict()


@router.get("/services", response_model=List[ServiceSchema])
def get_services(use_case: GetServicesUseCase = Depends(get_services_use_case)):
    """Получить список услуг"""
    services = use_case.execute()
    return [s.to_dict() for s in services]


@router.get("/services/{service_id}", response_model=ServiceSchema)
def get_service(
        service_id: int,
        use_case: GetServiceByIdUseCase = Depends(get_service_by_id_use_case)
):
    """Получить конкретную услугу"""
    try:
        service = use_case.execute(service_id)
        return service.to_dict()
    except EntityNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/projects", response_model=List[ProjectSchema])
def get_projects(use_case: GetProjectsUseCase = Depends(get_projects_use_case)):
    """Получить список проектов"""
    projects = use_case.execute()
    return [p.to_dict() for p in projects]


@router.get("/projects/{project_id}", response_model=ProjectSchema)
def get_project(
        project_id: int,
        use_case: GetProjectByIdUseCase = Depends(get_project_by_id_use_case)
):
    """Получить конкретный проект"""
    try:
        project = use_case.execute(project_id)
        return project.to_dict()
    except EntityNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/experience", response_model=List[ExperienceSchema])
def get_experience(use_case: GetExperienceUseCase = Depends(get_experience_use_case)):
    """Получить опыт работы"""
    experience = use_case.execute()
    return [e.to_dict() for e in experience]


@router.get("/skills", response_model=List[SkillCategorySchema])
def get_skills(use_case: GetSkillsUseCase = Depends(get_skills_use_case)):
    """Получить навыки"""
    skills = use_case.execute()
    return [s.to_dict() for s in skills]


@router.get("/certificates", response_model=List[CertificateSchema])
def get_certificates(use_case: GetCertificatesUseCase = Depends(get_certificates_use_case)):
    """Получить сертификаты"""
    certificates = use_case.execute()
    return [c.to_dict() for c in certificates]


@router.get("/personal", response_model=List[PersonalFactSchema])
def get_personal_facts(use_case: GetPersonalFactsUseCase = Depends(get_personal_facts_use_case)):
    """Получить личные факты"""
    facts = use_case.execute()
    return [f.to_dict() for f in facts]


@router.get("/contact", response_model=ContactInfoSchema)
def get_contact_info(use_case: GetContactInfoUseCase = Depends(get_contact_info_use_case)):
    """Получить контактную информацию"""
    contact = use_case.execute()
    return contact.to_dict()


@router.post("/contact/send")
def send_contact_form(form: ContactFormSchema, db: Session = Depends(get_db)):
    """Отправить форму обратной связи и сохранить в БД"""

    # Создаём объект модели
    contact = ContactMessage(
        name=form.name,
        email=form.email,
        message=form.message,
        created_at=datetime.now()
    )

    # Добавляем в сессию и сохраняем
    db.add(contact)
    db.commit()
    db.refresh(contact)

    return {
        "success": True,
        "message": "Message sent successfully",
        "timestamp": datetime.now().isoformat(),
        "id": contact.id
    }



@router.get("/page-data", response_model=PageDataSchema)
def get_full_page_data(use_case: GetPageDataUseCase = Depends(get_page_data_use_case)):
    """Получить все данные страницы одним запросом (для оптимизации)"""
    page_data = use_case.execute()
    return page_data.to_dict()