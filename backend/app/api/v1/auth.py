"""
Authentication API endpoints.
Handles user registration, login, token refresh, and OAuth.
"""
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.schemas import (
    GoogleAuthRequest,
    LoginRequest,
    RefreshTokenRequest,
    Token,
    UserCreate,
    UserResponse,
)
from app.models.user import User
from app.services.auth import AuthService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user",
    description="Register a new user with email and password",
)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Register a new user.

    - **email**: Valid email address
    - **password**: Strong password (min 8 chars, uppercase, lowercase, digit)
    - **full_name**: Optional full name

    Returns access and refresh tokens.
    """
    auth_service = AuthService(db)

    try:
        # Create user
        user = await auth_service.register_user(
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name,
        )

        # Create tokens
        access_token, refresh_token = auth_service.create_tokens(str(user.id))

        await db.commit()

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )

    except ValueError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed",
        )


@router.post(
    "/login",
    response_model=Token,
    summary="Login with email and password",
    description="Authenticate with email and password to receive JWT tokens",
)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Login with email and password.

    - **email**: User email
    - **password**: User password

    Returns access and refresh tokens.
    """
    auth_service = AuthService(db)

    # Authenticate user
    user = await auth_service.authenticate_user(login_data.email, login_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create tokens
    access_token, refresh_token = auth_service.create_tokens(str(user.id))

    await db.commit()

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@router.post(
    "/google",
    response_model=Token,
    summary="Google OAuth authentication",
    description="Authenticate with Google OAuth token",
)
async def google_auth(
    auth_data: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Authenticate with Google OAuth.

    - **token**: Google ID token from client

    Returns access and refresh tokens.
    Creates new user if doesn't exist.
    """
    auth_service = AuthService(db)

    try:
        # Authenticate with Google
        user = await auth_service.authenticate_with_google(auth_data.token)

        # Create tokens
        access_token, refresh_token = auth_service.create_tokens(str(user.id))

        await db.commit()

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )

    except ValueError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Google auth error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google authentication failed",
        )


@router.post(
    "/refresh",
    response_model=Token,
    summary="Refresh access token",
    description="Get new access token using refresh token",
)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Refresh access token.

    - **refresh_token**: Valid refresh token

    Returns new access and refresh tokens.
    """
    auth_service = AuthService(db)

    try:
        # Refresh access token
        access_token = await auth_service.refresh_access_token(
            refresh_data.refresh_token
        )

        # Create new refresh token as well (token rotation)
        payload = auth_service.decode_token(refresh_data.refresh_token)
        user_id = payload.get("sub")
        _, new_refresh_token = auth_service.create_tokens(user_id)

        return Token(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
    description="Get currently authenticated user profile",
)
async def get_me(
    current_user: User = Depends(get_current_user),
):
    """
    Get current user profile.

    Requires authentication.
    """
    return current_user
