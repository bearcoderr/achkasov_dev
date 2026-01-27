"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ServiceModal from "@/components/service-modal"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import ScrollReveal from "@/components/scroll-reveal"
import { api, type PageData } from "@/lib/api"

export default function Home() {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [mounted, setMounted] = useState(false)

  // API Data States
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Убираем hydration mismatch - загружаем язык только после монтирования
  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem("lang") as "ru" | "en"
    if (savedLang) setLang(savedLang)
  }, [])

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await api.getPageData()
        setPageData(data)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleLang = () => {
    const newLang = lang === "ru" ? "en" : "ru"
    setLang(newLang)
    localStorage.setItem("lang", newLang)
  }

  // Показываем пустой экран до монтирования (избегаем hydration mismatch)
  if (!mounted) {
    return null
  }

  // Loading state
  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-muted-foreground">
              {lang === "ru" ? "Загрузка..." : "Loading..."}
            </p>
          </div>
        </div>
    )
  }

  // Error state
  if (error || !pageData) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="mb-2 text-xl font-bold">
              {lang === "ru" ? "Ошибка загрузки данных" : "Error loading data"}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {error || "Unknown error"}
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              {lang === "ru"
                  ? "Убедитесь, что FastAPI сервер запущен на http://localhost:8000"
                  : "Make sure FastAPI server is running on http://localhost:8000"}
            </p>
            <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
            >
              {lang === "ru" ? "Попробовать снова" : "Try again"}
            </button>
          </div>
        </div>
    )
  }

  // Extract data (Деструктуризация с защитой, как мы делали ранее)
  const { hero, about, services, projects, experience, skills, certificates, personal, contact } = pageData || {}

  const currentLang = lang === "ru" ? "ru" : "en"

  // 💡 ИСПРАВЛЕНИЕ: Создание объекта t, который содержит *ТОЛЬКО* переведенные строки
  const t = {
    // 1. HERO SECTION
    hero: {
      name: typeof hero.name === 'string'
          ? hero.name
          : hero.name?.[currentLang] ?? "",

      downloadCV: lang === "ru" ? "Скачать резюме" : "Download CV",
      img: hero.img ?? "",
      // Переводимые поля
      greeting: hero.greeting?.[currentLang] ?? "",
      title: hero.title?.[currentLang] ?? "",
      subtitle: hero.subtitle?.[currentLang] ?? "",
      cv_url: hero.cv_url,
      social_links: hero.social_links ?? {},
    },

    // 2. ABOUT SECTION
    about: {
      title: about.title?.[currentLang],
      text: about.text?.[currentLang],
    },

    // 3. SERVICES SECTION (Список объектов)
    services: {
      title: services[0]?.title?.[currentLang] ? (lang === "ru" ? "Что я могу" : "What I Do") : (lang === "ru" ? "Что я могу" : "What I Do"), // Заглушка, если API не отдает заголовок секции
      readMore: lang === "ru" ? "Подробнее" : "Read more", // Статическая строка
      items: services.map(service => ({
        title: service.title?.[currentLang],
        description: service.description?.[currentLang],
        details: service.details?.[currentLang], // details - это массив строк
      }))
    },

    // 4. PROJECTS SECTION (Список объектов)
    projects: {
      title: projects[0]?.title?.[currentLang] ? (lang === "ru" ? "Проекты" : "Projects") : (lang === "ru" ? "Проекты" : "Projects"), // Заглушка
      items: projects.map(project => ({
        title: project.title?.[currentLang],
        description: project.description?.[currentLang],
        tech: project.tech, // Массив не переводим
      })),
    },

    // 5. EXPERIENCE SECTION (Список объектов)
    experience: {
      title: experience[0]?.position?.[currentLang] ? (lang === "ru" ? "Опыт работы" : "Experience") : (lang === "ru" ? "Опыт работы" : "Experience"), // Заглушка
      items: experience.map(exp => ({
        period: exp.period?.[currentLang],
        position: exp.position?.[currentLang],
        company: exp.company, // Не переводим
        description: exp.description?.[currentLang],
      })),
    },

    // 6. SKILLS SECTION (Список категорий)
    skills: {
      title: skills[0]?.name?.[currentLang] ? (lang === "ru" ? "Навыки" : "Skills") : (lang === "ru" ? "Навыки" : "Skills"), // Заглушка
      categories: skills.map(category => ({
        name: category.name?.[currentLang],
        items: category.items?.[currentLang],
      })),
    },

    // 7. ABOUT ME (PERSONAL FACTS)
    aboutMe: {
      title: lang === "ru" ? "Немного обо мне" : "A bit about me", // Заглушка (нет общего заголовка в API)
      facts: personal.map(fact => ({
        emoji: fact.emoji,
        title: fact.title?.[currentLang],
        description: fact.description?.[currentLang],
      })),
    },

    // 8. CONTACT
    contact: {
      title: contact?.title?.[currentLang] ?? (lang === "ru" ? "Контакты" : "Contact"),
      description: contact?.description?.[currentLang],
      email: contact?.email,
      phone: contact?.phone,
      location: contact?.location?.[currentLang],
    },

    // 9. FOOTER (для подвала)
    footer: {
      // Если в PageData нет отдельного поля footer, используем заглушки или данные из contact/hero
      rights: (lang === "ru" ? "Все права защищены" : "All rights reserved"),
      privacy: (lang === "ru" ? "Политика конфиденциальности" : "Privacy Policy"),
      // Берем соцсети из hero, так как они там точно есть
      social_links: hero?.social_links ?? {}
    },

    // 10. BLOG (Статические заглушки)
    blog: {
      title: lang === "ru" ? "Блог" : "Blog",
      viewAll: lang === "ru" ? "Все статьи" : "View all posts",
    }

  }

  return (
    <div className="relative min-h-screen">
      <Header  />

      <main className="pt-20">
        {/* Hero with Photo */}
        <ScrollReveal>
          <section className="container mx-auto px-6 py-24 md:py-32">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="max-w-2xl">
                <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {t.hero.greeting}

                </p>
                <h1 className="mb-6 text-5xl font-bold tracking-tight text-balance md:text-6xl">{t.hero.name}</h1>
                <p className="mb-2 text-2xl font-medium text-primary md:text-3xl">{t.hero.title}</p>
                <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{t.hero.subtitle}</p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="{t.hero.cv_url}"
                    download
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-lg"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {t.hero.downloadCV}
                  </a>
                  <div className="flex items-center gap-3">
                    {t.hero.social_links.github && (
                        <a
                            href={t.hero.social_links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-lg glass-card transition-all hover:scale-110 hover:bg-primary/20"
                            aria-label="GitHub"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                    )}
                    {t.hero.social_links.linkedin && (
                        <a
                            href={t.hero.social_links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-lg glass-card transition-all hover:scale-110 hover:bg-primary/20"
                            aria-label="LinkedIn"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                    )}
                    {t.hero.social_links.telegram && (
                        <a
                            href={t.hero.social_links.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-lg glass-card transition-all hover:scale-110 hover:bg-primary/20"
                            aria-label="Telegram"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                          </svg>
                        </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px]">
                <Image
                  src={t.hero.img}
                  alt={t.hero.name}
                  fill
                  className="rounded-2xl object-cover"
                  priority
                />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* About */}
        <ScrollReveal>
          <section id="about" className="container mx-auto px-6 py-20">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t.about.title}
                  </h2>
                </div>
              </div>
              <div>
                <p className="text-lg leading-relaxed text-foreground">{t.about.text}</p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Services with Modals */}
        <ScrollReveal>
          <section id="services" className="container mx-auto px-6 py-20">
            <div className="mb-16 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.services.title}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {t.services.items.map((service, i) => (
                <Card
                  key={i}
                  className="glass-card group border-border/40 p-8 transition-all hover:border-primary/40 hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedService(i)}
                >
                  <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>
                  <p className="mb-4 leading-relaxed text-muted-foreground">{service.description}</p>
                  <span className="inline-block self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                    {t.services.readMore} →
                  </span>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Projects */}
        <ScrollReveal>
          <section id="projects" className="container mx-auto px-6 py-20">
            <div className="mb-16 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.projects.title}</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {(showAllProjects ? t.projects.items : t.projects.items.slice(0, 3)).map((project, i) => (
                <Card
                  key={i}
                  className="glass-card border-border/40 p-8 transition-all hover:border-primary/40 hover:scale-105 cursor-pointer"
                >
                  <h3 className="mb-3 text-2xl font-semibold">{project.title}</h3>
                  <p className="mb-6 leading-relaxed text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, j) => (
                      <span key={j} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            {t.projects.items.length > 3 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  {showAllProjects
                    ? lang === "ru"
                      ? "Скрыть"
                      : "Show less"
                    : lang === "ru"
                      ? "Показать еще"
                      : "Show more"}
                </button>
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* Experience */}
        <ScrollReveal>
          <section id="experience" className="container mx-auto px-6 py-20">
            <div className="mb-16 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t.experience.title}
              </h2>
            </div>
            <div className="space-y-16">
              {t.experience.items.map((exp, i) => (
                <div key={i} className="grid gap-8 md:grid-cols-[200px_1fr]">
                  <p className="text-sm font-medium text-muted-foreground">{exp.period}</p>
                  <div>
                    <h3 className="mb-2 text-2xl font-semibold">{exp.position}</h3>
                    <p className="mb-3 text-primary">{exp.company}</p>
                    <p className="leading-relaxed text-muted-foreground">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Skills */}
        <ScrollReveal>
          <section id="skills" className="container mx-auto px-6 py-20">
            <div className="mb-16 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.skills.title}</h2>
            </div>
            <div className="grid gap-12 md:grid-cols-2">
              {t.skills.categories.map((category) => (
                <div key={category.name}>
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {category.items.map((skill, j) => (
                      <span key={j} className="rounded-md bg-muted/50 px-4 py-2 text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Blog Preview */}
        <ScrollReveal>
          <section className="container mx-auto px-6 py-20">
            <div className="mb-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-px w-24 bg-border" />
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.blog.title}</h2>
              </div>
              <Link href="/blog" className="group flex items-center gap-2 text-sm font-medium text-primary">
                {t.blog.viewAll}
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Link key={i} href={`/blog/article-${i}`} className="group">
                  <Card className="glass-card border-border/40 p-8 transition-all hover:border-primary/40">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {lang === "ru" ? "15 января 2024" : "January 15, 2024"}
                    </p>
                    <h3 className="mb-3 text-xl font-semibold group-hover:text-primary">
                      {lang === "ru"
                        ? ["Django: лучшие практики", "JWT аутентификация", "Docker для Django"][i - 1]
                        : ["Django: Best Practices", "JWT Authentication", "Docker for Django"][i - 1]}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {lang === "ru"
                        ? "Разбираемся с современными подходами к разработке..."
                        : "Exploring modern development approaches..."}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Certificates and Courses Section */}
        <ScrollReveal>
          <section id="certificates" className="container mx-auto px-6 py-20">
            <div className="mb-16 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {lang === "ru" ? "Сертификаты и курсы" : "Certificates & Courses"}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedCertificate(i)}
                  className="group cursor-pointer rounded-2xl p-6 glass-card transition-all hover:scale-105"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 013.438 0 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.438 0 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00.806 1.946 3.42 3.42 0 01-3.138 3.138z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{lang === "ru" ? cert.titleRu : cert.titleEn}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">{cert.provider}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {lang === "ru" ? cert.descriptionRu : cert.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* About Me - Personal Facts */}
        <ScrollReveal>
          <section className="container mx-auto px-6 py-20">
            <div className="mb-16 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.aboutMe.title}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {t.aboutMe.facts.map((fact, i) => (
                <Card
                  key={i}
                  className="glass-card border-border/40 p-6 transition-all hover:border-primary/40 hover:scale-105"
                >
                  <div className="mb-4 text-4xl">{fact.emoji}</div>
                  <h3 className="mb-2 text-lg font-semibold">{fact.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{fact.description}</p>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Contact Section */}
        <section id="contact" className="container mx-auto px-6 py-20">
          <div className="mb-16 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.contact.title}
            </h2>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Email */}
              <div className="rounded-2xl p-6 glass-card">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">Email</h3>
                <a href={`mailto:${t.contact.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.contact.email}
                </a>
              </div>

              {/* Phone */}
              <div className="rounded-2xl p-6 glass-card">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{lang === "ru" ? "Телефон" : "Phone"}</h3>
                <a href={`tel:${t.contact.phone.replace(/\s/g, '')}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.contact.phone}
                </a>
              </div>

              {/* Location */}
              <div className="rounded-2xl p-6 glass-card">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{lang === "ru" ? "Местоположение" : "Location"}</h3>
                <p className="text-sm text-muted-foreground">{t.contact.location}</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl p-8 glass-card text-center">
              <p className="mb-4 text-lg text-muted-foreground">{t.contact.description}</p>
              <p className="text-sm text-muted-foreground">
                {lang === "ru" ? "Или воспользуйтесь формой обратной связи в правом нижнем углу" : "Or use the contact form in the bottom right corner"}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} data={t.footer} />

      {/* Service Modal */}
      {selectedService !== null && (
        <ServiceModal
          isOpen={true}
          onClose={() => setSelectedService(null)}
          title={t.services.items[selectedService].title}
          description={t.services.items[selectedService].description}
          details={t.services.items[selectedService].details}
          lang={lang}
        />
      )}

      {/* Certificate Modal */}
      {selectedCertificate !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            className="glass-card relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border-border/40 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1 pr-12">
                <h2 className="text-3xl font-bold">
                  {lang === "ru"
                    ? certificates[selectedCertificate].titleRu
                    : certificates[selectedCertificate].titleEn}
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">{certificates[selectedCertificate].provider}</p>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="rounded-full bg-background/50 p-2 hover:bg-background transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6 overflow-hidden rounded-xl border border-border/40">
              <img
                src={certificates[selectedCertificate].image || "/placeholder.svg"}
                alt={
                  lang === "ru" ? certificates[selectedCertificate].titleRu : certificates[selectedCertificate].titleEn
                }
                className="h-auto w-full"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{lang === "ru" ? "Описание курса" : "Course Description"}</h3>
              <p className="leading-relaxed text-muted-foreground">
                {lang === "ru"
                  ? certificates[selectedCertificate].descriptionRu
                  : certificates[selectedCertificate].descriptionEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
