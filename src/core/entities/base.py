"""Базовые классы для доменных сущностей"""
from typing import Dict, Any
from dataclasses import dataclass


@dataclass
class LocalizedField:
    """Локализованное поле (ru/en)"""
    ru: str
    en: str

    def to_dict(self) -> Dict[str, str]:
        return {"ru": self.ru, "en": self.en}

    @classmethod
    def from_dict(cls, data: Dict[str, str]) -> "LocalizedField":
        return cls(ru=data["ru"], en=data["en"])


class DomainEntity:
    """Базовый класс для всех доменных сущностей"""

    def to_dict(self) -> Dict[str, Any]:
        """Конвертация в словарь для сериализации"""
        raise NotImplementedError

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "DomainEntity":
        """Создание из словаря"""
        raise NotImplementedError