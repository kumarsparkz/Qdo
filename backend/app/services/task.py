"""
Task service for task management operations with Eisenhower Matrix support.
"""
import logging
from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task, TaskPriority, TaskStatus
from app.models.user import User
from app.repositories.project import ProjectRepository
from app.repositories.task import TaskRepository

logger = logging.getLogger(__name__)


class TaskService:
    """Service for task operations."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.task_repo = TaskRepository(db)
        self.project_repo = ProjectRepository(db)

    async def get_task(self, task_id: UUID, user: User) -> Optional[Task]:
        """
        Get task by ID (with authorization check).

        Args:
            task_id: Task UUID
            user: Current user

        Returns:
            Task instance or None
        """
        return await self.task_repo.get_user_task(task_id, user.id)

    async def get_user_tasks(
        self,
        user: User,
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
        Get tasks for a user with filtering.

        Args:
            user: Current user
            project_id: Filter by project
            status: Filter by status
            priority: Filter by priority
            is_urgent: Filter by urgency
            is_important: Filter by importance
            quadrant: Filter by Eisenhower quadrant (1-4)
            search: Search query
            skip: Number of records to skip
            limit: Maximum number of records

        Returns:
            List of tasks
        """
        return await self.task_repo.get_user_tasks(
            user_id=user.id,
            project_id=project_id,
            status=status,
            priority=priority,
            is_urgent=is_urgent,
            is_important=is_important,
            quadrant=quadrant,
            search=search,
            skip=skip,
            limit=limit,
        )

    async def count_user_tasks(
        self,
        user: User,
        project_id: Optional[UUID] = None,
        status: Optional[TaskStatus] = None,
        quadrant: Optional[int] = None,
    ) -> int:
        """
        Count user tasks with filtering.

        Args:
            user: Current user
            project_id: Filter by project
            status: Filter by status
            quadrant: Filter by quadrant

        Returns:
            Number of tasks
        """
        return await self.task_repo.count_user_tasks(
            user_id=user.id, project_id=project_id, status=status, quadrant=quadrant
        )

    async def create_task(
        self,
        user: User,
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
            user: Task owner
            project_id: Project ID
            title: Task title
            description: Task description
            is_urgent: Is task urgent
            is_important: Is task important
            status: Task status
            priority: Task priority
            deadline: Task deadline

        Returns:
            Created task instance

        Raises:
            PermissionError: If user doesn't own the project
        """
        # Verify project ownership
        project = await self.project_repo.get_user_project(project_id, user.id)
        if not project:
            raise PermissionError("Project not found or access denied")

        task = await self.task_repo.create_task(
            user_id=user.id,
            project_id=project_id,
            title=title,
            description=description,
            is_urgent=is_urgent,
            is_important=is_important,
            status=status,
            priority=priority,
            deadline=deadline,
        )

        logger.info(
            f"Task created: {task.title} (quadrant: {task.quadrant}, user: {user.email})"
        )
        return task

    async def update_task(
        self,
        task: Task,
        user: User,
        title: Optional[str] = None,
        description: Optional[str] = None,
        is_urgent: Optional[bool] = None,
        is_important: Optional[bool] = None,
        status: Optional[TaskStatus] = None,
        priority: Optional[TaskPriority] = None,
        deadline: Optional[datetime] = None,
        project_id: Optional[UUID] = None,
    ) -> Task:
        """
        Update task.

        Args:
            task: Task instance
            user: Current user
            title: New title
            description: New description
            is_urgent: New urgency
            is_important: New importance
            status: New status
            priority: New priority
            deadline: New deadline
            project_id: New project ID

        Returns:
            Updated task instance

        Raises:
            PermissionError: If user doesn't own the task or target project
        """
        # Authorization check
        if task.user_id != user.id:
            raise PermissionError("Not authorized to update this task")

        # If changing project, verify new project ownership
        if project_id is not None and project_id != task.project_id:
            project = await self.project_repo.get_user_project(project_id, user.id)
            if not project:
                raise PermissionError("Target project not found or access denied")

        updates = {}
        if title is not None:
            updates["title"] = title
        if description is not None:
            updates["description"] = description
        if is_urgent is not None:
            updates["is_urgent"] = is_urgent
        if is_important is not None:
            updates["is_important"] = is_important
        if status is not None:
            updates["status"] = status
        if priority is not None:
            updates["priority"] = priority
        if deadline is not None:
            updates["deadline"] = deadline
        if project_id is not None:
            updates["project_id"] = project_id

        if updates:
            task = await self.task_repo.update(task, **updates)
            logger.info(f"Task updated: {task.title} (quadrant: {task.quadrant})")

        return task

    async def move_to_quadrant(
        self, task: Task, user: User, is_urgent: bool, is_important: bool
    ) -> Task:
        """
        Move task to a different Eisenhower quadrant.

        Args:
            task: Task instance
            user: Current user
            is_urgent: New urgency value
            is_important: New importance value

        Returns:
            Updated task instance

        Raises:
            PermissionError: If user doesn't own the task
        """
        # Authorization check
        if task.user_id != user.id:
            raise PermissionError("Not authorized to update this task")

        task = await self.task_repo.move_to_quadrant(task, is_urgent, is_important)
        logger.info(f"Task moved to quadrant {task.quadrant}: {task.title}")
        return task

    async def update_status(self, task: Task, user: User, status: TaskStatus) -> Task:
        """
        Update task status.

        Args:
            task: Task instance
            user: Current user
            status: New status

        Returns:
            Updated task instance

        Raises:
            PermissionError: If user doesn't own the task
        """
        # Authorization check
        if task.user_id != user.id:
            raise PermissionError("Not authorized to update this task")

        task = await self.task_repo.update_task_status(task, status)
        logger.info(f"Task status updated to {status.value}: {task.title}")
        return task

    async def delete_task(self, task: Task, user: User) -> None:
        """
        Delete task.

        Args:
            task: Task instance
            user: Current user

        Raises:
            PermissionError: If user doesn't own the task
        """
        # Authorization check
        if task.user_id != user.id:
            raise PermissionError("Not authorized to delete this task")

        await self.task_repo.delete(task)
        logger.info(f"Task deleted: {task.title} (user: {user.email})")

    async def get_overdue_tasks(self, user: User) -> list[Task]:
        """
        Get overdue tasks for a user.

        Args:
            user: Current user

        Returns:
            List of overdue tasks
        """
        return await self.task_repo.get_overdue_tasks(user.id)
