"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ChevronLeft, Calendar, User } from "lucide-react"
import { useParams } from "next/navigation"

const articlesData = {
  "article-1": {
    ru: {
      title: "Django: лучшие практики разработки",
      date: "15 января 2024",
      category: "Django",
      content: `
Django — это мощный Python-фреймворк для веб-разработки, который позволяет быстро создавать надежные приложения. В этой статье мы рассмотрим проверенные практики, которые помогут вам писать чистый, масштабируемый код.

## Структура проекта

Правильная организация кода — основа успешного проекта. Рекомендую использовать следующую структуру:

- Разделяйте приложения по функциональности
- Используйте отдельные файлы для settings (dev, prod)
- Храните секретные данные в переменных окружения
- Организуйте модели, views и serializers в отдельных модулях

## Работа с моделями

Django ORM предоставляет мощные инструменты для работы с базой данных:

- Используйте select_related и prefetch_related для оптимизации запросов
- Добавляйте индексы для часто используемых полей
- Применяйте migrations для версионирования схемы БД
- Используйте custom managers для повторяющейся логики

## API разработка

Для создания RESTful API используйте Django REST Framework:

- Разделяйте сериализаторы для чтения и записи
- Применяйте ViewSets для стандартных CRUD операций
- Используйте permissions для контроля доступа
- Добавляйте пагинацию для списков объектов

## Безопасность

Не забывайте о безопасности:

- Включайте CSRF защиту
- Используйте HTTPS в production
- Валидируйте все входящие данные
- Ограничивайте rate limits для API

## Тестирование

Покрывайте код тестами:

- Используйте pytest для удобного тестирования
- Применяйте fixtures для подготовки данных
- Тестируйте edge cases
- Автоматизируйте запуск тестов в CI/CD

## Производительность

Оптимизируйте приложение:

- Используйте Django Debug Toolbar для анализа
- Кэшируйте часто используемые данные
- Применяйте Celery для фоновых задач
- Оптимизируйте медиафайлы

Следуя этим практикам, вы создадите качественное и поддерживаемое приложение на Django.
      `,
    },
    en: {
      title: "Django: Development Best Practices",
      date: "January 15, 2024",
      category: "Django",
      content: `
Django is a powerful Python web framework that enables rapid development of reliable applications. In this article, we'll explore proven practices that will help you write clean, scalable code.

## Project Structure

Proper code organization is the foundation of a successful project. I recommend the following structure:

- Separate applications by functionality
- Use separate files for settings (dev, prod)
- Store secrets in environment variables
- Organize models, views, and serializers in separate modules

## Working with Models

Django ORM provides powerful tools for database operations:

- Use select_related and prefetch_related for query optimization
- Add indexes for frequently used fields
- Apply migrations for DB schema versioning
- Use custom managers for recurring logic

## API Development

Use Django REST Framework for building RESTful APIs:

- Separate serializers for read and write operations
- Apply ViewSets for standard CRUD operations
- Use permissions for access control
- Add pagination for object lists

## Security

Don't forget about security:

- Enable CSRF protection
- Use HTTPS in production
- Validate all incoming data
- Limit rate limits for APIs

## Testing

Cover your code with tests:

- Use pytest for convenient testing
- Apply fixtures for data preparation
- Test edge cases
- Automate test execution in CI/CD

## Performance

Optimize your application:

- Use Django Debug Toolbar for analysis
- Cache frequently used data
- Apply Celery for background tasks
- Optimize media files

Following these practices will help you build a quality, maintainable Django application.
      `,
    },
  },
  "article-2": {
    ru: {
      title: "JWT аутентификация в Django REST Framework",
      date: "10 января 2024",
      category: "API",
      content: `
JSON Web Tokens (JWT) — это современный стандарт для безопасной передачи информации между сторонами. В этом руководстве мы реализуем JWT аутентификацию в Django.

## Что такое JWT?

JWT — это компактный токен, состоящий из трех частей:

- Header: информация о типе токена и алгоритме шифрования
- Payload: данные пользователя (claims)
- Signature: подпись для проверки целостности

## Установка

Для работы с JWT установим необходимые пакеты:

\`\`\`bash
pip install djangorestframework-simplejwt
\`\`\`

## Настройка Django

Добавьте конфигурацию в settings.py:

- Добавьте authentication classes
- Настройте время жизни токенов
- Укажите алгоритм шифрования
- Настройте refresh tokens

## Создание endpoints

Реализуем endpoints для:

- Получения токенов (login)
- Обновления токенов (refresh)
- Валидации токенов
- Logout (добавление в blacklist)

## Защита views

Используйте декораторы для защиты endpoints:

- @permission_classes для проверки прав
- IsAuthenticated для авторизованных пользователей
- Custom permissions для сложной логики

## Работа с токенами на клиенте

На фронтенде:

- Храните access token в памяти
- Refresh token в httpOnly cookies
- Автоматически обновляйте токены
- Обрабатывайте истечение срока

## Безопасность

Важные аспекты безопасности:

- Используйте HTTPS
- Короткое время жизни access токенов
- Храните secret key в переменных окружения
- Реализуйте token rotation

JWT — отличный выбор для современных API. Следуя этим рекомендациям, вы создадите безопасную систему аутентификации.
      `,
    },
    en: {
      title: "JWT Authentication in Django REST Framework",
      date: "January 10, 2024",
      category: "API",
      content: `
JSON Web Tokens (JWT) are a modern standard for securely transmitting information between parties. In this guide, we'll implement JWT authentication in Django.

## What is JWT?

JWT is a compact token consisting of three parts:

- Header: information about token type and encryption algorithm
- Payload: user data (claims)
- Signature: signature to verify integrity

## Installation

To work with JWT, install the necessary packages:

\`\`\`bash
pip install djangorestframework-simplejwt
\`\`\`

## Django Configuration

Add configuration to settings.py:

- Add authentication classes
- Configure token lifetime
- Specify encryption algorithm
- Set up refresh tokens

## Creating Endpoints

Implement endpoints for:

- Obtaining tokens (login)
- Refreshing tokens (refresh)
- Validating tokens
- Logout (adding to blacklist)

## Protecting Views

Use decorators to protect endpoints:

- @permission_classes for permission checks
- IsAuthenticated for authorized users
- Custom permissions for complex logic

## Working with Tokens on Client

On the frontend:

- Store access token in memory
- Refresh token in httpOnly cookies
- Automatically refresh tokens
- Handle token expiration

## Security

Important security aspects:

- Use HTTPS
- Short access token lifetime
- Store secret key in environment variables
- Implement token rotation

JWT is an excellent choice for modern APIs. Following these recommendations, you'll create a secure authentication system.
      `,
    },
  },
  "article-3": {
    ru: {
      title: "Docker для Django проектов",
      date: "5 января 2024",
      category: "DevOps",
      content: `
Docker revolutionizes the way we develop and deploy applications. In this article, we'll learn how to properly containerize Django projects.

## Почему Docker?

Docker solves the "works on my machine" problem:

- Same environment for all developers
- Simple server deployment
- Dependency isolation
- Application scalability

## Создание Dockerfile

Basic Dockerfile for Django:

- Use official Python image
- Install dependencies as separate layer
- Copy application code
- Configure ENTRYPOINT

## Docker Compose

For local development, use docker-compose:

- Service for Django application
- Service for PostgreSQL
- Service for Redis (cache/queues)
- Volumes for persistent data

## Multi-stage Builds

Optimize image size:

- Use builder stage for dependencies
- Production stage with only necessary files
- Remove dev dependencies
- Optimize layers

## Production Settings

For production:

- Use gunicorn/uwsgi
- Configure nginx as reverse proxy
- Add healthchecks
- Log to stdout/stderr

## CI/CD Integration

Automate the process:

- Build images in CI
- Test in containers
- Publish to registry
- Deploy using docker

## Secrets and Variables

Secure configuration management:

- Use .env files
- Docker secrets for sensitive data
- Don't store secrets in images
- Use build args

Docker greatly simplifies Django application development and deployment. Start using containerization today!
      `,
    },
    en: {
      title: "Docker for Django Projects",
      date: "January 5, 2024",
      category: "DevOps",
      content: `
Docker revolutionizes the way we develop and deploy applications. In this article, we'll learn how to properly containerize Django projects.

## Why Docker?

Docker solves the "works on my machine" problem:

- Same environment for all developers
- Simple server deployment
- Dependency isolation
- Application scalability

## Creating Dockerfile

Basic Dockerfile for Django:

- Use official Python image
- Install dependencies as separate layer
- Copy application code
- Configure ENTRYPOINT

## Docker Compose

For local development, use docker-compose:

- Service for Django application
- Service for PostgreSQL
- Service for Redis (cache/queues)
- Volumes for persistent data

## Multi-stage Builds

Optimize image size:

- Use builder stage for dependencies
- Production stage with only necessary files
- Remove dev dependencies
- Optimize layers

## Production Settings

For production:

- Use gunicorn/uwsgi
- Configure nginx as reverse proxy
- Add healthchecks
- Log to stdout/stderr

## CI/CD Integration

Automate the process:

- Build images in CI
- Test in containers
- Publish to registry
- Deploy using docker

## Secrets and Variables

Secure configuration management:

- Use .env files
- Docker secrets for sensitive data
- Don't store secrets in images
- Use build args

Docker greatly simplifies Django application development and deployment. Start using containerization today!
      `,
    },
  },
}

const translations = {
  ru: {
    back: "Вернуться к блогу",
    formTitle: "Оставьте комментарий",
    formName: "Имя",
    formEmail: "Email",
    formMessage: "Сообщение",
    formSubmit: "Отправить",
    formSuccess: "Спасибо за ваше сообщение!",
    tocTitle: "Содержание",
  },
  en: {
    back: "Back to blog",
    formTitle: "Leave a comment",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Message",
    formSubmit: "Submit",
    formSuccess: "Thank you for your message!",
    tocTitle: "Table of Contents",
  },
}

export default function ArticlePage() {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [toc, setToc] = useState<{ id: string; title: string }[]>([])
  const params = useParams()
  const slug = params?.slug as string

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "ru" | "en"
    if (savedLang) setLang(savedLang)
  }, [])

  useEffect(() => {
    if (articlesData[slug]?.[lang]) {
      const headings = articlesData[slug][lang].content
        .split("\n")
        .filter((line) => line.startsWith("## "))
        .map((line, i) => ({
          id: `heading-${i}`,
          title: line.replace("## ", ""),
        }))
      setToc(headings)
    }
  }, [slug, lang])

  const t = translations[lang]
  const article = articlesData[slug]?.[lang]

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xl">Article not found</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-7xl px-6 py-20">
        <Link
          href="/blog"
          className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {t.back}
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <article>
            <div className="mb-8">
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                {article.category}
              </span>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl">{article.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Aleksey Achkasov</span>
                </div>
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              {article.content.split("\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  const headingIndex = toc.findIndex((h) => h.title === paragraph.replace("## ", ""))
                  return (
                    <h2 key={i} id={`heading-${headingIndex}`} className="mb-4 mt-12 text-2xl font-bold">
                      {paragraph.replace("## ", "")}
                    </h2>
                  )
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={i} className="mb-2 ml-6 list-disc text-muted-foreground">
                      {paragraph.replace("- ", "")}
                    </li>
                  )
                }
                if (paragraph.startsWith("```")) {
                  return null
                }
                if (paragraph.trim()) {
                  return (
                    <p key={i} className="mb-6 leading-relaxed text-foreground">
                      {paragraph}
                    </p>
                  )
                }
                return null
              })}
            </div>

            <Card className="glass-card mt-12 border-border/40 p-8">
              <h2 className="mb-6 text-2xl font-bold">{t.formTitle}</h2>
              {submitted ? (
                <div className="rounded-lg bg-primary/10 p-6 text-center">
                  <p className="font-medium text-primary">{t.formSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t.formName}
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.formEmail}
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Textarea
                      id="message"
                      placeholder={t.formMessage}
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    {t.formSubmit}
                  </Button>
                </form>
              )}
            </Card>
          </article>

          <aside className="hidden lg:block">
            <div className="glass-card sticky top-24 rounded-xl border-border/40 p-6 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">{t.tocTitle}</h3>
              <nav className="space-y-2">
                {toc.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="block text-sm text-foreground/70 transition-colors hover:text-primary"
                  >
                    {heading.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
