# 🔧 Решение проблем

## Проблема 1: Таймаут при установке Python пакетов

**Ошибка:**
```
ReadTimeoutError: HTTPSConnectionPool(host='files.pythonhosted.org', port=443): Read timed out.
```

**Решение:**

1. **Повторите сборку** (часто помогает при временных проблемах сети):
   ```bash
   docker-compose build --no-cache backend
   ```

2. **Используйте зеркало PyPI** (если проблема постоянная):
   Создайте файл `pip.conf` в корне проекта или используйте переменную окружения:
   ```bash
   # В Dockerfile.backend можно добавить:
   ENV PIP_INDEX_URL=https://pypi.org/simple
   ```

3. **Увеличьте timeout** (уже сделано в Dockerfile.backend):
   - Timeout увеличен до 300 секунд
   - Добавлены retry (3 попытки)

## Проблема 2: Ошибка миграций "Can't locate revision identified by '05edafb0e88d'"

**Причина:** В базе данных есть запись о ревизии миграции, которой больше нет в файлах миграций.

**Решение 1 - Автоматическое исправление:**

```powershell
# Запустите скрипт исправления
.\fix-migrations.ps1
```

**Решение 2 - Ручное исправление:**

```powershell
# 1. Проверьте текущее состояние
docker-compose exec backend alembic current

# 2. Если видите ошибку с '05edafb0e88d', установите правильную ревизию
docker-compose exec backend alembic stamp 8f1c1cf3d672

# 3. Примените миграции
docker-compose exec backend alembic upgrade head
```

**Решение 3 - Полный сброс (ОПАСНО! Удалит все данные):**

```powershell
# Остановите все контейнеры
docker-compose down

# Удалите volumes (удалит все данные БД!)
docker-compose down -v

# Запустите заново
docker-compose up -d postgres
# Подождите 10 секунд пока БД запустится

# Примените миграции
docker-compose --profile migrations run --rm migrations

# Запустите все сервисы
docker-compose up -d
```

## Проблема 3: Контейнеры не запускаются

**Проверьте:**

1. **Статус контейнеров:**
   ```bash
   docker-compose ps
   ```

2. **Логи для диагностики:**
   ```bash
   docker-compose logs backend
   docker-compose logs postgres
   ```

3. **Порты заняты:**
   ```bash
   # Проверьте какие порты заняты
   netstat -ano | findstr "8000 3000 5432"
   
   # Измените порты в .env если нужно
   API_PORT=8001
   FRONTEND_PORT=3001
   POSTGRES_PORT=5433
   ```

## Проблема 4: Backend не может подключиться к БД

**Проверьте:**

1. **БД запущена:**
   ```bash
   docker-compose ps postgres
   ```

2. **Переменные окружения в .env:**
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DB`
   - `DATABASE_URL` должен использовать `postgres` как хост (имя сервиса), а не `localhost`

3. **Логи backend:**
   ```bash
   docker-compose logs backend | grep -i "database\|connection\|error"
   ```

## Проблема 5: Frontend не может подключиться к Backend

**Проверьте:**

1. **Backend запущен и доступен:**
   ```bash
   curl http://localhost:8000/
   ```

2. **CORS настройки в backend:**
   - В `.env` должна быть переменная `ALLOWED_ORIGINS` с `http://localhost:3000`

3. **Переменные окружения frontend:**
   - `NEXT_PUBLIC_API_URL=http://localhost:8000`
   - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api`

## Полезные команды для диагностики

```bash
# Проверить все логи
docker-compose logs

# Проверить логи конкретного сервиса
docker-compose logs backend
docker-compose logs postgres
docker-compose logs frontend

# Войти в контейнер для отладки
docker-compose exec backend bash
docker-compose exec postgres psql -U portfolio_user -d portfolio_db

# Пересобрать образы
docker-compose build --no-cache

# Полная очистка и перезапуск
docker-compose down -v
docker-compose build
docker-compose up -d
```
