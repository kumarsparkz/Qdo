"""
Task repository for database operations.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task, TaskPriority, TaskStatus
from app.repositories.base import BaseRepository


class TaskRepository(BaseRepository[Task]):
    """Repository for Task model operations."""

    def __init__(self, db: AsyncSession):
        super().__init__(Task, db)

    async def get_user_tasks(
        self,
        user_id: UUID,
        project_id: Optional[UUID] = None,
        status: Optional[TaskStatus] = None,
        priority: Optional[TaskPriority] = None,
        is_urgent: Optional[bool] = None,
        is_important: Optional[bool] = None,
        quadrant: Optional[int] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Task]:
        """
        Get tasks for a user with optional filtering.

        Args:
            user_id: User UUID
            project_id: Filter by project
            status: Filter by status
            priority: Filter by priority
            is_urgent: Filter by urgency
            is_important: Filter by importance
            quadrant: Filter by Eisenhower quadrant (1-4)
            search: Search in title and description
            skip: Number of records to skip
            limit: Maximum number of records

        Returns:
            List of matching tasks
        """
        query = select(Task).where(Task.user_id == user_id)

        # Apply filters
        if project_id:
            query = query.where(Task.project_id == project_id)
        if status:
            query = query.where(Task.status == status)
        if priority:
            query = query.where(Task.priority == priority)
        if is_urgent is not None:
            query = query.where(Task.is_urgent == is_urgent)
        if is_important is not None:
            query = query.where(Task.is_important == is_important)

        # Quadrant filter
        if quadrant:
            if quadrant == 1:
                query = query.where(Task.is_urgent == True, Task.is_important == True)
            elif quadrant == 2:
                query = query.where(Task.is_urgent == False, Task.is_important == True)
            elif quadrant == 3:
                query = query.where(Task.is_urgent == True, Task.is_important == False)
            elif quadrant == 4:
                query = query.where(Task.is_urgent == False, Task.is_important == False)

        # Search filter
        if search:
            search_pattern = f"%{search}%"
            query = query.where(
                or_(
                    Task.title.ilike(search_pattern),
                    Task.description.ilike(search_pattern),
                )
            )

        # Order by created_at descending
        query = query.order_by(Task.created_at.desc())

        # Pagination
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_task(
        self,
        user_id: UUID,
        project_id: UUID,
        title: str,
        description: Optional[str] = None,
        is_urgent: bool = False,
        is_important: bool = False,
        status: TaskStatus = TaskStatus.TODO,
        priority: TaskPriority = TaskPriority.NICE_TO_HAVE,
        deadline: Optional[datetime] = None,
    ) -> Task:
        """
        Create a new task.

        Args:
            user_id: Owner user ID
            project_id: Project ID
            title: Task title
            description: Task description (supports Markdown)
            is_urgent: Is task urgent
            is_important: Is task important
            status: Task status
            priority: Task priority
            deadline: Task deadline

        Returns:
            Created task instance
        """
        return await self.create(
            user_id=user_id,
            project_id=project_id,
            title=title,
            description=description,
            is_urgent=is_urgent,
            is_important=is_important,
            status=status,
            priority=priority,
            deadline=deadline,
        )

    async def get_user_task(self, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """
        Get a task by ID if it belongs to the user.

        Args:
            task_id: Task UUID
            user_id: User UUID

        Returns:
            Task instance or None
        """
        result = await self.db.execute(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def count_user_tasks(
        self,
        user_id: UUID,
        project_id: Optional[UUID] = None,
        status: Optional[TaskStatus] = None,
        quadrant: Optional[int] = None,
    ) -> int:
        """
        Count user tasks with optional filtering.

        Args:
            user_id: User UUID
            project_id: Filter by project
            status: Filter by status
            quadrant: Filter by quadrant

        Returns:
            Number of matching tasks
        """
        from sqlalchemy import func

        query = select(func.count()).select_from(Task).where(Task.user_id == user_id)

        if project_id:
            query = query.where(Task.project_id == project_id)
        if status:
            query = query.where(Task.status == status)

        # Quadrant filter
        if quadrant:
            if quadrant == 1:
                query = query.where(Task.is_urgent == True, Task.is_important == True)
            elif quadrant == 2:
                query = query.where(Task.is_urgent == False, Task.is_important == True)
            elif quadrant == 3:
                query = query.where(Task.is_urgent == True, Task.is_important == False)
            elif quadrant == 4:
                query = query.where(Task.is_urgent == False, Task.is_important == False)

        result = await self.db.execute(query)
        return result.scalar_one()

    async def get_overdue_tasks(self, user_id: UUID) -> list[Task]:
        """
        Get overdue tasks for a user.

        Args:
            user_id: User UUID

        Returns:
            List of overdue tasks
        """
        now = datetime.utcnow()
        result = await self.db.execute(
            select(Task).where(
                and_(
                    Task.user_id == user_id,
                    Task.deadline < now,
                    Task.status != TaskStatus.DONE,
                )
            )
        )
        return list(result.scalars().all())

    async def move_to_quadrant(
        self, task: Task, is_urgent: bool, is_important: bool
    ) -> Task:
        """
        Move task to a different quadrant.

        Args:
            task: Task instance
            is_urgent: New urgency value
            is_important: New importance value

        Returns:
            Updated task instance
        """
        return await self.update(task, is_urgent=is_urgent, is_important=is_important)

    async def update_task_status(self, task: Task, status: TaskStatus) -> Task:
        """
        Update task status.

        Args:
            task: Task instance
            status: New status

        Returns:
            Updated task instance
        """
        return await self.update(task, status=status)
