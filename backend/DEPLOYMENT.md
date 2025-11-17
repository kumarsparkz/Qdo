# Deployment Guide - Quadrant Todo API

This guide covers deploying the Quadrant Todo API to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Post-Deployment](#post-deployment)
- [Monitoring & Observability](#monitoring--observability)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### For Docker Deployment
- Docker 20.10+
- Docker Compose 2.0+

### For Kubernetes Deployment
- Kubernetes 1.24+ (k3s compatible)
- kubectl configured
- Helm 3+ (optional, for easier deployment)
- Container registry access

### Infrastructure Requirements
- PostgreSQL 15+
- Redis 7+
- Minimum 2GB RAM per API instance
- 2 CPU cores recommended

## Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Configure Critical Settings

**Security (REQUIRED):**
```env
SECRET_KEY=<generate-secure-random-string-min-32-chars>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
```

**Database:**
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10
```

**Redis:**
```env
REDIS_URL=redis://host:6379/0
REDIS_CACHE_TTL=3600
```

**Application:**
```env
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

**OpenTelemetry (Toggle ON/OFF):**
```env
OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
```

### 3. Generate SECRET_KEY

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Database Setup

### 1. Create Database

```sql
CREATE DATABASE quadrant_todo;
CREATE USER quadrant_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE quadrant_todo TO quadrant_user;
```

### 2. Run Migrations

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head
```

### 3. Verify Database

```bash
psql -h localhost -U quadrant_user -d quadrant_todo -c "\dt"
```

Expected tables:
- users
- projects
- tasks

## Docker Deployment

### Development with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Production Docker Deployment

#### 1. Build Production Image

```bash
docker build -t quadrant-todo-api:1.0.0 .
```

#### 2. Tag for Registry

```bash
docker tag quadrant-todo-api:1.0.0 your-registry.com/quadrant-todo-api:1.0.0
docker push your-registry.com/quadrant-todo-api:1.0.0
```

#### 3. Run Container

```bash
docker run -d \
  --name quadrant-todo-api \
  -p 8000:8000 \
  --env-file .env.production \
  --restart unless-stopped \
  your-registry.com/quadrant-todo-api:1.0.0
```

#### 4. Verify Deployment

```bash
curl http://localhost:8000/health
```

## Kubernetes Deployment

### 1. Prepare Secrets

Edit `k8s/secret.yaml` with actual values:

```bash
# Generate base64-encoded secrets
echo -n "your-secret-value" | base64
```

Update secret.yaml:
```yaml
stringData:
  DATABASE_URL: "postgresql+asyncpg://user:pass@host/db"
  SECRET_KEY: "<your-secret-key>"
  GOOGLE_CLIENT_ID: "<your-client-id>"
  GOOGLE_CLIENT_SECRET: "<your-client-secret>"
```

### 2. Configure OpenTelemetry Toggle

Edit `k8s/configmap.yaml`:

```yaml
data:
  # Set to "true" to enable, "false" to disable
  OTEL_ENABLED: "true"
```

### 3. Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create ConfigMap and Secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Deploy Horizontal Pod Autoscaler
kubectl apply -f k8s/hpa.yaml

# Deploy Ingress (requires ingress controller)
kubectl apply -f k8s/ingress.yaml
```

### 4. Verify Deployment

```bash
# Check pod status
kubectl get pods -n quadrant-todo

# Check logs
kubectl logs -f -n quadrant-todo -l app=quadrant-todo-api

# Check service
kubectl get svc -n quadrant-todo

# Check ingress
kubectl get ingress -n quadrant-todo
```

### 5. Run Database Migrations

```bash
# Create one-time job pod
kubectl run -it --rm migration \
  --image=your-registry.com/quadrant-todo-api:1.0.0 \
  --restart=Never \
  --namespace=quadrant-todo \
  --env-file=<(kubectl get secret quadrant-todo-secrets -n quadrant-todo -o json | jq -r '.data | to_entries[] | "\(.key)=\(.value | @base64d)"') \
  -- alembic upgrade head
```

Or create a Kubernetes Job:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
  namespace: quadrant-todo
spec:
  template:
    spec:
      containers:
      - name: migration
        image: your-registry.com/quadrant-todo-api:1.0.0
        command: ["alembic", "upgrade", "head"]
        envFrom:
        - secretRef:
            name: quadrant-todo-secrets
        - configMapRef:
            name: quadrant-todo-config
      restartPolicy: Never
  backoffLimit: 3
```

### 6. Scale Deployment

```bash
# Manual scaling
kubectl scale deployment quadrant-todo-api -n quadrant-todo --replicas=5

# Autoscaling is configured via HPA (k8s/hpa.yaml)
# Check HPA status
kubectl get hpa -n quadrant-todo
```

## Post-Deployment

### 1. Health Checks

```bash
# Liveness
curl http://your-domain.com/health/live

# Readiness
curl http://your-domain.com/health/ready

# Full health check
curl http://your-domain.com/health
```

### 2. Create Initial Admin User

```bash
curl -X POST http://your-domain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "SecurePassword123",
    "full_name": "Admin User"
  }'
```

### 3. Test Authentication

```bash
# Login
curl -X POST http://your-domain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "SecurePassword123"
  }'

# Save the access_token from response
export TOKEN="<access_token>"

# Test authenticated endpoint
curl http://your-domain.com/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Monitoring & Observability

### Enable OpenTelemetry

OpenTelemetry can be toggled ON/OFF without code changes:

**Docker Compose:**
```yaml
environment:
  - OTEL_ENABLED=true
```

**Kubernetes:**
```yaml
# In k8s/configmap.yaml
data:
  OTEL_ENABLED: "true"
```

### Access Monitoring Tools

- **Prometheus**: http://your-domain.com:9090
- **Grafana**: http://your-domain.com:3001
- **Metrics Endpoint**: http://your-domain.com/metrics

### Configure Alerts

Example Prometheus alert rules:

```yaml
groups:
  - name: api_alerts
    rules:
    - alert: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "High error rate detected"

    - alert: HighLatency
      expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "95th percentile latency > 1s"
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Symptom:** `could not connect to server`

**Solution:**
```bash
# Check database accessibility
psql -h <host> -U <user> -d <database>

# Verify DATABASE_URL in .env or secrets
echo $DATABASE_URL

# Check firewall rules
```

#### 2. Redis Connection Failed

**Symptom:** `Error connecting to Redis`

**Solution:**
```bash
# Test Redis connection
redis-cli -h <host> -p 6379 ping

# Verify REDIS_URL
echo $REDIS_URL
```

#### 3. Pods Not Starting (K8s)

```bash
# Check pod events
kubectl describe pod <pod-name> -n quadrant-todo

# Check logs
kubectl logs <pod-name> -n quadrant-todo

# Common issues:
# - Image pull errors (check registry credentials)
# - ConfigMap/Secret not found (check names)
# - Resource limits too low (check resource requests)
```

#### 4. 401 Unauthorized Errors

**Check:**
- SECRET_KEY matches across all instances
- Token expiration (ACCESS_TOKEN_EXPIRE_MINUTES)
- Clock synchronization across servers

#### 5. High Memory Usage

```bash
# Check memory usage
kubectl top pods -n quadrant-todo

# Adjust resource limits in k8s/deployment.yaml
resources:
  limits:
    memory: "1Gi"  # Increase if needed
```

### Logs

```bash
# Docker
docker logs quadrant-todo-api -f

# Kubernetes
kubectl logs -f -n quadrant-todo -l app=quadrant-todo-api

# Filter for errors
kubectl logs -n quadrant-todo -l app=quadrant-todo-api | grep ERROR
```

### Performance Tuning

**Database Connection Pool:**
```env
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10
```

**Workers:**
```env
WORKERS=4  # Formula: (2 x CPU cores) + 1
```

**Redis Cache TTL:**
```env
REDIS_CACHE_TTL=3600  # 1 hour
```

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Configure CORS_ORIGINS to specific domains
- [ ] Enable HTTPS (TLS/SSL certificates)
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Set up log aggregation
- [ ] Enable security headers
- [ ] Rotate credentials regularly
- [ ] Set up intrusion detection

## Backup & Recovery

### Database Backup

```bash
# Backup
pg_dump -h localhost -U quadrant_user quadrant_todo > backup.sql

# Restore
psql -h localhost -U quadrant_user quadrant_todo < backup.sql
```

### Automated Backups (K8s CronJob)

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: quadrant-todo
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            command:
            - /bin/sh
            - -c
            - pg_dump $DATABASE_URL > /backup/$(date +%Y%m%d_%H%M%S).sql
          restartPolicy: OnFailure
```

## Rollback Procedure

```bash
# Docker
docker pull your-registry.com/quadrant-todo-api:previous-version
docker stop quadrant-todo-api
docker run ... your-registry.com/quadrant-todo-api:previous-version

# Kubernetes
kubectl rollout undo deployment/quadrant-todo-api -n quadrant-todo

# Verify
kubectl rollout status deployment/quadrant-todo-api -n quadrant-todo
```

---

For additional support, consult the [README.md](README.md) or create an issue on GitHub.
