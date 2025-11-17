"""
Structured logging configuration with OpenTelemetry integration.
Supports JSON logging for production and human-readable logs for development.
"""
import logging
import sys
from typing import Any, Dict

from opentelemetry import trace
from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource

from app.core.config import settings


class StructuredFormatter(logging.Formatter):
    """
    Custom formatter that outputs structured logs.
    Sensitive data filtering is applied here.
    """

    SENSITIVE_KEYS = {
        "password",
        "token",
        "secret",
        "authorization",
        "api_key",
        "access_token",
        "refresh_token",
    }

    def format(self, record: logging.LogRecord) -> str:
        """Format log record with structured data."""
        # Get trace context if available
        span = trace.get_current_span()
        trace_id = None
        span_id = None

        if span and span.get_span_context().is_valid:
            trace_id = format(span.get_span_context().trace_id, "032x")
            span_id = format(span.get_span_context().span_id, "016x")

        log_data: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Add trace context
        if trace_id:
            log_data["trace_id"] = trace_id
        if span_id:
            log_data["span_id"] = span_id

        # Add extra fields
        if hasattr(record, "extra"):
            extra_data = self._sanitize_data(record.extra)
            log_data.update(extra_data)

        # Add exception info
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # For development, return human-readable format
        if settings.is_development:
            return self._format_human_readable(log_data)

        # For production, return JSON
        import json

        return json.dumps(log_data)

    def _sanitize_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Remove sensitive data from logs."""
        sanitized = {}
        for key, value in data.items():
            if any(sensitive in key.lower() for sensitive in self.SENSITIVE_KEYS):
                sanitized[key] = "***REDACTED***"
            elif isinstance(value, dict):
                sanitized[key] = self._sanitize_data(value)
            else:
                sanitized[key] = value
        return sanitized

    def _format_human_readable(self, data: Dict[str, Any]) -> str:
        """Format log data for human reading (development)."""
        parts = [
            f"[{data['timestamp']}]",
            f"[{data['level']}]",
            f"[{data['logger']}]",
            data["message"],
        ]

        if "trace_id" in data:
            parts.append(f"trace_id={data['trace_id']}")

        if "exception" in data:
            parts.append(f"\n{data['exception']}")

        return " ".join(parts)


def setup_logging() -> None:
    """
    Configure application logging with OpenTelemetry integration.
    """
    # Create root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))

    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Console handler with structured formatter
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(StructuredFormatter())
    root_logger.addHandler(console_handler)

    # OpenTelemetry logging integration
    if settings.OTEL_ENABLED:
        try:
            resource = Resource.create(
                {
                    "service.name": settings.OTEL_SERVICE_NAME,
                    "service.version": settings.APP_VERSION,
                    "deployment.environment": settings.ENVIRONMENT,
                }
            )

            logger_provider = LoggerProvider(resource=resource)
            set_logger_provider(logger_provider)

            # OTLP exporter for Loki
            otlp_exporter = OTLPLogExporter(
                endpoint=settings.OTEL_EXPORTER_OTLP_ENDPOINT,
                insecure=not settings.is_production,
            )

            logger_provider.add_log_record_processor(
                BatchLogRecordProcessor(otlp_exporter)
            )

            # Add OTLP handler
            otlp_handler = LoggingHandler(
                level=getattr(logging, settings.LOG_LEVEL.upper()),
                logger_provider=logger_provider,
            )
            root_logger.addHandler(otlp_handler)

            root_logger.info("OpenTelemetry logging initialized")
        except Exception as e:
            root_logger.error(f"Failed to initialize OpenTelemetry logging: {e}")

    # Suppress noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

    root_logger.info(
        f"Logging initialized",
        extra={
            "environment": settings.ENVIRONMENT,
            "log_level": settings.LOG_LEVEL,
            "otel_enabled": settings.OTEL_ENABLED,
        },
    )


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for the given name.

    Args:
        name: Logger name (usually __name__ of the module)

    Returns:
        Configured logger instance
    """
    return logging.getLogger(name)
