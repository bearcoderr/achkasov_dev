"""Dependency Injection для FastAPI"""
from fastapi import Depends
from sqlalchemy.orm import Session

from src.infrastructure.db.repositories.page_repo_impl import PageRepositoryImpl
from src.infrastructure.db.repositories.admin_repo_impl import AdminRepositoryImpl
from src.infrastructure.db.database import get_db  # <- твой генератор сессий

from src.application.use_cases.page.get_page_data import (
    GetPageDataUseCase, GetHeroUseCase, GetAboutUseCase,
    GetServicesUseCase, GetServiceByIdUseCase,
    GetProjectsUseCase, GetProjectByIdUseCase,
    GetExperienceUseCase, GetSkillsUseCase,
    GetCertificatesUseCase, GetPersonalFactsUseCase,
    GetContactInfoUseCase
)
from src.application.use_cases.admin.update_about import (
    UpdateAboutUseCase, CreateProjectUseCase,
    UpdateProjectUseCase, DeleteProjectUseCase
)


# ===== Репозитории через DI =====
def get_page_repository(db: Session = Depends(get_db)) -> PageRepositoryImpl:
    return PageRepositoryImpl(db_session=db)

def get_admin_repository(db: Session = Depends(get_db)) -> AdminRepositoryImpl:
    return AdminRepositoryImpl(db_session=db)


# ===== PUBLIC USE CASES =====
def get_page_data_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetPageDataUseCase:
    return GetPageDataUseCase(page_repo)

def get_hero_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetHeroUseCase:
    return GetHeroUseCase(page_repo)

def get_about_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetAboutUseCase:
    return GetAboutUseCase(page_repo)

def get_services_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetServicesUseCase:
    return GetServicesUseCase(page_repo)

def get_service_by_id_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetServiceByIdUseCase:
    return GetServiceByIdUseCase(page_repo)

def get_projects_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetProjectsUseCase:
    return GetProjectsUseCase(page_repo)

def get_project_by_id_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetProjectByIdUseCase:
    return GetProjectByIdUseCase(page_repo)

def get_experience_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetExperienceUseCase:
    return GetExperienceUseCase(page_repo)

def get_skills_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetSkillsUseCase:
    return GetSkillsUseCase(page_repo)

def get_certificates_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetCertificatesUseCase:
    return GetCertificatesUseCase(page_repo)

def get_personal_facts_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetPersonalFactsUseCase:
    return GetPersonalFactsUseCase(page_repo)

def get_contact_info_use_case(page_repo: PageRepositoryImpl = Depends(get_page_repository)) -> GetContactInfoUseCase:
    return GetContactInfoUseCase(page_repo)


# ===== ADMIN USE CASES =====
def get_update_about_use_case(admin_repo: AdminRepositoryImpl = Depends(get_admin_repository)) -> UpdateAboutUseCase:
    return UpdateAboutUseCase(admin_repo)

def get_create_project_use_case(admin_repo: AdminRepositoryImpl = Depends(get_admin_repository)) -> CreateProjectUseCase:
    return CreateProjectUseCase(admin_repo)

def get_update_project_use_case(admin_repo: AdminRepositoryImpl = Depends(get_admin_repository)) -> UpdateProjectUseCase:
    return UpdateProjectUseCase(admin_repo)

def get_delete_project_use_case(admin_repo: AdminRepositoryImpl = Depends(get_admin_repository)) -> DeleteProjectUseCase:
    return DeleteProjectUseCase(admin_repo)
