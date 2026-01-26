# 🚀 Portfolio Project - Монорепозиторий

Полнофункциональное портфолио с современным стеком технологий: FastAPI backend и Next.js frontend.

## 📋 Описание

Монорепозиторий, содержащий backend (FastAPI) и frontend (Next.js) для персонального портфолио с админ-панелью для управления контентом.

## 🏗️ Структура проекта

```
.
├── backend/              # FastAPI Backend
│   ├── src/             # Исходный код
│   ├── alembic/         # Миграции БД
│   ├── tests/           # Тесты
│   └── README.md        # Документация backend
│
├── frontend/            # Next.js Frontend
│   ├── app/             # Next.js App Router
│   ├── components/      # React компоненты
│   ├── public/          # Статические файлы
│   └── README.md        # Документация frontend
│
├── docker-compose.yml   # Docker Compose конфигурация
├── Dockerfile           # Docker образ для backend
├── .env.example         # Пример переменных окружения
└── README.md            # Этот файл
```

## 🛠️ Технологический стек

### Backend
- **FastAPI** - современный Python веб-фреймворк
- **PostgreSQL** - реляционная база данных
- **SQLAlchemy** - ORM
- **Alembic** - миграции БД
- **JWT** - аутентификация
- **Pydantic** - валидация данных

### Frontend
- **Next.js 16** - React фреймворк с SSR
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - utility-first CSS фреймворк
- **Radix UI** - доступные UI компоненты
- **React Hook Form** - управление формами

## 🚀 Быстрый старт

### Вариант 1: Docker Compose (рекомендуется)

1. **Клонируйте репозиторий:**

```bash
git clone https://github.com/bearcoderr/achkasov_dev.git
cd achkasov_dev
```

2. **Создайте `.env` файл:**

```bash
cp .env.example .env
```

Отредактируйте `.env` и настройте переменные окружения.

3. **Запустите все сервисы:**

```bash
docker-compose up -d
```

4. **Примените миграции:**

```bash
docker-compose exec api alembic upgrade head
```

5. **Откройте в браузере:**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PgAdmin**: http://localhost:5050

### Вариант 2: Локальная разработка

#### Backend

```bash
# Перейдите в папку backend
cd backend

# Создайте виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows

# Установите зависимости
pip install -r requirements.txt

# Настройте .env файл
cp .env.example .env

# Примените миграции
alembic upgrade head

# Запустите сервер
uvicorn src.main:app --reload
```

#### Frontend

```bash
# В новом терминале, перейдите в папку frontend
cd frontend

# Установите зависимости
npm install
# или
yarn install
# или
pnpm install

# Создайте .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Запустите dev сервер
npm run dev
```

## 📚 Документация

- **[Backend README](backend/README.md)** - подробная документация по backend
- **[Frontend README](frontend/README.md)** - подробная документация по frontend
- **[Docker README](README_DOCKER.md)** - инструкции по работе с Docker

## 🌿 Ветки проекта

Проект использует следующую структуру веток:

- **`main`** - основная ветка с полным проектом (backend + frontend)
- **`backend`** - ветка только с backend кодом
- **`frontend`** - ветка только с frontend кодом
- **`master`** - исходная ветка (legacy)

## 🔧 Переменные окружения

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db
POSTGRES_DB=portfolio_db
POSTGRES_USER=portfolio_user
POSTGRES_PASSWORD=your_password

# Application
ENVIRONMENT=development
DEBUG=True
API_PORT=8000

# Security
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:3001"]
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## 🧪 Тестирование

### Backend

```bash
cd backend
pytest
```

### Frontend

```bash
cd frontend
npm test
```

## 🐳 Docker команды

```bash
# Запустить все сервисы
docker-compose up -d

# Остановить все сервисы
docker-compose down

# Просмотр логов
docker-compose logs -f

# Перезапустить сервис
docker-compose restart api

# Выполнить команду в контейнере
docker-compose exec api bash
```

## 📦 Деплой

### Backend

Backend можно задеплоить на:
- **Heroku**
- **Railway**
- **DigitalOcean App Platform**
- **AWS ECS/EC2**
- **Google Cloud Run**

### Frontend

Frontend можно задеплоить на:
- **Vercel** (рекомендуется для Next.js)
- **Netlify**
- **AWS Amplify**
- **Cloudflare Pages**

## 🔒 Безопасность

- ✅ JWT аутентификация
- ✅ Хеширование паролей (Argon2)
- ✅ CORS настройки
- ✅ Валидация данных
- ✅ Защита от SQL инъекций (ORM)
- ✅ Environment variables для секретов

## 🤝 Разработка

### Workflow

1. Создайте feature ветку от `main`
2. Внесите изменения
3. Создайте Pull Request
4. После ревью - мердж в `main`

### Code Style

- **Backend**: следуйте PEP 8, используйте black для форматирования
- **Frontend**: используйте ESLint и Prettier

## 📝 Лицензия

Проект является персональным портфолио.

## 🔗 Полезные ссылки

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📧 Контакты

Для вопросов и предложений создайте Issue в репозитории.

---

**Сделано с ❤️ для демонстрации навыков full-stack разработки**
