"""Интерфейс репозитория для чтения данных страницы"""
from abc import ABC, abstractmethod
from typing import List
from src.core.entities.page import (
    HeroData, AboutData, Service, Project,
    Experience, SkillCategory, Certificate,
    PersonalFact, ContactInfo, PageData
)


class IPageRepository(ABC):
    """Контракт для чтения всех данных резюме"""

    @abstractmethod
    def get_hero(self) -> HeroData:
        """Получить данные Hero секции"""
        pass

    @abstractmethod
    def get_about(self) -> AboutData:
        """Получить информацию О себе"""
        pass

    @abstractmethod
    def get_services(self) -> List[Service]:
        """Получить список услуг"""
        pass

    @abstractmethod
    def get_service_by_id(self, service_id: int) -> Service:
        """Получить конкретную услугу"""
        pass

    @abstractmethod
    def get_projects(self) -> List[Project]:
        """Получить список проектов"""
        pass

    @abstractmethod
    def get_project_by_id(self, project_id: int) -> Project:
        """Получить конкретный проект"""
        pass

    @abstractmethod
    def get_experience(self) -> List[Experience]:
        """Получить опыт работы"""
        pass

    @abstractmethod
    def get_skills(self) -> List[SkillCategory]:
        """Получить навыки"""
        pass

    @abstractmethod
    def get_certificates(self) -> List[Certificate]:
        """Получить сертификаты"""
        pass

    @abstractmethod
    def get_personal_facts(self) -> List[PersonalFact]:
        """Получить личные факты"""
        pass

    @abstractmethod
    def get_contact_info(self) -> ContactInfo:
        """Получить контактную информацию"""
        pass

    @abstractmethod
    def get_all_page_data(self) -> PageData:
        """Получить все данные страницы одним запросом"""
        pass