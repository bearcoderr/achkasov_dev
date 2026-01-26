# Use Cases для админки (запись/обновление)

"""Use Cases для админки"""
from src.application.services.admin_repository import IAdminRepository
from src.core.entities.page import AboutData, Project


class UpdateAboutUseCase:
    """Use Case: Обновить раздел О себе"""

    def __init__(self, repository: IAdminRepository):
        self.repository = repository

    def execute(self, about: AboutData) -> AboutData:
        """Выполнить обновление раздела О себе"""
        return self.repository.update_about(about)


class CreateProjectUseCase:
    """Use Case: Создать новый проект"""

    def __init__(self, repository: IAdminRepository):
        self.repository = repository

    def execute(self, project: Project) -> Project:
        """Выполнить создание нового проекта"""
        return self.repository.create_project(project)


class UpdateProjectUseCase:
    """Use Case: Обновить существующий проект"""

    def __init__(self, repository: IAdminRepository):
        self.repository = repository

    def execute(self, project_id: int, project: Project) -> Project:
        """Выполнить обновление проекта"""
        return self.repository.update_project(project_id, project)


class DeleteProjectUseCase:
    """Use Case: Удалить проект"""

    def __init__(self, repository: IAdminRepository):
        self.repository = repository

    def execute(self, project_id: int) -> bool:
        """Выполнить удаление проекта"""
        return self.repository.delete_project(project_id)