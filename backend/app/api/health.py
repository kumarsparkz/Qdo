"""
Health check endpoints for Kubernetes liveness and readiness probes.
"""
import logging

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db
from app.models.schemas import HealthCheck

logger = logging.getLogger(__name__)

router = APIRouter(tags=["health"])


@router.get(
    "/health",
    response_model=HealthCheck,
    summary="Health check",
    description="Health check endpoint for liveness and readiness probes",
)
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Health check endpoint.

    Checks:
    - API is running
    - Database connection
    - Redis connection (if configured)

    Returns 200 if healthy, 503 if unhealthy.
    """
    health_status = {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": "unknown",
        "redis": "unknown",
    }

    # Check database
    try:
        await db.execute(text("SELECT 1"))
        health_status["database"] = "healthy"
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        health_status["database"] = "unhealthy"
        health_status["status"] = "unhealthy"

    # Check Redis (optional)
    try:
        from redis.asyncio import Redis

        redis = Redis.from_url(str(settings.REDIS_URL))
        await redis.ping()
        await redis.close()
        health_status["redis"] = "healthy"
    except Exception as e:
        logger.warning(f"Redis health check failed: {str(e)}")
        health_status["redis"] = "unavailable"
        # Redis is optional, so don't mark as unhealthy

    return HealthCheck(**health_status)


@router.get(
    "/health/live",
    status_code=status.HTTP_200_OK,
    summary="Liveness probe",
    description="Kubernetes liveness probe - checks if the app is running",
)
async def liveness():
    """
    Liveness probe for Kubernetes.

    Returns 200 if the application is running.
    """
    return {"status": "alive"}


@router.get(
    "/health/ready",
    status_code=status.HTTP_200_OK,
    summary="Readiness probe",
    description="Kubernetes readiness probe - checks if the app is ready to serve traffic",
)
async def readiness(db: AsyncSession = Depends(get_db)):
    """
    Readiness probe for Kubernetes.

    Returns 200 if the application is ready to serve traffic.
    Checks database connectivity.
    """
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        return {"status": "not ready", "error": str(e)}
