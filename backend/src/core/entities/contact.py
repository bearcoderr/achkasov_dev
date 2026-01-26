"""Сущности для контактной формы"""
from dataclasses import dataclass
from datetime import datetime
from .base import DomainEntity


@dataclass
class ContactForm(DomainEntity):
    """Форма обратной связи"""
    name: str
    email: str
    message: str
    timestamp: datetime = None

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()

    def validate(self) -> None:
        """Валидация формы"""
        if not self.name or len(self.name.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")

        if not self.email or "@" not in self.email:
            raise ValueError("Invalid email format")

        if not self.message or len(self.message.strip()) < 10:
            raise ValueError("Message must be at least 10 characters")