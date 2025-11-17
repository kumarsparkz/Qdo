"""
Task management API endpoints with Eisenhower Matrix support.
"""
import logging
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_active_user
from app.db.session import get_db
from app.models.schemas import TaskCreate, TaskListResponse, TaskResponse, TaskUpdate
from app.models.task import TaskPriority, TaskStatus
from app.models.user import User
from app.services.task import TaskService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get(
    "",
    response_model=TaskListResponse,
    summary="Get user tasks",
    description="Get tasks with filtering by project, status, quadrant, etc.",
)
async def get_tasks(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records"),
    project_id: Optional[UUID] = Query(None, description="Filter by project ID"),
    status: Optional[TaskStatus] = Query(None, description="Filter by status"),
    priority: Optional[TaskPriority] = Query(None, description="Filter by priority"),
    is_urgent: Optional[bool] = Query(None, description="Filter by urgency"),
    is_important: Optional[bool] = Query(None, description="Filter by importance"),
    quadrant: Optional[int] = Query(
        None, ge=1, le=4, description="Filter by Eisenhower quadrant (1-4)"
    ),
    search: Optional[str] = Query(None, description="Search in title and description"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get user tasks with comprehensive filtering.

    **Eisenhower Matrix Quadrants:**
    - **1**: Urgent & Important (Do First)
    - **2**: Not Urgent & Important (Schedule)
    - **3**: Urgent & Not Important (Delegate)
    - **4**: Not Urgent & Not Important (Eliminate)

    **Filters:**
    - **skip**: Pagination offset
    - **limit**: Page size
    - **project_id**: Filter by project
    - **status**: Filter by task status
    - **priority**: Filter by priority level
    - **is_urgent**: Filter by urgency
    - **is_important**: Filter by importance
    - **quadrant**: Filter by Eisenhower quadrant
    - **search**: Search in title and description
    """
    task_service = TaskService(db)

    # Get tasks
    tasks = await task_service.get_user_tasks(
        user=current_user,
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

    # Get total count
    total = await task_service.count_user_tasks(
        user=current_user,
        project_id=project_id,
        status=status,
        quadrant=quadrant,
    )

    return TaskListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=tasks,
    )


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new task",
)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new task.

    - **title**: Task title (required)
    - **description**: Task description with Markdown support
    - **project_id**: Project ID (required)
    - **is_urgent**: Is task urgent (default: false)
    - **is_important**: Is task important (default: false)
    - **status**: Task status (default: todo)
    - **priority**: Task priority (default: nice_to_have)
    - **deadline**: Optional deadline
    """
    task_service = TaskService(db)

    try:
        task = await task_service.create_task(
            user=current_user,
            project_id=task_data.project_id,
            title=task_data.title,
            description=task_data.description,
            is_urgent=task_data.is_urgent,
            is_important=task_data.is_important,
            status=task_data.status,
            priority=task_data.priority,
            deadline=task_data.deadline,
        )

        await db.commit()
        return task

    except PermissionError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Task creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create task",
        )


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Get task by ID",
)
async def get_task(
    task_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get task details by ID."""
    task_service = TaskService(db)

    task = await task_service.get_task(task_id, current_user)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.patch(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Update task",
)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update task.

    All fields are optional. Only provided fields will be updated.
    """
    task_service = TaskService(db)

    # Get task
    task = await task_service.get_task(task_id, current_user)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    try:
        task = await task_service.update_task(
            task=task,
            user=current_user,
            title=task_data.title,
            description=task_data.description,
            is_urgent=task_data.is_urgent,
            is_important=task_data.is_important,
            status=task_data.status,
            priority=task_data.priority,
            deadline=task_data.deadline,
            project_id=task_data.project_id,
        )

        await db.commit()
        return task

    except PermissionError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Task update error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update task",
        )


@router.patch(
    "/{task_id}/quadrant",
    response_model=TaskResponse,
    summary="Move task to different quadrant",
    description="Update task's urgency and importance to move it to a different Eisenhower quadrant",
)
async def move_task_to_quadrant(
    task_id: UUID,
    is_urgent: bool = Query(..., description="Is task urgent"),
    is_important: bool = Query(..., description="Is task important"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Move task to a different Eisenhower Matrix quadrant.

    - **is_urgent**: New urgency value
    - **is_important**: New importance value
    """
    task_service = TaskService(db)

    # Get task
    task = await task_service.get_task(task_id, current_user)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    try:
        task = await task_service.move_to_quadrant(
            task=task,
            user=current_user,
            is_urgent=is_urgent,
            is_important=is_important,
        )

        await db.commit()
        return task

    except PermissionError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Task quadrant move error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to move task",
        )


@router.patch(
    "/{task_id}/status",
    response_model=TaskResponse,
    summary="Update task status",
)
async def update_task_status(
    task_id: UUID,
    status_value: TaskStatus = Query(..., alias="status", description="New task status"),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update task status.

    - **status**: New status (todo, in_progress, blocked, done)
    """
    task_service = TaskService(db)

    # Get task
    task = await task_service.get_task(task_id, current_user)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    try:
        task = await task_service.update_status(
            task=task,
            user=current_user,
            status=status_value,
        )

        await db.commit()
        return task

    except PermissionError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Task status update error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update task status",
        )


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete task",
)
async def delete_task(
    task_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete task.

    WARNING: This action cannot be undone.
    """
    task_service = TaskService(db)

    # Get task
    task = await task_service.get_task(task_id, current_user)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    try:
        await task_service.delete_task(task, current_user)
        await db.commit()

    except PermissionError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Task deletion error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete task",
        )


@router.get(
    "/overdue",
    response_model=TaskListResponse,
    summary="Get overdue tasks",
    description="Get all tasks that are past their deadline and not done",
)
async def get_overdue_tasks(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all overdue tasks for the current user."""
    task_service = TaskService(db)

    tasks = await task_service.get_overdue_tasks(current_user)

    return TaskListResponse(
        total=len(tasks),
        skip=0,
        limit=len(tasks),
        items=tasks,
    )
