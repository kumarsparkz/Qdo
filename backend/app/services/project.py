"""
Project service for project management operations.
"""
import logging
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.models.user import User
from app.repositories.project import ProjectRepository

logger = logging.getLogger(__name__)


class ProjectService:
    """Service for project operations."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.project_repo = ProjectRepository(db)

    async def get_project(self, project_id: UUID, user: User) -> Optional[Project]:
        """
        Get project by ID (with authorization check).

        Args:
            project_id: Project UUID
            user: Current user

        Returns:
            Project instance or None
        """
        return await self.project_repo.get_user_project(project_id, user.id)

    async def get_user_projects(
        self, user: User, skip: int = 0, limit: int = 100
    ) -> list[Project]:
        """
        Get all projects for a user.

        Args:
            user: Current user
            skip: Number of records to skip
            limit: Maximum number of records

        Returns:
            List of user's projects
        """
        return await self.project_repo.get_user_projects(user.id, skip, limit)

    async def count_user_projects(self, user: User) -> int:
        """
        Count user's projects.

        Args:
            user: Current user

        Returns:
            Number of projects
        """
        return await self.project_repo.count_user_projects(user.id)

    async def create_project(
        self, user: User, name: str, description: Optional[str] = None
    ) -> Project:
        """
        Create a new project.

        Args:
            user: Project owner
            name: Project name
            description: Project description

        Returns:
            Created project instance
        """
        project = await self.project_repo.create_project(
            user_id=user.id, name=name, description=description
        )

        logger.info(f"Project created: {project.name} (user: {user.email})")
        return project

    async def update_project(
        self,
        project: Project,
        user: User,
        name: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Project:
        """
        Update project.

        Args:
            project: Project instance
            user: Current user
            name: New name
            description: New description

        Returns:
            Updated project instance

        Raises:
            PermissionError: If user doesn't own the project
        """
        # Authorization check
        if project.user_id != user.id:
            raise PermissionError("Not authorized to update this project")

        updates = {}
        if name is not None:
            updates["name"] = name
        if description is not None:
            updates["description"] = description

        if updates:
            project = await self.project_repo.update(project, **updates)
            logger.info(f"Project updated: {project.name}")

        return project

    async def delete_project(self, project: Project, user: User) -> None:
        """
        Delete project (and all associated tasks).

        Args:
            project: Project instance
            user: Current user

        Raises:
            PermissionError: If user doesn't own the project
        """
        # Authorization check
        if project.user_id != user.id:
            raise PermissionError("Not authorized to delete this project")

        await self.project_repo.delete(project)
        logger.info(f"Project deleted: {project.name} (user: {user.email})")

    async def search_projects(
        self, user: User, query: str, skip: int = 0, limit: int = 100
    ) -> list[Project]:
        """
        Search user's projects.

        Args:
            user: Current user
            query: Search query
            skip: Number of records to skip
            limit: Maximum number of records

        Returns:
            List of matching projects
        """
        return await self.project_repo.search_user_projects(user.id, query, skip, limit)
