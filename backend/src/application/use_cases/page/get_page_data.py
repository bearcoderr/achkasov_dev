# Получить все данные для главной страницы
"""Use Case для получения всех данных страницы"""
from src.application.services.page_repository import IPageRepository
from src.core.entities.page import PageData


class GetPageDataUseCase:
    """Use Case: Получить все данные для главной страницы"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self) -> PageData:
        """Выполнить получение всех данных страницы"""
        return self.repository.get_all_page_data()


class GetHeroUseCase:
    """Use Case: Получить данные Hero секции"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self):
        return self.repository.get_hero()


class GetAboutUseCase:
    """Use Case: Получить информацию О себе"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self):
        return self.repository.get_about()


class GetServicesUseCase:
    """Use Case: Получить список услуг"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self):
        return self.repository.get_services()


class GetServiceByIdUseCase:
    """Use Case: Получить конкретную услугу"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self, service_id: int):
        return self.repository.get_service_by_id(service_id)


class GetProjectsUseCase:
    """Use Case: Получить список проектов"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self):
        return self.repository.get_projects()


class GetProjectByIdUseCase:
    """Use Case: Получить конкретный проект"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self, project_id: int):
        return self.repository.get_project_by_id(project_id)


class GetExperienceUseCase:
    """Use Case: Получить опыт работы"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self):
        return self.repository.get_experience()


class GetSkillsUseCase:
    """Use Case: Получить навыки"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self):
        return self.repository.get_skills()


class GetCertificatesUseCase:
    """Use Case: Получить сертификаты"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self):
        return self.repository.get_certificates()


class GetPersonalFactsUseCase:
    """Use Case: Получить личные факты"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self):
        return self.repository.get_personal_facts()


class GetContactInfoUseCase:
    """Use Case: Получить контактную информацию"""

    def __init__(self, repository: IPageRepository):
        self.repository = repository

    def execute(self):
        return self.repository.get_contact_info()