# Portfolio Monorepo (FastAPI + Next.js)

Полнофункциональный монорепозиторий с backend на FastAPI и frontend на Next.js.
Проект использует Clean Architecture в backend, современный React‑стек на frontend и готов к запуску через Docker Compose.

**Состав репозитория**

```
.
├── backend/              # FastAPI backend
│   ├── src/              # исходный код
│   ├── alembic/          # миграции БД
│   └── tests/            # тесты
├── frontend/             # Next.js frontend
│   ├── app/              # App Router
│   ├── components/       # UI компоненты
│   └── public/           # статические файлы
├── docker-compose.yml    # инфраструктура (API, DB, PgAdmin)
├── Dockerfile.backend    # образ backend
├── Dockerfile.frontend   # образ frontend
└── .env.example          # пример переменных окружения
```

**Технологии и зависимости**

Backend:
- FastAPI 0.104.1, Uvicorn
- Python 3.11+ (Docker: 3.12)
- PostgreSQL 16
- SQLAlchemy 2.0, Alembic
- Pydantic 2
- JWT (PyJWT), Argon2/Bcrypt
- Опционально: Redis, SMTP (aiosmtplib)

Frontend:
- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, tailwind-merge, tailwindcss-animate
- Radix UI, Lucide Icons
- React Hook Form + Zod
- Axios, date-fns, recharts

Инфраструктура:
- Docker, Docker Compose
- PgAdmin

**Требования**

Локально без Docker:
- Python 3.11+
- Node.js 20+
- PostgreSQL 16

**Быстрый старт (Docker Compose)**

1. Создайте `.env` из шаблона:

```bash
cp .env.example .env
```

2. Запустите сервисы:

```bash
docker-compose up -d
```

3. Примените миграции:

```bash
docker-compose exec backend alembic upgrade head
```

Доступы по умолчанию:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger: http://localhost:8000/docs
- PgAdmin: http://localhost:5050

**Локальная разработка**

Backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp ..\.env.example ..\.env
alembic upgrade head
uvicorn src.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
# или yarn / pnpm

# если нужно явно указать API адрес
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
```

**Переменные окружения**

Ключевые параметры (см. `.env.example`):
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`
- `ENVIRONMENT`, `DEBUG`, `API_PORT`
- `SECRET_KEY`, `JWT_SECRET_KEY`
- `ALLOWED_ORIGINS`, `CORS_ORIGINS`
- `PGADMIN_EMAIL`, `PGADMIN_PASSWORD`, `PGADMIN_PORT`

Frontend:
- `NEXT_PUBLIC_API_URL`

**Скрипты**

Frontend:
- `npm run dev` — dev сервер
- `npm run build` — production сборка
- `npm run start` — запуск production сборки
- `npm run lint` — ESLint

Backend:
- `pytest` — запуск тестов

**Архитектура backend**

Проект следует Clean Architecture:
- `core` — доменные сущности и правила
- `application` — use cases и сервисы
- `infrastructure` — API, БД, внешние сервисы

**Примечания**

- В Next.js настроен proxy `/api/*` на backend (см. `frontend/next.config.mjs`).
- Для разработки используется hot‑reload в обоих сервисах.
