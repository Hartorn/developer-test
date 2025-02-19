default: help;

SVC_BACKEND=backend
SVC_FRONTEND=frontend

# Hidden commands, to be used as deps
_env: ## Build .env with needed info for docker compose
	echo "USER_UID=$$(id -u)" > .env
	echo "USER_GID=$$(id -g)" >> .env
	echo "USERNAME=$$(id -un)" >> .env
	echo "HOME_DIR=$${HOME}" >> .env
.PHONY: _env

_build: _env ## Pull & build the services
	docker compose build --pull
.PHONY: _build

# Usable commands
up: stop_prod ## Start all the containers
	docker compose up -d
	docker compose logs -f
.PHONY: up

stop: ## Stop and remove all the containers
	docker compose down
.PHONY: stop

backend: _build ## Open a bash inside the backend container
	docker compose run --rm ${SVC_BACKEND} poetry shell
.PHONY: backend

frontend: _build ## Open a bash inside the backend container
	docker compose run --rm ${SVC_FRONTEND} sh
.PHONY: frontend

cli: _build ## Launch the cli of the backend
	docker compose run --rm ${SVC_BACKEND} poetry run python ./src/backend/cli.py ${args}
.PHONY: cli

setup: _build ## Build and install the dependencies
	docker compose run --rm ${SVC_BACKEND} poetry install --sync
	docker compose run --rm ${SVC_FRONTEND} npm ci
.PHONY: setup

test: ## Launch unit tests
	docker compose run --rm ${SVC_BACKEND} poetry run pytest
.PHONY: test

format: ## Format all files inside backend with black & isort
	docker compose run --rm ${SVC_BACKEND} poetry run black .
	docker compose run --rm ${SVC_BACKEND} poetry run isort .
	docker compose run --rm ${SVC_FRONTEND} npm run format
.PHONY: format

check_format: ## Format all files inside backend with black & isort
	docker compose run --rm ${SVC_BACKEND} poetry run black --check .
	docker compose run --rm ${SVC_BACKEND} poetry run isort -c .
	docker compose run --rm ${SVC_FRONTEND} npm run check-format
.PHONY: check_format

check_linting: ## Verify code with lint tools, like pylint
	docker compose run --rm ${SVC_BACKEND} poetry run pylint ./src/backend
	docker compose run --rm ${SVC_FRONTEND} npm run lint
.PHONY: check_format

build: ## Build production images
	docker build -t odds-backend:latest --target prod ./backend
	# Note : for simplicity, backend url is fixed at docker build time
	docker build --target prod --build-arg=BACKEND_URL=http://backend.odds.localhost -t odds-frontend:latest ./frontend
.PHONY: build

up_prod: stop build ## Start docker compose with production images 
	docker compose -f docker-compose.prod.yml up -d
	docker compose -f docker-compose.prod.yml logs -f
.PHONY: up_prod

stop_prod: ## Stop docker compose with production images
	docker compose -f docker-compose.prod.yml stop
	docker compose -f docker-compose.prod.yml down
.PHONY: stop_prod

cli_prod: build ## Launch the cli of the backend in production image
	docker compose -f docker-compose.prod.yml run --rm ${SVC_BACKEND} poetry run python ./src/backend/cli.py ${args}
.PHONY: cli


help: ## Display commands help
	@grep -E '^[a-zA-Z][a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help
