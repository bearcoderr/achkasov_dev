"""Доменные исключения"""


class DomainException(Exception):
    """Базовое исключение для доменной логики"""
    pass


class EntityNotFoundException(DomainException):
    """Сущность не найдена"""
    pass


class ValidationException(DomainException):
    """Ошибка валидации данных"""
    pass


class RepositoryException(DomainException):
    """Ошибка при работе с репозиторием"""
    pass