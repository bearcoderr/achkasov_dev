"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft, Calendar } from "lucide-react"

const translations = {
  ru: {
    back: "Вернуться на главную",
    title: "Блог",
    subtitle: "Статьи о разработке и технологиях",
    readMore: "Читать далее",
    articles: [
      {
        id: 1,
        title: "Django: лучшие практики разработки",
        date: "15 января 2024",
        category: "Django",
        excerpt:
          "Рассмотрим современные подходы к организации проектов на Django, паттерны проектирования и оптимизацию производительности.",
      },
      {
        id: 2,
        title: "JWT аутентификация в Django REST Framework",
        date: "10 января 2024",
        category: "API",
        excerpt:
          "Полное руководство по реализации безопасной аутентификации с использованием JSON Web Tokens в Django приложениях.",
      },
      {
        id: 3,
        title: "Docker для Django проектов",
        date: "5 января 2024",
        category: "DevOps",
        excerpt:
          "Настройка Docker-контейнеров для Django приложений, оптимизация образов и организация multi-stage builds.",
      },
    ],
  },
  en: {
    back: "Back to home",
    title: "Blog",
    subtitle: "Articles about development and technologies",
    readMore: "Read more",
    articles: [
      {
        id: 1,
        title: "Django: Development Best Practices",
        date: "January 15, 2024",
        category: "Django",
        excerpt:
          "Let's explore modern approaches to organizing Django projects, design patterns, and performance optimization.",
      },
      {
        id: 2,
        title: "JWT Authentication in Django REST Framework",
        date: "January 10, 2024",
        category: "API",
        excerpt: "Complete guide to implementing secure authentication using JSON Web Tokens in Django applications.",
      },
      {
        id: 3,
        title: "Docker for Django Projects",
        date: "January 5, 2024",
        category: "DevOps",
        excerpt:
          "Setting up Docker containers for Django applications, optimizing images, and organizing multi-stage builds.",
      },
    ],
  },
}

export default function BlogPage() {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "ru" | "en"
    if (savedLang) setLang(savedLang)
  }, [])

  const t = translations[lang]

  const categories = ["all", ...Array.from(new Set(t.articles.map((a) => a.category)))]

  const filteredArticles =
    selectedCategory === "all" ? t.articles : t.articles.filter((article) => article.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-6 py-20">
        <Link
          href="/"
          className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {t.back}
        </Link>

        <div className="mb-16">
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">{t.title}</h1>
          <p className="text-xl text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {category === "all" ? (lang === "ru" ? "Все" : "All") : category}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Link key={article.id} href={`/blog/article-${article.id}`} className="group">
              <Card className="h-full border-border/40 bg-card/50 p-8 transition-all hover:border-primary/40">
                <div className="mb-4 flex items-center gap-4 text-xs">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={14} />
                    <span>{article.date}</span>
                  </div>
                </div>
                <h2 className="mb-4 text-2xl font-semibold group-hover:text-primary">{article.title}</h2>
                <p className="mb-6 leading-relaxed text-muted-foreground">{article.excerpt}</p>
                <span className="font-medium text-primary">{t.readMore} →</span>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
