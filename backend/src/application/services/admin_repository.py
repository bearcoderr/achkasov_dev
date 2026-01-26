"""Интерфейс репозитория для изменения данных (админка)"""
from abc import ABC, abstractmethod
from src.core.entities.page import AboutData, Project


class IAdminRepository(ABC):
    """Контракт для записи/обновления данных"""

    @abstractmethod
    def update_about(self, about: AboutData) -> AboutData:
        """Обновить раздел О себе"""
        pass

    @abstractmethod
    def create_project(self, project: Project) -> Project:
        """Создать новый проект"""
        pass

    @abstractmethod
    def update_project(self, project_id: int, project: Project) -> Project:
        """Обновить существующий проект"""
        pass

    @abstractmethod
    def delete_project(self, project_id: int) -> bool:
        """Удалить проект"""
        pass