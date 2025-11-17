"""
Authentication service with JWT and Google OAuth support.
Business logic for user authentication and authorization.
"""
import logging
from datetime import timedelta
from typing import Optional, Tuple

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
    verify_token_type,
)
from app.models.user import User
from app.repositories.user import UserRepository

logger = logging.getLogger(__name__)


class AuthService:
    """Service for authentication operations."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register_user(
        self, email: str, password: str, full_name: Optional[str] = None
    ) -> User:
        """
        Register a new user with email and password.

        Args:
            email: User email
            password: Plain text password
            full_name: User full name

        Returns:
            Created user instance

        Raises:
            ValueError: If email is already taken
        """
        # Check if email is already taken
        if await self.user_repo.is_email_taken(email):
            raise ValueError("Email already registered")

        # Hash password
        hashed_password = hash_password(password)

        # Create user
        user = await self.user_repo.create_user(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            is_verified=False,  # Email verification can be added later
        )

        logger.info(f"New user registered: {user.email}")
        return user

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate user with email and password.

        Args:
            email: User email
            password: Plain text password

        Returns:
            User instance if authenticated, None otherwise
        """
        user = await self.user_repo.get_by_email(email)

        if not user:
            logger.warning(f"Login attempt for non-existent user: {email}")
            return None

        if not user.hashed_password:
            logger.warning(f"Login attempt for OAuth-only user: {email}")
            return None

        if not verify_password(password, user.hashed_password):
            logger.warning(f"Failed login attempt for user: {email}")
            return None

        if not user.is_active:
            logger.warning(f"Login attempt for inactive user: {email}")
            return None

        # Update last login
        await self.user_repo.update_last_login(user.id)

        logger.info(f"User authenticated: {user.email}")
        return user

    async def authenticate_with_google(self, token: str) -> User:
        """
        Authenticate user with Google OAuth token.

        Args:
            token: Google ID token

        Returns:
            User instance (created if new)

        Raises:
            ValueError: If token is invalid
        """
        try:
            # Verify Google token
            idinfo = id_token.verify_oauth2_token(
                token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
            )

            # Get user info from token
            google_id = idinfo["sub"]
            email = idinfo["email"]
            full_name = idinfo.get("name")
            avatar_url = idinfo.get("picture")

            # Check if user exists
            user = await self.user_repo.get_by_google_id(google_id)

            if not user:
                # Try to find by email
                user = await self.user_repo.get_by_email(email)

                if user:
                    # Link existing account with Google
                    user.google_id = google_id
                    user.avatar_url = avatar_url or user.avatar_url
                    await self.db.flush()
                    logger.info(f"Linked existing account with Google: {email}")
                else:
                    # Create new user
                    user = await self.user_repo.create_user(
                        email=email,
                        google_id=google_id,
                        full_name=full_name,
                        avatar_url=avatar_url,
                        is_verified=True,  # Google accounts are pre-verified
                    )
                    logger.info(f"New user created via Google OAuth: {email}")

            # Update last login
            await self.user_repo.update_last_login(user.id)

            return user

        except ValueError as e:
            logger.error(f"Google OAuth error: {str(e)}")
            raise ValueError("Invalid Google token")

    def create_tokens(self, user_id: str) -> Tuple[str, str]:
        """
        Create access and refresh tokens for a user.

        Args:
            user_id: User ID

        Returns:
            Tuple of (access_token, refresh_token)
        """
        access_token = create_access_token(
            subject=user_id,
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        refresh_token = create_refresh_token(
            subject=user_id,
            expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )

        return access_token, refresh_token

    async def refresh_access_token(self, refresh_token: str) -> str:
        """
        Refresh access token using a refresh token.

        Args:
            refresh_token: Refresh token

        Returns:
            New access token

        Raises:
            ValueError: If refresh token is invalid
        """
        try:
            payload = decode_token(refresh_token)

            # Verify token type
            if not verify_token_type(payload, "refresh"):
                raise ValueError("Invalid token type")

            # Get user ID
            user_id = payload.get("sub")
            if not user_id:
                raise ValueError("Invalid token payload")

            # Verify user still exists and is active
            user = await self.user_repo.get(user_id)
            if not user or not user.is_active:
                raise ValueError("User not found or inactive")

            # Create new access token
            access_token = create_access_token(
                subject=user_id,
                expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
            )

            return access_token

        except JWTError as e:
            logger.error(f"Token refresh error: {str(e)}")
            raise ValueError("Invalid refresh token")

    async def get_current_user(self, token: str) -> Optional[User]:
        """
        Get current user from access token.

        Args:
            token: Access token

        Returns:
            User instance or None

        Raises:
            ValueError: If token is invalid
        """
        try:
            payload = decode_token(token)

            # Verify token type
            if not verify_token_type(payload, "access"):
                raise ValueError("Invalid token type")

            # Get user ID
            user_id = payload.get("sub")
            if not user_id:
                raise ValueError("Invalid token payload")

            # Get user
            user = await self.user_repo.get(user_id)
            if not user or not user.is_active:
                raise ValueError("User not found or inactive")

            return user

        except JWTError as e:
            logger.error(f"Token validation error: {str(e)}")
            raise ValueError("Invalid access token")
