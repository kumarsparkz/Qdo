"""
User repository for database operations.
"""
from typing import Optional
from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """Repository for User model operations."""

    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email address.

        Args:
            email: User email

        Returns:
            User instance or None
        """
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_google_id(self, google_id: str) -> Optional[User]:
        """
        Get user by Google ID.

        Args:
            google_id: Google OAuth ID

        Returns:
            User instance or None
        """
        result = await self.db.execute(select(User).where(User.google_id == google_id))
        return result.scalar_one_or_none()

    async def create_user(
        self,
        email: str,
        hashed_password: Optional[str] = None,
        full_name: Optional[str] = None,
        google_id: Optional[str] = None,
        avatar_url: Optional[str] = None,
        is_verified: bool = False,
    ) -> User:
        """
        Create a new user.

        Args:
            email: User email
            hashed_password: Hashed password (None for OAuth users)
            full_name: User full name
            google_id: Google OAuth ID
            avatar_url: Profile picture URL
            is_verified: Email verification status

        Returns:
            Created user instance
        """
        return await self.create(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            google_id=google_id,
            avatar_url=avatar_url,
            is_verified=is_verified,
        )

    async def update_last_login(self, user_id: UUID) -> None:
        """
        Update user's last login timestamp.

        Args:
            user_id: User UUID
        """
        from datetime import datetime

        user = await self.get(user_id)
        if user:
            user.last_login = datetime.utcnow()
            await self.db.flush()

    async def search_users(self, query: str, skip: int = 0, limit: int = 100) -> list[User]:
        """
        Search users by email or name.

        Args:
            query: Search query
            skip: Number of records to skip
            limit: Maximum number of records

        Returns:
            List of matching users
        """
        search_pattern = f"%{query}%"
        result = await self.db.execute(
            select(User)
            .where(
                or_(
                    User.email.ilike(search_pattern),
                    User.full_name.ilike(search_pattern),
                )
            )
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def is_email_taken(self, email: str, exclude_user_id: Optional[UUID] = None) -> bool:
        """
        Check if email is already taken.

        Args:
            email: Email to check
            exclude_user_id: User ID to exclude from check (for updates)

        Returns:
            True if email is taken, False otherwise
        """
        query = select(User).where(User.email == email)
        if exclude_user_id:
            query = query.where(User.id != exclude_user_id)

        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None
