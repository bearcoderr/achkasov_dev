# 🎨 Portfolio Frontend

Современный фронтенд для портфолио, построенный на Next.js 16 с TypeScript и Tailwind CSS.

## 📋 Описание

Интерактивный веб-сайт портфолио с админ-панелью для управления контентом. Использует современный стек технологий для создания быстрого и отзывчивого пользовательского интерфейса.

## 🛠️ Технологический стек

- **Framework**: Next.js 16.0.10
- **Язык**: TypeScript 5
- **UI Library**: React 19.2.0
- **Стилизация**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **Формы**: React Hook Form + Zod
- **Иконки**: Lucide React
- **Темизация**: next-themes

## 📁 Структура проекта

```
frontend/
├── app/                    # Next.js App Router
│   ├── admin/             # Админ-панель
│   │   ├── blog/          # Управление блогом
│   │   ├── dashboard/     # Дашборд
│   │   ├── homepage/      # Редактирование главной
│   │   ├── pages/         # Управление страницами
│   │   └── submissions/   # Заявки с формы
│   ├── blog/              # Публичный блог
│   ├── layout.tsx         # Корневой layout
│   ├── page.tsx           # Главная страница
│   └── globals.css        # Глобальные стили
├── components/            # React компоненты
│   ├── ui/               # UI компоненты (Radix UI)
│   ├── header.tsx        # Шапка сайта
│   ├── footer.tsx        # Подвал
│   └── ...               # Другие компоненты
├── hooks/                # Custom React hooks
├── public/               # Статические файлы
├── styles/               # Дополнительные стили
├── package.json          # Зависимости
├── next.config.mjs       # Конфигурация Next.js
└── tsconfig.json         # Конфигурация TypeScript
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ (рекомендуется 20+)
- npm, yarn или pnpm

### Установка

1. **Клонируйте репозиторий и перейдите в ветку frontend:**

```bash
git checkout frontend
```

2. **Установите зависимости:**

```bash
npm install
# или
yarn install
# или
pnpm install
```

3. **Настройте переменные окружения:**

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

4. **Запустите dev сервер:**

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
```

Приложение будет доступно по адресу: http://localhost:3000

## 📦 Доступные команды

```bash
# Разработка
npm run dev          # Запустить dev сервер

# Сборка
npm run build        # Собрать production версию
npm run start        # Запустить production сервер

# Линтинг
npm run lint         # Проверить код линтером
```

## 🎨 Компоненты

Проект использует библиотеку компонентов на базе Radix UI:

- **Формы**: Input, Textarea, Select, Checkbox, Radio
- **Навигация**: Navigation Menu, Breadcrumb, Pagination
- **Оверлеи**: Dialog, Popover, Tooltip, Dropdown Menu
- **Отображение**: Card, Table, Accordion, Tabs
- **Обратная связь**: Toast, Alert, Progress, Spinner

Все компоненты находятся в `components/ui/` и полностью типизированы.

## 🌙 Темная тема

Проект поддерживает темную и светлую темы через `next-themes`. Переключение темы происходит автоматически на основе системных настроек пользователя.

## 📱 Адаптивность

Все компоненты адаптивны и оптимизированы для:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔐 Админ-панель

Админ-панель доступна по пути `/admin` и включает:

- **Dashboard** - общая статистика
- **Homepage** - редактирование главной страницы
- **Blog** - управление статьями блога
- **Pages** - управление страницами сайта
- **Submissions** - просмотр заявок с формы обратной связи

Для доступа требуется авторизация через API.

## 🔌 Интеграция с API

Фронтенд взаимодействует с Backend API через:

```typescript
// Пример использования
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/page`);
const data = await response.json();
```

Все API вызовы должны быть настроены в соответствующих компонентах или хуках.

## 🎯 Особенности

- ⚡ Server-Side Rendering (SSR)
- 🔄 Static Site Generation (SSG)
- 📱 Полная адаптивность
- 🌙 Поддержка темной темы
- ♿ Доступность (a11y)
- 🎨 Современный UI/UX
- 📝 TypeScript для типобезопасности
- 🚀 Оптимизация производительности

## 🧪 Тестирование

```bash
# Запустить тесты (если настроены)
npm test
```

## 🏗️ Сборка для production

```bash
# Создать production сборку
npm run build

# Запустить production сервер
npm run start
```

Оптимизированная сборка включает:
- Минификацию кода
- Tree shaking
- Code splitting
- Оптимизацию изображений
- Кэширование статических ресурсов

## 📦 Деплой

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Деплой произойдет автоматически

### Другие платформы

Проект можно задеплоить на:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Любой хостинг с поддержкой Node.js

## 🔧 Конфигурация

### Next.js

Настройки находятся в `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ваши настройки
}
```

### TypeScript

Конфигурация TypeScript в `tsconfig.json` настроена для строгой типизации.

### Tailwind CSS

Стили настраиваются через `tailwind.config.js` и `globals.css`.

## 📄 Лицензия

Проект является частью монорепозитория портфолио.

## 🔗 Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
