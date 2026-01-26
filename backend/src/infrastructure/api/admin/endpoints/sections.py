# (PUT /about, POST /projects)
"""API endpoints для админки (protected)"""
from fastapi import APIRouter, Depends, HTTPException

from src.application.use_cases.admin.update_about import (
    UpdateAboutUseCase, CreateProjectUseCase,
    UpdateProjectUseCase, DeleteProjectUseCase
)
from src.infrastructure.api.admin.schemas.admin_schemas import (
    UpdateAboutRequest, CreateProjectRequest,
    UpdateProjectRequest, ProjectResponse, AboutResponse,
    SubmissionSchema, LoginRequest, LoginResponse
)

from src.infrastructure.db.models import LoginRequest as LoginRequestModel


from src.infrastructure.api.dependencies import (
    get_update_about_use_case, get_create_project_use_case,
    get_update_project_use_case, get_delete_project_use_case
)
from src.core.entities.page import AboutData, Project
from src.core.entities.base import LocalizedField
from src.core.exceptions.domain import EntityNotFoundException


from sqlalchemy.orm import Session
from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import ContactMessage


from passlib.context import CryptContext
import jwt
import datetime

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
SECRET_KEY = "super-secret-key"  # поменять на env переменную
router = APIRouter(prefix="/admin", tags=["Admin"])  # Теперь так

import logging

logger = logging.getLogger(__name__)


@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for username: {req.username}")

    user = db.query(LoginRequestModel).filter(
        LoginRequestModel.username == req.username
    ).first()

    if not user:
        logger.warning(f"User not found: {req.username}")
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    logger.info(f"User found: {user.username}")
    logger.info(f"Hash from DB starts with: {user.hashed_password[:20]}")
    logger.info(f"Password length: {len(req.password)}")

    is_valid = pwd_context.verify(req.password, user.hashed_password)
    logger.info(f"Password verification result: {is_valid}")

    if not is_valid:
        logger.warning("Password verification failed")
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    # создаём JWT
    payload = {
        "sub": user.username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return {"token": token}

@router.put("/about", response_model=AboutResponse)
def update_about(
        request: UpdateAboutRequest,
        use_case: UpdateAboutUseCase = Depends(get_update_about_use_case)
):
    """Обновить раздел О себе"""
    about = AboutData(
        title=LocalizedField.from_dict(request.title),
        text=LocalizedField.from_dict(request.text)
    )

    updated = use_case.execute(about)
    return updated.to_dict()


@router.post("/projects", response_model=ProjectResponse)
def create_project(
        request: CreateProjectRequest,
        use_case: CreateProjectUseCase = Depends(get_create_project_use_case)
):
    """Создать новый проект"""
    project = Project(
        title=LocalizedField.from_dict(request.title),
        description=LocalizedField.from_dict(request.description),
        tech=request.tech,
        demo_url=request.demo_url,
        github_url=request.github_url
    )

    created = use_case.execute(project)
    return created.to_dict()


@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
        project_id: int,
        request: UpdateProjectRequest,
        use_case: UpdateProjectUseCase = Depends(get_update_project_use_case)
):
    """Обновить существующий проект"""
    project = Project(
        title=LocalizedField.from_dict(request.title),
        description=LocalizedField.from_dict(request.description),
        tech=request.tech,
        demo_url=request.demo_url,
        github_url=request.github_url
    )

    try:
        updated = use_case.execute(project_id, project)
        return updated.to_dict()
    except EntityNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/projects/{project_id}")
def delete_project(
        project_id: int,
        use_case: DeleteProjectUseCase = Depends(get_delete_project_use_case)
):
    """Удалить проект"""
    try:
        success = use_case.execute(project_id)
        return {"success": success, "message": "Project deleted"}
    except EntityNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/submissions", response_model=list[SubmissionSchema])
def get_submissions(db: Session = Depends(get_db)):
    submissions = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return submissions

@router.put("/submissions/{submission_id}/read")
def mark_read(submission_id: int, db: Session = Depends(get_db)):
    submission = db.query(ContactMessage).get(submission_id)
    if not submission:
        return {"error": "Not found"}
    submission.read = True
    db.commit()
    return submission


