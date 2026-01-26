# 🚀 Portfolio Backend API

Backend API для портфолио, построенный на FastAPI с использованием Clean Architecture.

## 📋 Описание

RESTful API для управления контентом портфолио с админ-панелью. Проект следует принципам Clean Architecture, обеспечивая разделение ответственности и легкость тестирования.

## 🛠️ Технологический стек

- **Framework**: FastAPI 0.104.1
- **Язык**: Python 3.11+
- **База данных**: PostgreSQL 16
- **ORM**: SQLAlchemy 2.0
- **Миграции**: Alembic
- **Аутентификация**: JWT (PyJWT), Argon2
- **Валидация**: Pydantic 2.5
- **Сервер**: Uvicorn

## 📁 Структура проекта

```
backend/
├── src/
│   ├── core/              # Доменный слой
│   │   ├── entities/      # Бизнес-сущности
│   │   └── exceptions/    # Доменные исключения
│   ├── application/       # Слой приложения
│   │   ├── services/      # Сервисы репозиториев
│   │   └── use_cases/     # Бизнес-логика
│   ├── infrastructure/     # Слой инфраструктуры
│   │   ├── api/           # REST API endpoints
│   │   ├── db/            # База данных и репозитории
│   │   └── mail/          # Email сервисы
│   ├── shared/            # Общие утилиты
│   └── main.py            # Точка входа
├── alembic/               # Миграции БД
├── tests/                 # Тесты
├── requirements.txt       # Зависимости Python
└── pyproject.toml        # Конфигурация проекта
```

## 🚀 Быстрый старт

### Предварительные требования

- Python 3.11+
- PostgreSQL 16
- Docker и Docker Compose (опционально)

### Установка

1. **Клонируйте репозиторий и перейдите в ветку backend:**

```bash
git checkout backend
```

2. **Создайте виртуальное окружение:**

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

3. **Установите зависимости:**

```bash
pip install -r requirements.txt
```

4. **Настройте переменные окружения:**

Скопируйте `.env.example` в `.env` и заполните необходимые значения:

```bash
cp .env.example .env
```

Основные переменные:
- `DATABASE_URL` - строка подключения к PostgreSQL
- `SECRET_KEY` - секретный ключ для JWT
- `ALLOWED_ORIGINS` - разрешенные CORS origins

5. **Примените миграции:**

```bash
alembic upgrade head
```

6. **Запустите сервер:**

```bash
uvicorn src.main:app --reload
```

API будет доступен по адресу: http://localhost:8000

## 📚 API Документация

После запуска сервера доступна интерактивная документация:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐳 Запуск с Docker

### Использование Docker Compose

```bash
# Запустить все сервисы (API + PostgreSQL + PgAdmin)
docker-compose up -d

# Просмотр логов
docker-compose logs -f api

# Остановка
docker-compose down
```

Подробная инструкция по Docker: см. [README_DOCKER.md](../README_DOCKER.md)

## 🗄️ Работа с базой данных

### Миграции

```bash
# Создать новую миграцию
alembic revision --autogenerate -m "Описание изменений"

# Применить миграции
alembic upgrade head

# Откатить последнюю миграцию
alembic downgrade -1
```

### Подключение к БД

```bash
# Через psql
psql -h localhost -U portfolio_user -d portfolio_db

# Или через Docker
docker-compose exec postgres psql -U portfolio_user -d portfolio_db
```

## 🧪 Тестирование

```bash
# Запустить все тесты
pytest

# С покрытием кода
pytest --cov=src --cov-report=html

# Конкретный тест
pytest tests/test_specific.py
```

## 📦 Основные endpoints

### Публичные API

- `GET /api/` - Информация о доступных endpoints
- `GET /api/page` - Получить данные страницы портфолио
- `POST /api/contact` - Отправить форму обратной связи

### Админ API

- `POST /admin/login` - Авторизация администратора
- `GET /admin/sections` - Получить секции для редактирования
- `PUT /admin/sections/{section}` - Обновить секцию

## 🔒 Безопасность

- JWT токены для аутентификации
- Argon2 для хеширования паролей
- CORS настройки
- Валидация данных через Pydantic

## 🏗️ Архитектура

Проект следует принципам **Clean Architecture**:

1. **Core Layer** - доменные сущности и бизнес-правила
2. **Application Layer** - use cases и сервисы приложения
3. **Infrastructure Layer** - реализация API, БД, внешних сервисов

Это обеспечивает:
- Независимость от фреймворков
- Легкость тестирования
- Гибкость и расширяемость

## 📝 Разработка

### Создание нового endpoint

1. Создайте схему в `infrastructure/api/v1/schemas/`
2. Создайте use case в `application/use_cases/`
3. Создайте endpoint в `infrastructure/api/v1/endpoints/`
4. Зарегистрируйте роутер в `main.py`

### Добавление новой сущности

1. Создайте entity в `core/entities/`
2. Создайте модель БД в `infrastructure/db/models.py`
3. Создайте миграцию: `alembic revision --autogenerate`
4. Создайте репозиторий в `infrastructure/db/repositories/`

## 🚀 Production

Для продакшена:

1. Установите `ENVIRONMENT=production` в `.env`
2. Отключите `DEBUG=False`
3. Используйте сильный `SECRET_KEY`
4. Настройте `ALLOWED_ORIGINS` только для ваших доменов
5. Используйте SSL/TLS сертификаты
6. Настройте мониторинг и логирование

## 📄 Лицензия

Проект является частью монорепозитория портфолио.

## 🔗 Полезные ссылки

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
