"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Script from "next/script"
import { ChevronLeft, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import hljs from "highlight.js/lib/common"

type Localized = { ru: string; en: string }

type BlogPost = {
  id: number
  slug: string
  title: Localized
  excerpt: Localized
  content: Localized
  cover_image_url: string
  published_at: string | null
  category: { id: number; name: Localized; slug: string } | null
}

type BlogComment = {
  id: number
  name: string
  message: string
  created_at: string | null
  reply_message?: string | null
  replied_at?: string | null
}

export default function BlogArticlePage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug

  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [article, setArticle] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formSuccess, setFormSuccess] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [comments, setComments] = useState<BlogComment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem("lang")
    if (saved === "ru" || saved === "en") setLang(saved)
  }, [])

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      setError("Article not found")
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)

    fetch(`/api/blog/posts/${encodeURIComponent(String(slug))}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          const message = data?.detail || "Article not found"
          throw new Error(message)
        }
        return res.json()
      })
      .then((data: BlogPost) => {
        if (cancelled) return
        setArticle(data)
      })
      .catch((err: Error) => {
        if (cancelled) return
        const message = err?.name === "AbortError" ? "Request timeout" : err.message
        setError(message || "Article not found")
        setArticle(null)
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
        window.clearTimeout(timeout)
      })

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [slug])

  useEffect(() => {
    if (!slug) {
      setComments([])
      setCommentsLoading(false)
      return
    }
    let cancelled = false
    setCommentsLoading(true)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    fetch(`/api/blog/posts/${encodeURIComponent(String(slug))}/comments`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: BlogComment[]) => {
        if (cancelled) return
        setComments(data || [])
      })
      .catch(() => {
        if (cancelled) return
        setComments([])
      })
      .finally(() => {
        if (cancelled) return
        setCommentsLoading(false)
        window.clearTimeout(timeout)
      })

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [slug])

  const title = useMemo(() => {
    if (!article) return ""
    return lang === "ru" ? article.title.ru : article.title.en
  }, [article, lang])

  const excerpt = useMemo(() => {
    if (!article) return ""
    return lang === "ru" ? article.excerpt.ru : article.excerpt.en
  }, [article, lang])

  const content = useMemo(() => {
    if (!article) return ""
    return lang === "ru" ? article.content.ru : article.content.en
  }, [article, lang])

  const publishedAt = useMemo(() => {
    if (!article?.published_at) return ""
    const date = new Date(article.published_at)
    if (Number.isNaN(date.getTime())) return ""
    return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }, [article?.published_at, lang])

  const isHtmlContent = useMemo(() => {
    if (!content) return false
    return /<\/?[a-z][\s\S]*>/i.test(content)
  }, [content])

  const { textContent, isCodeBlock } = useMemo(() => {
    const trimmed = content.trim()
    const codeBlockMatch = trimmed.match(/^<pre><code>([\s\S]*)<\/code><\/pre>$/i)
    if (codeBlockMatch) {
      return { textContent: codeBlockMatch[1], isCodeBlock: true }
    }
    return { textContent: content, isCodeBlock: false }
  }, [content])

  useEffect(() => {
    if (!contentRef.current) return
    const root = contentRef.current

    const applyEnhancements = () => {
      const blocks = root.querySelectorAll("pre")

      blocks.forEach((pre) => {
        if (!(pre instanceof HTMLElement)) return
        const code = pre.querySelector("code") as HTMLElement | null
        if (!code) return

        if (!pre.classList.contains("code-block")) {
          pre.classList.add("code-block")
        }

        if (!code.classList.contains("hljs")) {
          hljs.highlightElement(code)
        }

        if (!pre.querySelector(".code-copy-btn")) {
          const button = document.createElement("button")
          button.type = "button"
          button.className = "code-copy-btn"
          button.textContent = lang === "ru" ? "Скопировать" : "Copy"
          button.addEventListener("click", async () => {
            try {
              await navigator.clipboard.writeText(code.innerText)
              button.setAttribute("data-copied", "true")
              button.textContent = lang === "ru" ? "Скопировано" : "Copied"
              window.setTimeout(() => {
                button.removeAttribute("data-copied")
                button.textContent = lang === "ru" ? "Скопировать" : "Copy"
              }, 1400)
            } catch {
              // no-op
            }
          })
          pre.appendChild(button)
        } else {
          const existing = pre.querySelector(".code-copy-btn") as HTMLButtonElement | null
          if (existing && !existing.getAttribute("data-copied")) {
            existing.textContent = lang === "ru" ? "Скопировать" : "Copy"
          }
        }
      })
    }

    const raf = window.requestAnimationFrame(applyEnhancements)
    const timeout = window.setTimeout(applyEnhancements, 50)
    const timeout2 = window.setTimeout(applyEnhancements, 250)

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(timeout)
      window.clearTimeout(timeout2)
    }
  }, [content, lang, isHtmlContent, isCodeBlock])

  const t = {
    ru: {
      contactTitle: "Свяжитесь со мной",
      contactSubtitle: "Оставьте сообщение, и я отвечу в ближайшее время.",
      name: "Ваше имя *",
      email: "Email *",
      phone: "Телефон",
      message: "Сообщение *",
      send: "Отправить",
      success: "Спасибо! Комментарий отправлен и появится после модерации.",
      submitError: "Ошибка отправки. Попробуйте позже.",
      required: "Это поле обязательно",
      invalidEmail: "Неверный формат email",
      minLength: "Минимум 2 символа",
      messageMin: "Минимум 10 символов",
    },
    en: {
      contactTitle: "Get in Touch",
      contactSubtitle: "Leave a message and I'll get back to you soon.",
      name: "Your name *",
      email: "Email *",
      phone: "Phone",
      message: "Message *",
      send: "Send",
      success: "Thanks! Your comment was sent and will appear after moderation.",
      submitError: "Failed to send. Please try again.",
      required: "This field is required",
      invalidEmail: "Invalid email format",
      minLength: "Minimum 2 characters",
      messageMin: "Minimum 10 characters",
    },
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const articleJsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title || undefined,
        description: excerpt || undefined,
        url: baseUrl ? `${baseUrl}/blog/${article.slug}` : `/blog/${article.slug}`,
        datePublished: article.published_at || undefined,
        image: article.cover_image_url || undefined,
        inLanguage: lang === "ru" ? "ru-RU" : "en-US",
        author: {
          "@type": "Person",
          name: "BearCoder",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": baseUrl ? `${baseUrl}/blog/${article.slug}` : `/blog/${article.slug}`,
        },
      }
    : null

  const validateForm = () => {
    const nextErrors: Record<string, string> = {}
    if (!formData.name.trim()) nextErrors.name = t[lang].required
    else if (formData.name.trim().length < 2) nextErrors.name = t[lang].minLength

    if (!formData.email.trim()) nextErrors.email = t[lang].required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = t[lang].invalidEmail

    if (!formData.message.trim()) nextErrors.message = t[lang].required
    else if (formData.message.trim().length < 10) nextErrors.message = t[lang].messageMin

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm()) return
    setFormLoading(true)
    setFormSuccess(false)

    try {
      const response = await fetch(`/api/blog/posts/${encodeURIComponent(String(slug))}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setFormSuccess(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
      setFormErrors({})
    } catch {
      setFormErrors({ submit: t[lang].submitError })
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-6 py-20">
        {articleJsonLd && (
          <Script
            id="ld-blog-article"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
        )}
        <Link
          href="/blog"
          className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {lang === "ru" ? "Назад к блогу" : "Back to blog"}
        </Link>

        {loading && (
          <div className="text-muted-foreground">{lang === "ru" ? "Загрузка..." : "Loading..."}</div>
        )}

        {!loading && error && (
          <div className="text-destructive">
            {lang === "ru" ? "Статья не найдена" : "Article not found"}
          </div>
        )}

        {!loading && !error && article && (
          <article className="space-y-8">
            {article.cover_image_url && (
              <div className="overflow-hidden rounded-2xl border border-border/40">
                <img src={article.cover_image_url} alt={title} className="h-72 w-full object-cover" />
              </div>
            )}

            <div className="space-y-4">
              {article.category && (
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {lang === "ru" ? article.category.name.ru : article.category.name.en}
                </span>
              )}
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {publishedAt && (
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={16} />
                    {publishedAt}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <User size={16} />
                  BearCoder
                </span>
              </div>
            </div>

            {isHtmlContent && !isCodeBlock ? (
              <div
                ref={contentRef}
                className="prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div
                ref={contentRef}
                className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90"
              >
                {textContent}
              </div>
            )}

            <section className="mt-12 space-y-8">
              <div className="mx-auto max-w-2xl rounded-2xl border border-border/40 bg-card/50 p-8">
              <div className="mb-6 space-y-2">
                <h2 className="text-2xl font-semibold">{t[lang].contactTitle}</h2>
                <p className="text-sm text-muted-foreground">{t[lang].contactSubtitle}</p>
              </div>

              {formSuccess && <div className="mb-4 text-sm text-emerald-600">{t[lang].success}</div>}
              {formErrors.submit && <div className="mb-4 text-sm text-red-500">{formErrors.submit}</div>}

              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-1">
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t[lang].name}
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                </div>
                <div className="md:col-span-1">
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t[lang].email}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t[lang].phone}
                  />
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t[lang].message}
                    rows={5}
                    className={formErrors.message ? "border-red-500" : ""}
                  />
                  {formErrors.message && <p className="mt-1 text-xs text-red-500">{formErrors.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={formLoading} className="w-full">
                    {formLoading ? "..." : t[lang].send}
                  </Button>
                </div>
              </form>
              </div>

              <div className="mx-auto max-w-2xl">
                <h3 className="mb-4 text-lg font-semibold">
                  {lang === "ru" ? "Комментарии" : "Comments"} ({comments.length})
                </h3>
                {commentsLoading && <div className="text-sm text-muted-foreground">{t[lang].loading}</div>}
                {!commentsLoading && comments.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    {lang === "ru" ? "Комментариев пока нет." : "No comments yet."}
                  </div>
                )}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-border/40 bg-card/30 p-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/90">{comment.name}</span>
                        {comment.created_at && (
                          <span>
                            {new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }).format(new Date(comment.created_at))}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                        {comment.message}
                      </p>
                      {comment.reply_message && (
                        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                          <div className="text-xs font-semibold text-primary">
                            {lang === "ru" ? "Ответ администратора" : "Admin reply"}
                          </div>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
                            {comment.reply_message}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </article>
        )}
      </main>
    </div>
  )
}
