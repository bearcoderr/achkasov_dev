"""Pydantic схемы для админки (Request/Update DTOs)"""
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class UpdateAboutRequest(BaseModel):
    """Запрос на обновление раздела О себе"""
    title: Dict[str, str]
    text: Dict[str, str]


class CreateProjectRequest(BaseModel):
    """Запрос на создание проекта"""
    title: Dict[str, str]
    description: Dict[str, str]
    tech: List[str]
    demo_url: Optional[str] = None
    github_url: Optional[str] = None


class UpdateProjectRequest(BaseModel):
    """Запрос на обновление проекта"""
    title: Dict[str, str]
    description: Dict[str, str]
    tech: List[str]
    demo_url: Optional[str] = None
    github_url: Optional[str] = None


class ProjectResponse(BaseModel):
    """Ответ с данными проекта"""
    title: Dict[str, str]
    description: Dict[str, str]
    tech: List[str]
    demo_url: Optional[str] = None
    github_url: Optional[str] = None


class AboutResponse(BaseModel):
    """Ответ с данными раздела О себе"""
    title: Dict[str, str]
    text: Dict[str, str]

class SubmissionSchema(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: datetime  # Pydantic сериализует в ISO автоматически
    is_read: bool
    page_source: Optional[str] = None

class LoginRequest(BaseModel):
    """Вход запрос"""
    username: str
    password: str

class LoginResponse(BaseModel):
    """Вход ответ"""
    token: str