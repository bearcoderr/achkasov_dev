# Реализация IAdminRepository (запись)

"""Реализация репозитория для изменения данных (админка)"""
from src.application.services.admin_repository import IAdminRepository
from src.core.entities.page import AboutData, Project
from src.core.exceptions.domain import EntityNotFoundException
from src.infrastructure.db.static_data import ABOUT_DATA, PROJECTS


class AdminRepositoryImpl(IAdminRepository):
    """Реализация IAdminRepository с использованием статических данных"""

    def update_about(self, about: AboutData) -> AboutData:
        """
        В реальном проекте здесь была бы запись в БД
        Сейчас просто возвращаем обновленные данные
        """
        global ABOUT_DATA
        ABOUT_DATA = about
        return about

    def create_project(self, project: Project) -> Project:
        """Создать новый проект"""
        PROJECTS.append(project)
        return project

    def update_project(self, project_id: int, project: Project) -> Project:
        """Обновить существующий проект"""
        if project_id < 0 or project_id >= len(PROJECTS):
            raise EntityNotFoundException(f"Project with id {project_id} not found")

        PROJECTS[project_id] = project
        return project

    def delete_project(self, project_id: int) -> bool:
        """Удалить проект"""
        if project_id < 0 or project_id >= len(PROJECTS):
            raise EntityNotFoundException(f"Project with id {project_id} not found")

        PROJECTS.pop(project_id)
        return True