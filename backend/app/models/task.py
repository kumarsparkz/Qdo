"""
Task ORM model implementing the Eisenhower Matrix.
"""
import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.user import User


class TaskStatus(str, enum.Enum):
    """Task status enum."""

    TODO = "todo"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    DONE = "done"


class TaskPriority(str, enum.Enum):
    """Task priority enum."""

    MUST_HAVE = "must_have"
    NICE_TO_HAVE = "nice_to_have"


class Task(Base):
    """Task model with Eisenhower Matrix quadrant assignment."""

    __tablename__ = "tasks"

    # Primary Key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )

    # Foreign Keys
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Task Fields
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # Eisenhower Matrix Dimensions
    is_urgent: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_important: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Status and Priority
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, name="task_status"),
        default=TaskStatus.TODO,
        nullable=False,
        index=True,
    )
    priority: Mapped[TaskPriority] = mapped_column(
        Enum(TaskPriority, name="task_priority"),
        default=TaskPriority.NICE_TO_HAVE,
        nullable=False,
    )

    # Deadline
    deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="tasks")
    project: Mapped["Project"] = relationship("Project", back_populates="tasks")

    # Indexes for efficient queries
    __table_args__ = (
        Index("idx_task_urgent_important", "is_urgent", "is_important"),
        Index("idx_task_status", "status"),
        Index("idx_task_deadline", "deadline"),
    )

    @property
    def quadrant(self) -> int:
        """
        Get the Eisenhower Matrix quadrant (1-4).

        Quadrant 1: Urgent & Important (Do First)
        Quadrant 2: Not Urgent & Important (Schedule)
        Quadrant 3: Urgent & Not Important (Delegate)
        Quadrant 4: Not Urgent & Not Important (Eliminate)
        """
        if self.is_urgent and self.is_important:
            return 1
        elif not self.is_urgent and self.is_important:
            return 2
        elif self.is_urgent and not self.is_important:
            return 3
        else:
            return 4

    def __repr__(self) -> str:
        return f"<Task(id={self.id}, title={self.title}, quadrant={self.quadrant})>"
