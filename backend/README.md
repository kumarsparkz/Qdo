# Quadrant Todo API - Production-Grade FastAPI Backend

> Enterprise-ready REST API for Eisenhower Matrix task management system

[![CI/CD](https://github.com/your-org/quadrant-todo/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/your-org/quadrant-todo/actions)
[![codecov](https://codecov.io/gh/your-org/quadrant-todo/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/quadrant-todo)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg)](https://fastapi.tiangolo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Development](#-development)
- [Testing](#-testing)
- [Security](#-security)
- [Deployment](#-deployment)
- [Observability](#-observability)
- [API Documentation](#-api-documentation)

## ✨ Features

### Core Functionality
- **Eisenhower Matrix**: 4-quadrant task prioritization (Urgent/Important)
- **Project Management**: Organize tasks into projects
- **Task Management**: Full CRUD with status tracking (todo, in_progress, blocked, done)
- **User Authentication**: JWT + Google OAuth
- **Real-time Search**: Advanced filtering by quadrant, status, priority, deadline

### Technical Excellence
- ✅ **Clean Architecture**: Layered design (API → Service → Repository → Database)
- ✅ **Async First**: Full async/await with asyncpg and async SQLAlchemy
- ✅ **Type Safety**: 100% type hints with MyPy validation
- ✅ **Comprehensive Tests**: Unit + Integration tests with >80% coverage
- ✅ **Production Ready**: Docker, Kubernetes, auto-scaling, health checks
- ✅ **Observable**: OpenTelemetry (Loki, Tempo, Prometheus, Grafana)
- ✅ **Secure**: OAuth2, JWT, password hashing (Argon2), SQL injection protection
- ✅ **Scalable**: Horizontal scaling, Redis caching, background jobs (Celery)

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────┐
│          FastAPI Application                │
├─────────────────────────────────────────────┤
│  API Layer (Routers)                        │
│  - /api/v1/auth                             │
│  - /api/v1/users                            │
│  - /api/v1/projects                         │
│  - /api/v1/tasks                            │
├─────────────────────────────────────────────┤
│  Service Layer (Business Logic)             │
│  - AuthService                              │
│  - UserService                              │
│  - ProjectService                           │
│  - TaskService                              │
├─────────────────────────────────────────────┤
│  Repository Layer (Data Access)             │
│  - UserRepository                           │
│  - ProjectRepository                        │
│  - TaskRepository                           │
├─────────────────────────────────────────────┤
│  Database Layer (PostgreSQL + SQLAlchemy)   │
│  - Users, Projects, Tasks                   │
└─────────────────────────────────────────────┘
```

### Folder Structure

```
backend/
├── app/
│   ├── core/               # Core configuration, security, logging
│   │   ├── config.py       # Pydantic settings (12-factor)
│   │   ├── security.py     # JWT, password hashing
│   │   ├── logging.py      # Structured logging
│   │   └── observability.py # OpenTelemetry
│   ├── models/             # ORM models & Pydantic schemas
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── task.py
│   │   └── schemas.py      # Request/Response schemas
│   ├── repositories/       # Data access layer
│   │   ├── base.py
│   │   ├── user.py
│   │   ├── project.py
│   │   └── task.py
│   ├── services/           # Business logic
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── project.py
│   │   └── task.py
│   ├── api/                # FastAPI routers
│   │   ├── dependencies.py # DI containers
│   │   ├── health.py       # Health checks
│   │   └── v1/             # API v1
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── projects.py
│   │       └── tasks.py
│   ├── workers/            # Background tasks (Celery)
│   ├── db/                 # Database session management
│   ├── utils/              # Utilities (caching, etc.)
│   └── tests/              # Test suite
│       ├── unit/
│       └── integration/
├── alembic/                # Database migrations
├── k8s/                    # Kubernetes manifests
├── .github/workflows/      # CI/CD pipelines
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | FastAPI 0.109.0 |
| **Language** | Python 3.11+ |
| **Database** | PostgreSQL 15 + asyncpg |
| **ORM** | SQLAlchemy 2.0 (async) |
| **Migrations** | Alembic |
| **Cache** | Redis 7 |
| **Background Jobs** | Celery |
| **Authentication** | JWT (python-jose) + Google OAuth |
| **Password Hashing** | Argon2 + Bcrypt (passlib) |
| **Observability** | OpenTelemetry + Loki + Tempo + Prometheus + Grafana |
| **Testing** | pytest + pytest-asyncio |
| **Code Quality** | Black, Ruff, MyPy, Bandit |
| **Container** | Docker + Docker Compose |
| **Orchestration** | Kubernetes (k3s compatible) |

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### 1. Clone & Install

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

**Required settings:**
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `SECRET_KEY`: Secure random string (min 32 chars)

### 3. Run Database Migrations

```bash
alembic upgrade head
```

### 4. Start Application

```bash
# Development mode (auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 5. Access API

- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🐳 Docker Quick Start

```bash
# Start all services (API, PostgreSQL, Redis, Observability stack)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

Services:
- **API**: http://localhost:8000
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090

## 💻 Development

### Run Development Server

```bash
uvicorn app.main:app --reload
```

### Code Quality

```bash
# Format code
black app/

# Lint code
ruff check app/

# Type check
mypy app/

# Security scan
bandit -r app/
```

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🧪 Testing

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=app --cov-report=term-missing --cov-report=html
```

### Run Specific Test Types

```bash
# Unit tests only
pytest -m unit

# Integration tests only
pytest -m integration

# Specific test file
pytest app/tests/unit/test_security.py
```

### Test Configuration

Tests use a separate test database:
- Database: `test_quadrant_todo`
- Automatic rollback after each test
- Fixtures for common test data

## 🔒 Security

### Security Features

1. **Authentication**
   - JWT token-based authentication
   - Access tokens (30 min TTL)
   - Refresh tokens (7 days TTL)
   - Google OAuth integration

2. **Password Security**
   - Argon2 hashing (primary)
   - Bcrypt fallback
   - Strong password validation

3. **Input Validation**
   - Pydantic models for all inputs
   - SQL injection prevention (parameterized queries)
   - XSS protection

4. **Security Headers**
   - CORS configuration
   - Trusted host middleware
   - Rate limiting (configurable)

### Security Scanning

```bash
# Check for vulnerabilities in dependencies
pip-audit --requirement requirements.txt

# Static code analysis
bandit -r app/ -c .bandit

# Check for known CVEs
safety check --file requirements.txt
```

### Security Best Practices

- ✅ Never commit `.env` files
- ✅ Rotate `SECRET_KEY` regularly
- ✅ Use HTTPS in production
- ✅ Enable rate limiting
- ✅ Review security logs regularly

## 📦 Deployment

### Docker Deployment

```bash
# Build image
docker build -t quadrant-todo-api:latest .

# Run container
docker run -d \
  -p 8000:8000 \
  --env-file .env \
  --name quadrant-todo-api \
  quadrant-todo-api:latest
```

### Kubernetes Deployment

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets (edit first!)
kubectl apply -f k8s/secret.yaml

# Deploy application
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# Check status
kubectl get pods -n quadrant-todo
kubectl logs -f -n quadrant-todo -l app=quadrant-todo-api
```

### Environment Variables

See `.env.example` for all configuration options.

**Critical Production Settings:**
- `ENVIRONMENT=production`
- `DEBUG=false`
- `SECRET_KEY=<secure-random-string>`
- `CORS_ORIGINS=<your-frontend-domains>`

## 📊 Observability

### OpenTelemetry Integration

The application includes full OpenTelemetry instrumentation that can be toggled ON/OFF via configuration.

**Enable/Disable:**
```env
OTEL_ENABLED=true  # Set to false to disable
```

### Metrics (Prometheus)

- **Endpoint**: `/metrics`
- **Metrics**: HTTP requests, response times, error rates
- **Dashboard**: Grafana (http://localhost:3001)

### Logs (Loki)

- Structured JSON logging
- Automatic sensitive data filtering
- Trace correlation with trace_id/span_id

### Traces (Tempo)

- Distributed tracing
- Automatic instrumentation for:
  - HTTP requests
  - Database queries
  - Redis operations

### Grafana Dashboards

Pre-configured dashboards for:
- API performance
- Database queries
- Error rates
- Request rates

## 📚 API Documentation

### Endpoints

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login with email/password |
| POST | `/api/v1/auth/google` | Login with Google OAuth |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET | `/api/v1/auth/me` | Get current user |

#### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/projects` | List projects (paginated) |
| POST | `/api/v1/projects` | Create project |
| GET | `/api/v1/projects/{id}` | Get project details |
| PATCH | `/api/v1/projects/{id}` | Update project |
| DELETE | `/api/v1/projects/{id}` | Delete project |

#### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | List tasks (filtered) |
| POST | `/api/v1/tasks` | Create task |
| GET | `/api/v1/tasks/{id}` | Get task details |
| PATCH | `/api/v1/tasks/{id}` | Update task |
| PATCH | `/api/v1/tasks/{id}/quadrant` | Move to quadrant |
| PATCH | `/api/v1/tasks/{id}/status` | Update status |
| DELETE | `/api/v1/tasks/{id}` | Delete task |
| GET | `/api/v1/tasks/overdue` | Get overdue tasks |

#### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Full health check |
| GET | `/health/live` | Liveness probe (K8s) |
| GET | `/health/ready` | Readiness probe (K8s) |

### Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

For questions or issues:
- Create an issue on GitHub
- Email: support@yourdomain.com

---

**Built with ❤️ using FastAPI**
