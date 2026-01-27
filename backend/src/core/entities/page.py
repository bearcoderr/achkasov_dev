"""Доменные сущности для главной страницы"""
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from .base import LocalizedField, LocalizedList, DomainEntity


@dataclass
class HeroData(DomainEntity):
    """Hero секция"""
    greeting: LocalizedField
    img: str
    name: LocalizedField
    title: LocalizedField
    subtitle: LocalizedField
    cv_url: str
    social_links: Dict[str, str]  # github, linkedin, telegram

    def to_dict(self) -> Dict[str, Any]:
        return {
            "greeting": self.greeting.to_dict(),
            "img": self.img,
            "name": self.name,
            "title": self.title.to_dict(),
            "subtitle": self.subtitle.to_dict(),
            "cv_url": self.cv_url,
            "social_links": self.social_links
        }


@dataclass
class AboutData(DomainEntity):
    """О себе"""
    title: LocalizedField
    text: LocalizedField

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title.to_dict(),
            "text": self.text.to_dict()
        }


@dataclass
class Service(DomainEntity):
    """Услуга"""
    title: LocalizedField
    description: LocalizedField
    details: LocalizedList

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title.to_dict(),
            "description": self.description.to_dict(),
            "details": self.details.to_dict(),
        }


@dataclass
class Project(DomainEntity):
    """Проект"""
    title: LocalizedField
    description: LocalizedField
    tech: List[str]
    demo_url: Optional[str] = None
    github_url: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title.to_dict(),
            "description": self.description.to_dict(),
            "tech": self.tech,
            "demo_url": self.demo_url,
            "github_url": self.github_url
        }


@dataclass
class Experience(DomainEntity):
    """Опыт работы"""
    period: LocalizedField
    position: LocalizedField
    company: str
    description: LocalizedField

    def to_dict(self) -> Dict[str, Any]:
        return {
            "period": self.period.to_dict(),
            "position": self.position.to_dict(),
            "company": self.company,
            "description": self.description.to_dict()
        }


@dataclass
class SkillCategory(DomainEntity):
    """Категория навыков"""
    name: LocalizedField
    items: LocalizedList

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name.to_dict(),
            "items": self.items.to_dict(),
        }


@dataclass
class CertificateEntity(DomainEntity):
    """Сертификат"""
    title: LocalizedField
    provider: str
    description: LocalizedField
    image_url: str
    issue_date: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title.to_dict(),
            "provider": self.provider,
            "description": self.description.to_dict(),
            "image_url": self.image_url,
            "issue_date": self.issue_date
        }


@dataclass
class PersonalFact(DomainEntity):
    """Личный факт"""
    emoji: str
    title: LocalizedField
    description: LocalizedField

    def to_dict(self) -> Dict[str, Any]:
        return {
            "emoji": self.emoji,
            "title": self.title.to_dict(),
            "description": self.description.to_dict()
        }


@dataclass
class ContactInfo(DomainEntity):
    """Контактная информация"""
    title: LocalizedField
    description: LocalizedField
    email: str
    phone: str
    location: LocalizedField

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title.to_dict(),
            "description": self.description.to_dict(),
            "email": self.email,
            "phone": self.phone,
            "location": self.location.to_dict(),
        }

@dataclass
class FooterInfo:
    """Данные для Footer (подвал сайта)"""
    rights: LocalizedField  # "Все права защищены"
    privacy: LocalizedField  # "Политика конфиденциальности"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "rights": self.rights,
            "privacy": self.privacy,
        }

@dataclass
class PageData(DomainEntity):
    """Все данные страницы"""
    hero: HeroData
    about: AboutData
    services: List[Service]
    projects: List[Project]
    experience: List[Experience]
    skills: List[SkillCategory]
    certificates: List[CertificateEntity]
    personal: List[PersonalFact]
    contact: ContactInfo
    footer: FooterInfo

    def to_dict(self) -> Dict[str, Any]:
        return {
            "hero": self.hero.to_dict(),
            "about": self.about.to_dict(),
            "services": [s.to_dict() for s in self.services],
            "projects": [p.to_dict() for p in self.projects],
            "experience": [e.to_dict() for e in self.experience],
            "skills": [s.to_dict() for s in self.skills],
            "certificates": [c.to_dict() for c in self.certificates],
            "personal": [p.to_dict() for p in self.personal],
            "contact": self.contact.to_dict(),
            "footer": self.footer.to_dict()
        }