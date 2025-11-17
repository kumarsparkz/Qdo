"""
OpenTelemetry configuration for traces, metrics, and logs.
Can be toggled ON/OFF via configuration.
"""
import logging
from typing import Optional

from opentelemetry import metrics, trace
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from prometheus_client import make_asgi_app

from app.core.config import settings

logger = logging.getLogger(__name__)


class ObservabilityManager:
    """
    Manages OpenTelemetry instrumentation for the application.
    Supports toggling observability ON/OFF via configuration.
    """

    def __init__(self):
        self.enabled = settings.OTEL_ENABLED
        self.tracer_provider: Optional[TracerProvider] = None
        self.meter_provider: Optional[MeterProvider] = None

    def setup(self) -> None:
        """Initialize OpenTelemetry instrumentation if enabled."""
        if not self.enabled:
            logger.info("OpenTelemetry observability is DISABLED")
            return

        logger.info("Initializing OpenTelemetry observability...")

        try:
            # Create resource with service information
            resource = Resource.create(
                {
                    "service.name": settings.OTEL_SERVICE_NAME,
                    "service.version": settings.APP_VERSION,
                    "deployment.environment": settings.ENVIRONMENT,
                }
            )

            # Setup Tracing (Tempo)
            self._setup_tracing(resource)

            # Setup Metrics (Prometheus)
            self._setup_metrics(resource)

            # Setup automatic instrumentation
            self._setup_instrumentation()

            logger.info("OpenTelemetry observability initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize OpenTelemetry: {e}")
            # Don't crash the app if observability fails
            self.enabled = False

    def _setup_tracing(self, resource: Resource) -> None:
        """Setup distributed tracing with Tempo."""
        # Create OTLP span exporter
        otlp_exporter = OTLPSpanExporter(
            endpoint=settings.OTEL_EXPORTER_OTLP_ENDPOINT,
            insecure=not settings.is_production,
        )

        # Create tracer provider
        self.tracer_provider = TracerProvider(resource=resource)
        self.tracer_provider.add_span_processor(BatchSpanProcessor(otlp_exporter))

        # Set global tracer provider
        trace.set_tracer_provider(self.tracer_provider)

        logger.info(f"Tracing configured: endpoint={settings.OTEL_EXPORTER_OTLP_ENDPOINT}")

    def _setup_metrics(self, resource: Resource) -> None:
        """Setup metrics collection with Prometheus."""
        # Create OTLP metric exporter
        otlp_exporter = OTLPMetricExporter(
            endpoint=settings.OTEL_EXPORTER_OTLP_ENDPOINT,
            insecure=not settings.is_production,
        )

        # Create metric reader
        metric_reader = PeriodicExportingMetricReader(
            otlp_exporter,
            export_interval_millis=60000,  # Export every 60 seconds
        )

        # Create meter provider
        self.meter_provider = MeterProvider(
            resource=resource,
            metric_readers=[metric_reader],
        )

        # Set global meter provider
        metrics.set_meter_provider(self.meter_provider)

        logger.info("Metrics configured: exporting to Prometheus")

    def _setup_instrumentation(self) -> None:
        """Setup automatic instrumentation for common libraries."""
        # SQLAlchemy instrumentation (auto-traces DB queries)
        SQLAlchemyInstrumentor().instrument(
            enable_commenter=True,
            commenter_options={"db_framework": True},
        )

        # Redis instrumentation
        RedisInstrumentor().instrument()

        # Logging instrumentation
        LoggingInstrumentor().instrument(set_logging_format=True)

        logger.info("Automatic instrumentation configured")

    def instrument_fastapi(self, app) -> None:
        """
        Instrument FastAPI application.

        Args:
            app: FastAPI application instance
        """
        if not self.enabled:
            return

        FastAPIInstrumentor.instrument_app(
            app,
            tracer_provider=self.tracer_provider,
            meter_provider=self.meter_provider,
        )
        logger.info("FastAPI instrumented with OpenTelemetry")

    def get_prometheus_app(self):
        """
        Get Prometheus metrics ASGI app.

        Returns:
            ASGI app for Prometheus metrics endpoint
        """
        return make_asgi_app()

    def shutdown(self) -> None:
        """Shutdown observability and flush remaining data."""
        if not self.enabled:
            return

        logger.info("Shutting down OpenTelemetry...")

        if self.tracer_provider:
            self.tracer_provider.shutdown()

        if self.meter_provider:
            self.meter_provider.shutdown()


# Global observability manager instance
observability = ObservabilityManager()
