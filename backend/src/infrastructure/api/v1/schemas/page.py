"""Pydantic схемы для API фронтенда (Response DTOs)"""
from pydantic import BaseModel
from typing import List, Optional, Dict


class LocalizedFieldSchema(BaseModel):
    ru: str
    en: str



class HeroDataSchema(BaseModel):
    greeting: LocalizedFieldSchema
    img: str
    name: LocalizedFieldSchema
    title: LocalizedFieldSchema
    subtitle: LocalizedFieldSchema
    cv_url: str
    social_links: Dict[str, str]


class AboutDataSchema(BaseModel):
    title: Dict[str, str]
    text: Dict[str, str]


class ServiceSchema(BaseModel):
    title: LocalizedFieldSchema
    description: LocalizedFieldSchema
    details: Dict[str, List[str]]


class ProjectSchema(BaseModel):
    title: Dict[str, str]
    description: Dict[str, str]
    tech: List[str]
    demo_url: Optional[str] = None
    github_url: Optional[str] = None


class ExperienceSchema(BaseModel):
    period: Dict[str, str]
    position: Dict[str, str]
    company: str
    description: Dict[str, str]


class SkillCategorySchema(BaseModel):
    name: Dict[str, str]
    items: Dict[str, List[str]]


class CertificateSchema(BaseModel):
    title: Dict[str, str]
    provider: str
    description: Dict[str, str]
    image_url: str
    issue_date: str


class PersonalFactSchema(BaseModel):
    emoji: str
    title: Dict[str, str]
    description: Dict[str, str]


class ContactInfoSchema(BaseModel):
    title: Dict[str, str]
    description: Dict[str, str]
    email: str
    phone: str
    location: Dict[str, str]


class PageDataSchema(BaseModel):
    hero: HeroDataSchema
    about: AboutDataSchema
    services: List[ServiceSchema]
    projects: List[ProjectSchema]
    experience: List[ExperienceSchema]
    skills: List[SkillCategorySchema]
    certificates: List[CertificateSchema]
    personal: List[PersonalFactSchema]
    contact: ContactInfoSchema

class ContactFormSchema(BaseModel):
    name: str
    email: str
    message: str

