"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"

type Localized = { ru: string; en: string }

type BlogCategory = {
  id: number
  slug: string
  name: Localized
}

type BlogPost = {
  id: number
  slug: string
  title: Localized
  excerpt: Localized
  cover_image_url: string
  published_at: string | null
  category: BlogCategory | null
}

const labels = {
  ru: {
    back: "Вернуться на главную",
    title: "Блог",
    subtitle: "Статьи о разработке и технологиях",
    readMore: "Читать далее",
    all: "Все",
    sort: "Сортировка",
    newest: "Сначала новые",
    oldest: "Сначала старые",
    titleSort: "По названию",
    empty: "Пока нет опубликованных статей.",
    loading: "Загрузка...",
  },
  en: {
    back: "Back to home",
    title: "Blog",
    subtitle: "Articles about development and technologies",
    readMore: "Read more",
    all: "All",
    sort: "Sort",
    newest: "Newest",
    oldest: "Oldest",
    titleSort: "By title",
    empty: "No published posts yet.",
    loading: "Loading...",
  },
}

export default function BlogPage() {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "ru" | "en" | null
    if (savedLang) setLang(savedLang)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([
      fetch("/api/blog/posts?limit=200").then((res) => res.json()),
      fetch("/api/blog/categories").then((res) => res.json()),
    ])
      .then(([postsData, categoriesData]) => {
        if (cancelled) return
        setPosts(postsData || [])
        setCategories(categoriesData || [])
      })
      .catch(() => {
        if (cancelled) return
        setPosts([])
        setCategories([])
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const t = labels[lang]

  const categoryTabs = useMemo(() => {
    const fromPosts = posts
      .map((post) => post.category)
      .filter(Boolean) as BlogCategory[]
    const map = new Map<string, BlogCategory>()
    ;[...categories, ...fromPosts].forEach((cat) => {
      if (!map.has(cat.slug)) map.set(cat.slug, cat)
    })
    return Array.from(map.values())
  }, [categories, posts])

  const filteredPosts = useMemo(() => {
    const base =
      selectedCategory === "all"
        ? posts
        : posts.filter((post) => post.category?.slug === selectedCategory)

    const sorted = [...base]
    if (sortBy === "oldest") {
      sorted.sort((a, b) => (a.published_at || "").localeCompare(b.published_at || ""))
    } else if (sortBy === "title") {
      sorted.sort((a, b) => {
        const titleA = lang === "ru" ? a.title.ru : a.title.en
        const titleB = lang === "ru" ? b.title.ru : b.title.en
        return titleA.localeCompare(titleB)
      })
    } else {
      sorted.sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""))
    }
    return sorted
  }, [posts, selectedCategory, sortBy, lang])

  const formatDate = (value: string | null) => {
    if (!value) return ""
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

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

        <div className="mb-12">
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">{t.title}</h1>
          <p className="text-xl text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {t.all}
            </button>
            {categoryTabs.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {lang === "ru" ? category.name.ru : category.name.en}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            {t.sort}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
              className="rounded-full border border-border/50 bg-card/50 px-3 py-2 text-sm text-foreground"
            >
              <option value="newest">{t.newest}</option>
              <option value="oldest">{t.oldest}</option>
              <option value="title">{t.titleSort}</option>
            </select>
          </label>
        </div>

        {loading && <div className="text-muted-foreground">{t.loading}</div>}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-muted-foreground">{t.empty}</div>
        )}

        {!loading && filteredPosts.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full border-border/40 bg-card/50 p-8 transition-all hover:border-primary/40">
                  <div className="mb-4 flex items-center gap-4 text-xs">
                    {post.category && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                        {lang === "ru" ? post.category.name.ru : post.category.name.en}
                      </span>
                    )}
                    {post.published_at && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    )}
                  </div>
                  <h2 className="mb-4 text-2xl font-semibold group-hover:text-primary">
                    {lang === "ru" ? post.title.ru : post.title.en}
                  </h2>
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    {lang === "ru" ? post.excerpt.ru : post.excerpt.en}
                  </p>
                  <span className="font-medium text-primary">{t.readMore} →</span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
