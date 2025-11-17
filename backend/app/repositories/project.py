"""
Project repository for database operations.
"""
from typing import Optional
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.models.task import Task
from app.repositories.base import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    """Repository for Project model operations."""

    def __init__(self, db: AsyncSession):
        super().__init__(Project, db)

    async def get_user_projects(
        self, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> list[Project]:
        """
        Get all projects for a user.

        Args:
            user_id: User UUID
            skip: Number of records to skip
            limit: Maximum number of records

        Returns:
            List of user's projects
        """
        return await self.get_multi(skip=skip, limit=limit, user_id=user_id)

    async def create_project(
        self, user_id: UUID, name: str, description: Optional[str] = None
    ) -> Project:
        """
        Create a new project for a user.

        Args:
            user_id: Owner user ID
            name: Project name
            description: Project description

        Returns:
            Created project instance
        """
        return await self.create(user_id=user_id, name=name, description=description)

    async def get_project_with_task_count(
        self, project_id: UUID
    ) -> Optional[tuple[Project, int]]:
        """
        Get project with task count.

        Args:
            project_id: Project UUID

        Returns:
            Tuple of (project, task_count) or None
        """
        result = await self.db.execute(
            select(Project, func.count(Task.id))
            .outerjoin(Task, Task.project_id == Project.id)
            .where(Project.id == project_id)
            .group_by(Project.id)
        )
        row = result.one_or_none()
        if row:
            return row[0], row[1]
        return None

    async def get_user_project(self, project_id: UUID, user_id: UUID) -> Optional[Project]:
        """
        Get a project by ID if it belongs to the user.

        Args:
            project_id: Project UUID
            user_id: User UUID

        Returns:
            Project instance or None
        """
        result = await self.db.execute(
            select(Project).where(Project.id == project_id, Project.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def count_user_projects(self, user_id: UUID) -> int:
        """
        Count total projects for a user.

        Args:
            user_id: User UUID

        Returns:
            Number of projects
        """
        return await self.count(user_id=user_id)

    async def search_user_projects(
        self, user_id: UUID, query: str, skip: int = 0, limit: int = 100
    ) -> list[Project]:
        """
        Search user's projects by name or description.

        Args:
            user_id: User UUID
            query: Search query
            skip: Number of records to skip
            limit: Maximum number of records

        Returns:
            List of matching projects
        """
        from sqlalchemy import or_

        search_pattern = f"%{query}%"
        result = await self.db.execute(
            select(Project)
            .where(
                Project.user_id == user_id,
                or_(
                    Project.name.ilike(search_pattern),
                    Project.description.ilike(search_pattern),
                ),
            )
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
