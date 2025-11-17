"""
Pydantic schemas for request/response validation.
Strict separation between ORM models and API schemas.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.task import TaskPriority, TaskStatus


# ============================================================================
# Base Schemas
# ============================================================================


class TimestampMixin(BaseModel):
    """Mixin for timestamp fields."""

    created_at: datetime
    updated_at: datetime


# ============================================================================
# User Schemas
# ============================================================================


class UserBase(BaseModel):
    """Base user schema with common fields."""

    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user registration."""

    password: str = Field(..., min_length=8, max_length=100)

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserUpdate(BaseModel):
    """Schema for user updates."""

    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase, TimestampMixin):
    """Schema for user response (no sensitive data)."""

    id: UUID
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    last_login: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UserInDB(UserResponse):
    """User schema with password (internal use only)."""

    hashed_password: Optional[str] = None
    google_id: Optional[str] = None


# ============================================================================
# Authentication Schemas
# ============================================================================


class Token(BaseModel):
    """JWT token response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """JWT token payload."""

    sub: str  # User ID
    exp: datetime
    iat: datetime
    type: str  # "access" or "refresh"


class LoginRequest(BaseModel):
    """Login request schema."""

    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    """Refresh token request."""

    refresh_token: str


class GoogleAuthRequest(BaseModel):
    """Google OAuth authentication request."""

    token: str  # Google ID token


# ============================================================================
# Project Schemas
# ============================================================================


class ProjectBase(BaseModel):
    """Base project schema."""

    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    """Schema for project creation."""

    pass


class ProjectUpdate(BaseModel):
    """Schema for project updates."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None


class ProjectResponse(ProjectBase, TimestampMixin):
    """Schema for project response."""

    id: UUID
    user_id: UUID

    model_config = {"from_attributes": True}


class ProjectWithTaskCount(ProjectResponse):
    """Project response with task count."""

    task_count: int = 0


# ============================================================================
# Task Schemas
# ============================================================================


class TaskBase(BaseModel):
    """Base task schema."""

    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    is_urgent: bool = False
    is_important: bool = False
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.NICE_TO_HAVE
    deadline: Optional[datetime] = None


class TaskCreate(TaskBase):
    """Schema for task creation."""

    project_id: UUID


class TaskUpdate(BaseModel):
    """Schema for task updates."""

    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    is_urgent: Optional[bool] = None
    is_important: Optional[bool] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    deadline: Optional[datetime] = None
    project_id: Optional[UUID] = None


class TaskResponse(TaskBase, TimestampMixin):
    """Schema for task response."""

    id: UUID
    user_id: UUID
    project_id: UUID
    quadrant: int = Field(..., ge=1, le=4)

    model_config = {"from_attributes": True}


class TaskWithProject(TaskResponse):
    """Task response with project details."""

    project: ProjectResponse


# ============================================================================
# Pagination Schemas
# ============================================================================


class PaginationParams(BaseModel):
    """Pagination parameters."""

    skip: int = Field(default=0, ge=0)
    limit: int = Field(default=100, ge=1, le=1000)


class PaginatedResponse(BaseModel):
    """Generic paginated response."""

    total: int
    skip: int
    limit: int
    items: list


class TaskFilter(BaseModel):
    """Task filtering parameters."""

    project_id: Optional[UUID] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    is_urgent: Optional[bool] = None
    is_important: Optional[bool] = None
    quadrant: Optional[int] = Field(None, ge=1, le=4)
    search: Optional[str] = None  # Search in title and description


class TaskListResponse(PaginatedResponse):
    """Paginated task list response."""

    items: list[TaskResponse]


class ProjectListResponse(PaginatedResponse):
    """Paginated project list response."""

    items: list[ProjectResponse]


# ============================================================================
# Error Schemas
# ============================================================================


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str
    error_code: Optional[str] = None


class ValidationErrorResponse(BaseModel):
    """Validation error response."""

    detail: list[dict]


# ============================================================================
# Health Check Schemas
# ============================================================================


class HealthCheck(BaseModel):
    """Health check response."""

    status: str
    version: str
    environment: str
    database: str
    redis: str
