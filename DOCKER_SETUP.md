# 🐳 Docker Setup - Полная инструкция

## 📋 Быстрый старт

### 1. Создайте `.env` файл

```bash
cp .env.example .env
```

Отредактируйте `.env` и настройте переменные под свои нужды.

### 2. Запустите проект

```bash
# Собрать образы
docker-compose build

# Запустить все сервисы
docker-compose up -d

# Или запустить с логами в реальном времени
docker-compose up
```

### 3. Примените миграции базы данных

```bash
docker-compose run --rm migrations
```

Или используйте Makefile:

```bash
make migrate
```

## 🌐 Доступные сервисы

После запуска будут доступны:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **PgAdmin**: http://localhost:5050 (если запущен с профилем tools)

## 📦 Сервисы

Проект включает следующие сервисы:

1. **postgres** - PostgreSQL 16 база данных
2. **backend** - FastAPI приложение
3. **frontend** - Next.js приложение
4. **pgadmin** - Web-интерфейс для управления БД (опционально)
5. **migrations** - Применение миграций Alembic (одноразовый запуск)

## 🛠️ Основные команды

### С использованием Makefile (рекомендуется)

```bash
make help           # Показать все доступные команды
make build          # Собрать образы
make up             # Запустить сервисы
make down           # Остановить сервисы
make restart        # Перезапустить сервисы
make logs           # Показать логи всех сервисов
make logs-backend   # Показать логи только backend
make logs-frontend  # Показать логи только frontend
make shell-backend  # Войти в контейнер backend
make shell-frontend # Войти в контейнер frontend
make db-shell       # Войти в PostgreSQL
make migrate        # Применить миграции
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
docker-compose logs -f backend
docker-compose logs -f frontend

# Перезапуск
docker-compose restart

# Войти в контейнер
docker-compose exec backend bash
docker-compose exec frontend sh

# Войти в PostgreSQL
docker-compose exec postgres psql -U portfolio_user -d portfolio_db
```

## 🔧 Разработка

### Hot Reload

Оба сервиса настроены на автоматическую перезагрузку при изменении кода:

- **Backend**: изменения в `backend/src/` применяются автоматически
- **Frontend**: изменения в `frontend/` применяются автоматически

Просто редактируйте файлы, и изменения применятся сразу!

### Выполнение команд внутри контейнеров

```bash
# Backend
docker-compose exec backend bash
# Внутри контейнера:
#   alembic revision --autogenerate -m "description"
#   pytest
#   python -m src.main

# Frontend
docker-compose exec frontend sh
# Внутри контейнера:
#   npm install <package>
#   npm run build
```

## 🗄️ Работа с базой данных

### Подключение к PostgreSQL через PgAdmin

1. Запустите PgAdmin:
   ```bash
   docker-compose --profile tools up -d pgadmin
   ```
   Или через Makefile:
   ```bash
   make pgadmin
   ```

2. Откройте http://localhost:5050
3. Войдите (email и пароль из `.env`)
4. Добавьте новый сервер:
   - **Name**: Portfolio DB
   - **Host**: postgres
   - **Port**: 5432
   - **Username**: portfolio_user
   - **Password**: значение из `.env`

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
docker-compose exec backend alembic revision --autogenerate -m "Add new table"

# Применить миграции
docker-compose run --rm migrations
# Или
make migrate

# Откатить миграцию
docker-compose exec backend alembic downgrade -1
```

## 🧪 Тестирование

```bash
# Запустить все тесты backend
docker-compose exec backend pytest

# С покрытием
docker-compose exec backend pytest --cov=src --cov-report=html

# Или через Makefile
make test
make test-coverage
```

## 🏭 Production

Для продакшена создайте `docker-compose.prod.yml`:

```yaml
services:
  backend:
    environment:
      ENVIRONMENT: production
      DEBUG: False
    command: uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
  
  frontend:
    environment:
      NODE_ENV: production
    command: npm run start
    build:
      args:
        - NODE_ENV=production
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
4. Отключите PgAdmin в продакшене (не используйте профиль tools)
5. Используйте SSL/TLS сертификаты
6. Настройте firewall

## 🐛 Troubleshooting

### Порт уже занят

Если порт 8000, 3000, 5432 или 5050 занят, измените в `.env`:

```bash
API_PORT=8001
FRONTEND_PORT=3001
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

### Backend не может подключиться к БД

Убедитесь, что PostgreSQL запущен:

```bash
docker-compose ps postgres
```

Проверьте, что в `DATABASE_URL` используется имя сервиса `postgres`, а не `localhost`.

### Frontend не может подключиться к Backend

Убедитесь, что:
1. Backend запущен и доступен
2. Переменные окружения `NEXT_PUBLIC_API_URL` настроены правильно
3. CORS настроен в backend для разрешения запросов от frontend

### Изменения кода не применяются

Перезапустите контейнер:

```bash
docker-compose restart backend
docker-compose restart frontend
```

Или пересоберите образ:

```bash
docker-compose build backend
docker-compose up -d backend
```

## 📊 Мониторинг

### Проверка статуса контейнеров

```bash
docker-compose ps
# Или
make status
```

### Использование ресурсов

```bash
docker stats
```

### Healthcheck

Оба сервиса имеют встроенные healthcheck:

```bash
# Backend
curl http://localhost:8000/

# Frontend
curl http://localhost:3000/
```

## 📦 Volumes

Проект использует named volumes:

- `postgres_data` - данные PostgreSQL (персистентны)
- `pgadmin_data` - настройки PgAdmin (персистентны)

Для полной очистки:

```bash
docker-compose down -v
# Или
make clean
```

## 🔗 Полезные ссылки

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
