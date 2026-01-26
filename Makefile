.PHONY: help build up down restart logs shell db-shell migrate test clean

help: ## Показать помощь
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Собрать Docker образы
	docker-compose build

up: ## Запустить все сервисы
	docker-compose up -d

down: ## Остановить все сервисы
	docker-compose down

restart: ## Перезапустить все сервисы
	docker-compose restart

logs: ## Показать логи всех сервисов
	docker-compose logs -f

logs-api: ## Показать логи API
	docker-compose logs -f api

logs-db: ## Показать логи PostgreSQL
	docker-compose logs -f postgres

shell: ## Войти в контейнер API
	docker-compose exec api bash

db-shell: ## Войти в PostgreSQL
	docker-compose exec postgres psql -U portfolio_user -d portfolio_db

db-migrate: ## Применить миграции Alembic
	docker-compose exec api alembic upgrade head

db-rollback: ## Откатить последнюю миграцию
	docker-compose exec api alembic downgrade -1

db-reset: ## Сбросить базу данных (ОПАСНО!)
	docker-compose down -v
	docker-compose up -d postgres
	sleep 5
	docker-compose up -d api

test: ## Запустить тесты
	docker-compose exec api pytest

clean: ## Удалить все контейнеры и volumes
	docker-compose down -v
	docker system prune -f

dev: ## Запустить в режиме разработки (с hot-reload)
	docker-compose up

prod-build: ## Собрать production образ
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

prod-up: ## Запустить production
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

status: ## Показать статус контейнеров
	docker-compose ps