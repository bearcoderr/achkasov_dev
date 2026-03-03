# План модернизации проекта `achkasov_dev` (с фокусом на CMS)

## 0. Контекст и целевое состояние

### Что нужно получить
Ключевая цель: **любой контент на публичном frontend управляется через админку и хранится в БД**.

Цепочка должна быть единой:

1. Авторизованный администратор изменяет данные в admin UI.
2. Admin UI отправляет изменения в backend API.
3. Backend валидирует payload, сохраняет в PostgreSQL.
4. Public API отдает актуальные данные из БД.
5. Frontend рендерит только данные API (без локальных hardcoded значений).

### Что сейчас не завершено
- Часть админ-экранов хранит данные в `localStorage`, а не в БД.
- Admin API покрывает только ограниченный набор сущностей (не весь контент сайта).
- Есть рассогласования в схемах/контрактах (например `footer` в агрегированном ответе).
- Есть техдолг по безопасности (JWT/CORS/секреты) и стабильности сборки frontend.

---

## 1. Принципы модернизации

1. **Single Source of Truth = PostgreSQL**
   - Никаких контентных данных в `localStorage` (кроме временного draft при необходимости).
2. **API-first contracts**
   - Сначала схемы и контракты, затем UI.
3. **Backward compatibility по этапам**
   - Миграция без «большого взрыва»: секция за секцией.
4. **Security by default**
   - Все admin endpoint защищены JWT.
5. **Definition of Done на каждый этап**
   - Этап считается закрытым только при прохождении проверок.

---

## 2. Карта контента CMS (что должно редактироваться из админки)

## 2.1 Публичные секции
1. Hero
2. About
3. Services
4. Projects
5. Experience
6. Skills
7. Certificates
8. Personal facts
9. Contact info
10. Footer
11. Menu/navigation
12. (Опционально) Blog + статические страницы

## 2.2 Для каждой секции обязателен стандарт
- `GET` список/детали (public + admin read)
- `POST` создание (где применимо)
- `PUT/PATCH` обновление
- `DELETE` удаление (где применимо)
- порядок (`order`) и флаг публикации (`is_active`) для коллекций
- RU/EN локализация

---

## 3. Roadmap по этапам

## Этап 1 — Стабилизация основы (P0)

### 1.1 Починить сборку frontend
- Создать/актуализировать:
  - `frontend/lib/utils.ts` (`cn` helper)
  - `frontend/lib/api.ts` (единый API-клиент + типы DTO)
- Убрать дублирующиеся/битые импорты.

### 1.2 Привести в порядок агрегированный контракт `page-data`
- Синхронизировать `PageData` entity ↔ `PageDataSchema` ↔ frontend `PageData` type.
- Добавить отсутствующие поля (в т.ч. `footer`) в schema-слой.
- Проверить сериализацию nested localized fields.

### 1.3 Результат этапа
- `npm run build` проходит.
- `/api/page-data` стабильно отдает полный контракт.

---

## Этап 2 — CMS backend для всех секций (P0)

### 2.1 Ввести полноценный admin content API
Сформировать namespace, например:
- `GET /admin/content/hero`
- `PUT /admin/content/hero`
- `GET /admin/content/about`
- `PUT /admin/content/about`
- `GET /admin/content/services`
- `POST /admin/content/services`
- `PUT /admin/content/services/{id}`
- `DELETE /admin/content/services/{id}`
- ... аналогично для projects/experience/skills/certificates/personal/contact/footer/menu.

### 2.2 Перевести `AdminRepositoryImpl` на DB-backed реализацию
- Убрать зависимость от `static_data` для операций записи.
- Привести DI к корректной сигнатуре репозитория.
- Все write use-cases работают через SQLAlchemy session.

### 2.3 Унифицировать обработку ошибок
- 404 для отсутствующих сущностей
- 422 для валидации
- 401/403 для auth/access
- единый error response format

### 2.4 Результат этапа
- Любая сущность контента может быть создана/изменена/удалена через admin API и фактически отражается в БД.

---

## Этап 3 — Миграция admin frontend с `localStorage` на API (P0)

### 3.1 Экран `admin/homepage`
- При загрузке: `GET` из admin/content API.
- При сохранении: `PUT/PATCH` в API.
- Убрать постоянное хранение контента в `localStorage`.

### 3.2 Экран `admin/menu`
- Заменить `localStorage` на CRUD через API (`menu items`).
- Добавить drag/drop order (опционально) + `order` persistence.

### 3.3 Остальные экраны
- `admin/pages`, `admin/blog` (если в scope текущего релиза) перевести на DB-backed API.

### 3.4 UX админки
- Стандартизировать состояния: loading/saving/success/error.
- Оптимистичные обновления только при наличии rollback.
- Подтверждение destructive-операций.

### 3.5 Результат этапа
- Админка — полноценный интерфейс управления БД-контентом.

---

## Этап 4 — Безопасность и контроль доступа (P0/P1)

### 4.1 Аутентификация/авторизация
- JWT `SECRET_KEY` только из env.
- Access token validation middleware/dependency для всех admin endpoints.
- Снять зависимость от `adminLoggedIn` флага как критерия доступа.

### 4.2 CORS и конфигурация
- CORS origins из env-конфига.
- Удалить опасные default secrets из исходников.

### 4.3 Пароли и аудит
- Проверить Argon2 hashing pipeline.
- Добавить audit trail минимум для критичных обновлений (кто/когда/что поменял).

### 4.4 Результат этапа
- Защищенный admin контур, соответствующий базовым production требованиям.

---

## Этап 5 — Схема БД и миграции (P1)

### 5.1 Нормализация моделей
- Исправить несогласованные/опечатанные поля.
- Вычистить questionable `unique=True` на контентных полях.
- Проверить локализованные RU/EN поля на симметричность.

### 5.2 Миграции Alembic
- Создать миграции под исправления схем.
- Прогнать миграции на staging snapshot.
- Подготовить rollback сценарии.

### 5.3 Seed/Bootstrap
- Добавить команду инициализации базового контента (hero/about/menu и т.д.).

### 5.4 Результат этапа
- Консистентная БД-схема под CMS-эксплуатацию.

---

## Этап 6 — Контрактные тесты и интеграционные проверки (P1)

### 6.1 Backend тесты
- Unit: use-cases.
- Integration: repository + DB.
- API contract tests: публичные и admin endpoints.

### 6.2 Сквозные CMS тесты (критично)
Минимум 3 сценария:
1. Admin обновляет Hero → Public `/api/page-data` отдает обновление.
2. Admin добавляет Service → секция services обновляется на фронте.
3. Admin меняет Footer/Menu → публичный UI рендерит новое значение.

### 6.3 Frontend
- Type checks + lint + build
- Smoke тесты ключевых страниц.

### 6.4 Результат этапа
- Подтвержденный end-to-end путь «админка → БД → публичный фронт».

---

## Этап 7 — CI/CD и эксплуатация (P1/P2)

### 7.1 CI pipeline
- backend: lint + test
- frontend: lint + typecheck + build
- migration check (dry-run)

### 7.2 Release discipline
- changelog
- semver/tag
- migration notes

### 7.3 Observability
- health endpoints
- structured logs
- error budget metrics

### 7.4 Результат этапа
- Автоматический контроль качества до merge/deploy.

---

## 4. Детализированный backlog (первые 4 спринта)

## Спринт 1 (1 неделя) — «Собирается и читает корректно»
- [ ] Починить frontend `lib/api`, `lib/utils`.
- [ ] Синхронизировать `PageDataSchema` с реальным payload.
- [ ] Исправить footer mapping/serialization.
- [ ] Проверить `GET /api/page-data` + рендер главной.

**DoD:** сборка frontend зеленая, главная грузит весь контент из API.

## Спринт 2 (1 неделя) — «Запись в БД через admin API»
- [ ] DB-backed `AdminRepositoryImpl`.
- [ ] CRUD endpoints для hero/about/services/projects.
- [ ] JWT guard для admin endpoints.

**DoD:** изменения из Postman/Swagger фиксируются в БД и читаются public API.

## Спринт 3 (1 неделя) — «Админка без localStorage»
- [ ] `admin/homepage` миграция на API.
- [ ] `admin/menu` миграция на API.
- [ ] Унификация сохранения/ошибок/loading состояния.

**DoD:** админка сохраняет контент только через API/БД.

## Спринт 4 (1 неделя) — «Контракты, тесты, CI»
- [ ] Контрактные API тесты.
- [ ] 3 e2e CMS сценария.
- [ ] CI quality gates.

**DoD:** PR не мержится при падении тестов/сборки.

---

## 5. Матрица ответственности (кто за что)

- **Backend:** модели, миграции, admin/public API, security.
- **Frontend public:** только рендер API-данных.
- **Frontend admin:** формы редактирования + API integration + UX состояний.
- **DevOps:** CI/CD, env management, observability.

---

## 6. Риски и меры

1. **Ломка контракта между frontend/backend**
   - Мера: contract-first + schema tests.
2. **Миграции повредят текущие данные**
   - Мера: backup + staging dry-run + rollback scripts.
3. **Смешение статических и БД-данных в переходный период**
   - Мера: feature flags/section-by-section cutover.
4. **Регрессии в админке**
   - Мера: smoke e2e на ключевые формы.

---

## 7. KPI модернизации

- 100% публичного контента рендерится из БД через API.
- 0 критичных секций управляется только localStorage.
- 100% admin content endpoints защищены JWT.
- Успешные CI сборки >95%.
- Время доставки контент-изменения (admin save → public visible) < 5 сек.

---

## 8. Definition of Done (глобальный)

Модернизация считается завершенной, когда:

1. Все контентные секции редактируются в админке и сохраняются в БД.
2. Публичный frontend не содержит hardcoded CMS-контента.
3. Контракт `admin update -> db persist -> public read` покрыт автоматическими тестами.
4. Security baseline выполнен (JWT env secret, guarded routes, CORS via config).
5. Документация запуска/деплоя синхронизирована с реальным compose/Makefile.
