# Реализация IPageRepository (чтение)

"""Реализация репозитория для чтения данных"""
from typing import List
from src.application.services.page_repository import IPageRepository
from src.core.entities.page import (
    HeroData, AboutData, Service, Project,
    Experience, SkillCategory, Certificate,
    PersonalFact, ContactInfo, PageData, LocalizedField
)
from src.core.exceptions.domain import EntityNotFoundException
from src.infrastructure.db.static_data import (
    SERVICES, PROJECTS,
    EXPERIENCE, SKILLS, CERTIFICATES, PERSONAL_FACTS, CONTACT_INFO
)
from src.infrastructure.db.models import Hero, About


from sqlalchemy.orm import Session

class PageRepositoryImpl(IPageRepository):
    """Реализация IPageRepository с использованием статических данных"""

    def __init__(self, db_session: Session):
        self.db = db_session

    def get_hero(self) -> HeroData:
        hero_row = self.db.query(Hero).first()
        if not hero_row:
            raise EntityNotFoundException("Hero not found")

        return HeroData(
            greeting=LocalizedField(ru="Привет, я", en="Hi, I'm"),
            img=hero_row.image_url,
            name=LocalizedField(ru=hero_row.title_ru, en=hero_row.title_en),
            title=LocalizedField(ru=hero_row.subtitle_ru, en=hero_row.subtitle_eng),
            subtitle=LocalizedField(ru=hero_row.description_ru, en=hero_row.description_eng),
            cv_url="/resume.pdf",
            social_links=hero_row.social_links or {}
        )

    def get_about(self) -> AboutData:
        about_row = self.db.query(About).first()
        if not about_row:
            raise EntityNotFoundException("About not found")

        return AboutData(
            title=LocalizedField(ru=about_row.title_ru, en=about_row.title_en),
            text=LocalizedField(ru=about_row.description_ru, en=about_row.description_eng),
        )


    def get_services(self) -> List[Service]:
        return SERVICES

    def get_service_by_id(self, service_id: int) -> Service:
        if service_id < 0 or service_id >= len(SERVICES):
            raise EntityNotFoundException(f"Service with id {service_id} not found")
        return SERVICES[service_id]

    def get_projects(self) -> List[Project]:
        return PROJECTS

    def get_project_by_id(self, project_id: int) -> Project:
        if project_id < 0 or project_id >= len(PROJECTS):
            raise EntityNotFoundException(f"Project with id {project_id} not found")
        return PROJECTS[project_id]

    def get_experience(self) -> List[Experience]:
        return EXPERIENCE

    def get_skills(self) -> List[SkillCategory]:
        return SKILLS

    def get_certificates(self) -> List[Certificate]:
        return CERTIFICATES

    def get_personal_facts(self) -> List[PersonalFact]:
        return PERSONAL_FACTS

    def get_contact_info(self) -> ContactInfo:
        return CONTACT_INFO

    def get_all_page_data(self) -> PageData:
        return PageData(
            hero=self.get_hero(),
            about=self.get_about(),
            services=self.get_services(),
            projects=self.get_projects(),
            experience=self.get_experience(),
            skills=self.get_skills(),
            certificates=self.get_certificates(),
            personal=self.get_personal_facts(),
            contact=self.get_contact_info()
        )