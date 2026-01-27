"""Реализация репозитория для чтения данных"""
from typing import List
from src.application.services.page_repository import IPageRepository
from src.core.entities.page import (
    HeroData, AboutData, Service as ServiceEntity, Project as ProjectEntity,
    SkillCategory, CertificateEntity, Experience as ExperienceEntity,
    PersonalFact, ContactInfo, PageData, LocalizedField, LocalizedList, ContactInfo, FooterInfo
)
from src.core.exceptions.domain import EntityNotFoundException

from src.infrastructure.db.models import Hero, About, Service as ServiceModel, Project as ProjectModel, Experience as ExperienceModel, Skills, Certificate, Personal, Settings

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

    def get_services(self) -> List[ServiceEntity]:
        services_rows = self.db.query(ServiceModel).all()
        if not services_rows:
            raise EntityNotFoundException("Services not found")

        return [
            ServiceEntity(
                title=LocalizedField(ru=row.title_ru, en=row.title_en),
                description=LocalizedField(ru=row.description_ru, en=row.description_en),
                details=LocalizedList(ru=row.details_ru, en=row.details_en),  # ← Изменено на LocalizedList
            )
            for row in services_rows
        ]

    def get_service_by_id(self, service_id: int) -> ServiceEntity:
        services_rows = self.db.query(ServiceModel).all()
        if not services_rows:
            raise EntityNotFoundException("Services not found")

        if service_id < 0 or service_id >= len(services_rows):
            raise EntityNotFoundException(f"Service with id {service_id} not found")

        row = services_rows[service_id]
        return ServiceEntity(
            title=LocalizedField(ru=row.title_ru, en=row.title_en),
            description=LocalizedField(ru=row.description_ru, en=row.description_en),
            details=LocalizedList(ru=row.details_ru, en=row.details_en),  # ← Изменено на LocalizedList
        )

    def get_projects(self) -> List[ProjectEntity]:
        project_rows = self.db.query(ProjectModel).all()
        if not project_rows:
            return []

        return [
            ProjectEntity(
                title=LocalizedField(ru=row.title_ru, en=row.title_en),
                description=LocalizedField(ru=row.description_ru, en=row.description_en),
                tech=row.tech,  # Передаем список технологий
                demo_url=row.demo_url,
                github_url=row.github_url
            ) for row in project_rows
        ]

    def get_project_by_id(self, project_id: int) -> ProjectEntity:
        project_rows = self.db.query(ProjectModel).all()

        if not project_rows:
            raise EntityNotFoundException("Projects not found")

        if project_id < 0 or project_id >= len(project_rows):
            raise EntityNotFoundException(f"Project with id {project_id} not found")

        row = project_rows[project_id]

        return ProjectEntity(
            title=LocalizedField(ru=row.title_ru, en=row.title_en),
            description=LocalizedField(ru=row.description_ru, en=row.description_en),
            tech=row.tech,
            demo_url=row.demo_url,
            github_url=row.github_url
        )

    def get_experience(self) -> List[ExperienceEntity]:
        experience_rows = self.db.query(ExperienceModel).all()
        if not experience_rows:
            return []

        return [
            ExperienceEntity(
                period=LocalizedField(ru=row.period_ru, en=row.period_en),
                company=row.company_ru,
                position=LocalizedField(ru=row.position_ru, en=row.position_en),
                description=LocalizedField(ru=row.description_ru, en=row.description_en),
            ) for row in experience_rows
        ]

    def get_skills(self) -> List[SkillCategory]:
        skill_row = self.db.query(Skills).all()
        if not skill_row:
            return []

        return [
            SkillCategory(
                name=LocalizedField(ru=row.title_ru, en=row.title_en),
                items=LocalizedList(ru=row.listSkills_ru, en=row.listSkills_en),
            )for row in skill_row
        ]

    def get_certificates(self) -> List[CertificateEntity]:
        certificate_rows = self.db.query(Certificate).all()
        if not certificate_rows:
            raise EntityNotFoundException("Certificate not found")

        return [
            CertificateEntity(
                title=LocalizedField(ru=row.title_ru, en=row.title_en),
                provider=row.provider,
                description=LocalizedField(ru=row.description_ru, en=row.description_en),
                image_url=row.image_url,
                issue_date=row.issue_date,
            )for row in certificate_rows
        ]

    def get_personal_facts(self) -> List[PersonalFact]:
        personal_facts_rows = self.db.query(Personal).all()
        if not personal_facts_rows:
            raise EntityNotFoundException("PersonalFact not found")

        return [
            PersonalFact(
                emoji=row.emoji,
                title=LocalizedField(ru=row.title_ru, en=row.title_en),
                description=LocalizedField(ru=row.description_ru, en=row.description_en),
            )for row in personal_facts_rows
        ]

    def get_contact_info(self) -> ContactInfo:
        contact_row = self.db.query(Settings).first()
        if not contact_row:
            raise EntityNotFoundException("Hero not found")

        return ContactInfo(
                title=LocalizedField(ru=contact_row.title_text_footer_ru, en=contact_row.title_text_footer_en),
                description=LocalizedField(ru=contact_row.desc_text_footer_ru, en=contact_row.desc_text_footer_en),
                email=contact_row.email,
                phone=contact_row.phone,
                location=LocalizedField(ru=contact_row.location_ru, en=contact_row.location_en),
            )

    def get_footer_info(self) -> FooterInfo:
        footer_row = self.db.query(Settings).first()
        if not footer_row:
            raise EntityNotFoundException("Footer info not found")

        return FooterInfo(
            rights=LocalizedField(ru=footer_row.footer_info_ru, en=footer_row.footer_info_en),
            privacy=LocalizedField(ru="footer_row.privacy_policy_ru", en="footer_row.privacy_policy_en"),
        )


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
            contact=self.get_contact_info(),
            footer=self.get_footer_info()
        )