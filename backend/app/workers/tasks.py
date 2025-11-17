"""
Background tasks using Celery.
"""
import logging

from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="send_email")
def send_email(to: str, subject: str, body: str) -> bool:
    """
    Send email task (placeholder).

    Args:
        to: Recipient email
        subject: Email subject
        body: Email body

    Returns:
        True if sent successfully
    """
    logger.info(f"Sending email to {to}: {subject}")
    # TODO: Implement actual email sending
    return True


@celery_app.task(name="cleanup_old_tasks")
def cleanup_old_tasks() -> int:
    """
    Cleanup old completed tasks (placeholder).

    Returns:
        Number of tasks cleaned up
    """
    logger.info("Running cleanup_old_tasks")
    # TODO: Implement cleanup logic
    return 0


@celery_app.task(name="send_deadline_reminders")
def send_deadline_reminders() -> int:
    """
    Send deadline reminders for upcoming tasks (placeholder).

    Returns:
        Number of reminders sent
    """
    logger.info("Running send_deadline_reminders")
    # TODO: Implement reminder logic
    return 0
