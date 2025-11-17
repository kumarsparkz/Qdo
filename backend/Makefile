.PHONY: help install dev test lint format security clean docker-build docker-up docker-down migrate k8s-deploy

help:  ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install:  ## Install dependencies
	pip install -r requirements.txt

dev:  ## Run development server
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:  ## Run tests with coverage
	pytest --cov=app --cov-report=term-missing --cov-report=html

test-unit:  ## Run unit tests only
	pytest -m unit

test-integration:  ## Run integration tests only
	pytest -m integration

lint:  ## Run linters (ruff, mypy)
	ruff check app/
	mypy app/

format:  ## Format code with black
	black app/

security:  ## Run security scans
	@echo "Running Bandit..."
	bandit -r app/ -c .bandit
	@echo "\nRunning pip-audit..."
	pip-audit --requirement requirements.txt

clean:  ## Clean cache and build artifacts
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	rm -rf .pytest_cache .coverage htmlcov .mypy_cache .ruff_cache

migrate:  ## Run database migrations
	alembic upgrade head

migrate-create:  ## Create new migration (usage: make migrate-create MSG="description")
	alembic revision --autogenerate -m "$(MSG)"

migrate-rollback:  ## Rollback last migration
	alembic downgrade -1

docker-build:  ## Build Docker image
	docker build -t quadrant-todo-api:latest .

docker-up:  ## Start Docker Compose services
	docker-compose up -d

docker-down:  ## Stop Docker Compose services
	docker-compose down

docker-logs:  ## View Docker logs
	docker-compose logs -f api

k8s-deploy:  ## Deploy to Kubernetes
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/secret.yaml
	kubectl apply -f k8s/configmap.yaml
	kubectl apply -f k8s/deployment.yaml
	kubectl apply -f k8s/service.yaml
	kubectl apply -f k8s/ingress.yaml
	kubectl apply -f k8s/hpa.yaml

k8s-status:  ## Check Kubernetes deployment status
	kubectl get all -n quadrant-todo

k8s-logs:  ## View Kubernetes logs
	kubectl logs -f -n quadrant-todo -l app=quadrant-todo-api

k8s-delete:  ## Delete Kubernetes deployment
	kubectl delete namespace quadrant-todo
