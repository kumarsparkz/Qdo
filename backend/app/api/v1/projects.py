"""
Project management API endpoints.
"""
import logging
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_active_user
from app.db.session import get_db
from app.models.schemas import (
    PaginationParams,
    ProjectCreate,
    ProjectListResponse,
    ProjectResponse,
    ProjectUpdate,
)
from app.models.user import User
from app.services.project import ProjectService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get(
    "",
    response_model=ProjectListResponse,
    summary="Get user projects",
    description="Get all projects for the authenticated user with pagination",
)
async def get_projects(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get user projects with pagination and optional search.

    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records (default: 100, max: 1000)
    - **search**: Optional search query
    """
    project_service = ProjectService(db)

    # Get projects (with search if provided)
    if search:
        projects = await project_service.search_projects(
            user=current_user, query=search, skip=skip, limit=limit
        )
    else:
        projects = await project_service.get_user_projects(
            user=current_user, skip=skip, limit=limit
        )

    # Get total count
    total = await project_service.count_user_projects(current_user)

    return ProjectListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=projects,
    )


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new project",
)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new project.

    - **name**: Project name (required)
    - **description**: Project description (optional)
    """
    project_service = ProjectService(db)

    try:
        project = await project_service.create_project(
            user=current_user,
            name=project_data.name,
            description=project_data.description,
        )

        await db.commit()
        return project

    except Exception as e:
        await db.rollback()
        logger.error(f"Project creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create project",
        )


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Get project by ID",
)
async def get_project(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get project details by ID."""
    project_service = ProjectService(db)

    project = await project_service.get_project(project_id, current_user)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Update project",
)
async def update_project(
    project_id: UUID,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update project.

    - **name**: New project name
    - **description**: New project description
    """
    project_service = ProjectService(db)

    # Get project
    project = await project_service.get_project(project_id, current_user)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    try:
        project = await project_service.update_project(
            project=project,
            user=current_user,
            name=project_data.name,
            description=project_data.description,
        )

        await db.commit()
        return project

    except PermissionError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Project update error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update project",
        )


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete project",
)
async def delete_project(
    project_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete project and all associated tasks.

    WARNING: This action cannot be undone.
    """
    project_service = ProjectService(db)

    # Get project
    project = await project_service.get_project(project_id, current_user)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    try:
        await project_service.delete_project(project, current_user)
        await db.commit()

    except PermissionError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Project deletion error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete project",
        )
