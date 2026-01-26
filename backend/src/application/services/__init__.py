"""Abstract interfaces (contracts)"""
from .page_repository import IPageRepository
from .admin_repository import IAdminRepository

__all__ = ["IPageRepository", "IAdminRepository"]