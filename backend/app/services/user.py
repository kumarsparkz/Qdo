"""
User service for user management operations.
"""
import logging
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import User
from app.repositories.user import UserRepository

logger = logging.getLogger(__name__)


class UserService:
    """Service for user operations."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def get_user(self, user_id: UUID) -> Optional[User]:
        """
        Get user by ID.

        Args:
            user_id: User UUID

        Returns:
            User instance or None
        """
        return await self.user_repo.get(user_id)

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email.

        Args:
            email: User email

        Returns:
            User instance or None
        """
        return await self.user_repo.get_by_email(email)

    async def update_user(
        self,
        user: User,
        full_name: Optional[str] = None,
        email: Optional[str] = None,
    ) -> User:
        """
        Update user profile.

        Args:
            user: User instance to update
            full_name: New full name
            email: New email

        Returns:
            Updated user instance

        Raises:
            ValueError: If email is already taken
        """
        updates = {}

        if full_name is not None:
            updates["full_name"] = full_name

        if email is not None and email != user.email:
            # Check if new email is available
            if await self.user_repo.is_email_taken(email, exclude_user_id=user.id):
                raise ValueError("Email already taken")
            updates["email"] = email
            updates["is_verified"] = False  # Re-verify email

        if updates:
            user = await self.user_repo.update(user, **updates)
            logger.info(f"User updated: {user.email}")

        return user

    async def change_password(
        self, user: User, old_password: str, new_password: str
    ) -> None:
        """
        Change user password.

        Args:
            user: User instance
            old_password: Current password
            new_password: New password

        Raises:
            ValueError: If old password is incorrect
        """
        from app.core.security import verify_password

        # Verify old password
        if not user.hashed_password:
            raise ValueError("Password not set for this account")

        if not verify_password(old_password, user.hashed_password):
            raise ValueError("Incorrect password")

        # Hash and set new password
        user.hashed_password = hash_password(new_password)
        await self.db.flush()

        logger.info(f"Password changed for user: {user.email}")

    async def deactivate_user(self, user: User) -> None:
        """
        Deactivate user account.

        Args:
            user: User instance
        """
        user.is_active = False
        await self.db.flush()
        logger.info(f"User deactivated: {user.email}")

    async def search_users(
        self, query: str, skip: int = 0, limit: int = 100
    ) -> list[User]:
        """
        Search users by email or name.

        Args:
            query: Search query
            skip: Number of records to skip
            limit: Maximum number of records

        Returns:
            List of matching users
        """
        return await self.user_repo.search_users(query, skip, limit)
