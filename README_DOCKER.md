# 🐳 Docker Setup для Portfolio API

## 📋 Требования

- Docker Desktop (или Docker Engine + Docker Compose)
- Make (опционально, для удобства)

## 🚀 Быстрый старт

### 1. Создайте `.env` файл

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

Отредактируйте `.env` под свои нужды (особенно пароли для продакшена!).

### 2. Запустите проект

```bash
# Соберите образы
docker-compose build

# Запустите все сервисы
docker-compose up -d
```

### 3. Проверьте, что всё работает

- **API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **PgAdmin**: http://localhost:5050 (admin@admin.com / admin)

## 📦 Сервисы

Проект включает 3 сервиса:

1. **postgres** - PostgreSQL 16 база данных (порт 5432)
2. **api** - FastAPI приложение (порт 8000)
3. **pgadmin** - Web-интерфейс для управления БД (порт 5050)

## 🛠️ Основные команды

### С использованием Makefile (рекомендуется)

```bash
make help           # Показать все доступные команды
make build          # Собрать образы
make up             # Запустить сервисы
make down           # Остановить сервисы
make restart        # Перезапустить сервисы
make logs           # Показать логи всех сервисов
make logs-api       # Показать логи только API
make shell          # Войти в контейнер API
make db-shell       # Войти в PostgreSQL
make test           # Запустить тесты
make clean          # Удалить всё (контейнеры + volumes)
```

### Без Makefile (чистый Docker Compose)

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Логи
docker-compose logs -f

# Перезапуск
docker-compose restart

# Войти в контейнер
docker-compose exec api bash

# Войти в PostgreSQL
docker-compose exec postgres psql -U portfolio_user -d portfolio_db
```

## 🔧 Разработка

### Hot Reload

Приложение автоматически перезагружается при изменении кода благодаря volume mapping:

```yaml
volumes:
  - ./src:/app/src
```

Просто редактируйте файлы, и изменения применятся сразу!

### Просмотр логов в реальном времени

```bash
docker-compose logs -f api
```

### Выполнение команд внутри контейнера

```bash
# Войти в контейнер
docker-compose exec api bash

# Внутри контейнера можно запускать:
python manage.py makemigrations
pytest
alembic revision --autogenerate -m "description"
```

## 🗄️ Работа с базой данных

### Подключение к PostgreSQL через PgAdmin

1. Откройте http://localhost:5050
2. Войдите (admin@admin.com / admin)
3. Добавьте новый сервер:
   - **Name**: Portfolio DB
   - **Host**: postgres (имя сервиса из docker-compose)
   - **Port**: 5432
   - **Username**: portfolio_user
   - **Password**: значение из .env

### Подключение через CLI

```bash
# Через docker-compose
docker-compose exec postgres psql -U portfolio_user -d portfolio_db

# Или напрямую
psql -h localhost -p 5432 -U portfolio_user -d portfolio_db
```

### Миграции (Alembic)

```bash
# Создать миграцию
docker-compose exec api alembic revision --autogenerate -m "Add new table"

# Применить миграции
docker-compose exec api alembic upgrade head

# Откатить миграцию
docker-compose exec api alembic downgrade -1
```

### Сброс базы данных

```bash
# ОПАСНО! Удалит все данные
make db-reset

# Или вручную
docker-compose down -v
docker-compose up -d
```

## 🧪 Тестирование

```bash
# Запустить все тесты
make test

# Или напрямую
docker-compose exec api pytest

# С покрытием
docker-compose exec api pytest --cov=src --cov-report=html
```

## 🏭 Production

Для продакшена создайте `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  api:
    environment:
      ENVIRONMENT: production
      DEBUG: False
    command: uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Запуск:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔒 Безопасность

**⚠️ ВАЖНО для продакшена:**

1. Смените все пароли в `.env`
2. Используйте сильный `SECRET_KEY`
3. Настройте `ALLOWED_ORIGINS` только для своих доменов
4. Отключите PgAdmin в продакшене (закомментируйте в docker-compose.yml)
5. Используйте SSL/TLS сертификаты
6. Настройте firewall

## 📊 Мониторинг

### Проверка статуса контейнеров

```bash
docker-compose ps
```

### Использование ресурсов

```bash
docker stats
```

### Healthcheck

API имеет встроенный healthcheck:

```bash
curl http://localhost:8000/
```

## 🐛 Troubleshooting

### Порт уже занят

Если порт 8000, 5432 или 5050 занят, измените в `.env`:

```bash
API_PORT=8001
POSTGRES_PORT=5433
PGADMIN_PORT=5051
```

### База данных не запускается

Проверьте логи:

```bash
docker-compose logs postgres
```

Попробуйте удалить volume и пересоздать:

```bash
docker-compose down -v
docker-compose up -d
```

### API не может подключиться к БД

Убедитесь, что PostgreSQL запущен:

```bash
docker-compose ps postgres
```

Проверьте, что в `DATABASE_URL` используется имя сервиса `postgres`, а не `localhost`.

### Изменения кода не применяются

Перезапустите контейнер:

```bash
docker-compose restart api
```

Или пересоберите образ:

```bash
docker-compose build api
docker-compose up -d api
```

## 📦 Volumes

Проект использует два named volumes:

- `postgres_data` - данные PostgreSQL (персистентны)
- `pgadmin_data` - настройки PgAdmin (персистентны)

Для полной очистки:

```bash
docker-compose down -v
```

## 🔗 Полезные ссылки

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)