"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import axios from "axios"

const RichTextEditor = dynamic(() => import("../../../../../components/RichTextEditor"), { ssr: false })

interface Category {
  id: number
  name: { ru: string; en: string }
  slug: string
}

type PostStatus = "draft" | "published" | "archived"

interface ArticleForm {
  id: number
  title: { ru: string; en: string }
  excerpt: { ru: string; en: string }
  content: { ru: string; en: string }
  slug: string
  category_id: number | null
  status: PostStatus
}

function slugify(value: string) {
  const ruMap: Record<string, string> = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
  }
  const lower = value.trim().toLowerCase()
  const translit = lower
    .split("")
    .map((ch) => ruMap[ch] ?? ch)
    .join("")

  return translit
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-")
}

export default function EditArticle() {
  const router = useRouter()
  const params = useParams()
  const [article, setArticle] = useState<ArticleForm | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const api = axios.create({
    baseURL: "",
  })

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
      return
    }

    const postIdRaw = Array.isArray(params.id) ? params.id[0] : params.id
    const postId = Number(postIdRaw)
    if (!postId || Number.isNaN(postId)) {
      router.push("/admin/blog")
      return
    }

    Promise.all([api.get("/admin-api/blog/categories"), api.get(`/admin-api/blog/posts/${postId}`)])
      .then(([categoriesRes, postRes]) => {
        setCategories(categoriesRes.data || [])
        const data = postRes.data
        setArticle({
          id: data.id,
          title: data.title,
          excerpt: data.excerpt || { ru: "", en: "" },
          content: data.content || { ru: "", en: "" },
          slug: data.slug,
          category_id: data.category_id ?? null,
          status: data.status,
        })
      })
      .catch((err) => {
        console.error("Failed to load post", err)
        setError("Не удалось загрузить статью")
      })
      .finally(() => setIsLoading(false))
  }, [router, params.id])

  const updateSlugIfNeeded = (nextTitleRu: string, nextTitleEn: string) => {
    if (slugTouched) return
    const source = nextTitleRu || nextTitleEn
    setArticle((prev) => (prev ? { ...prev, slug: slugify(source) } : prev))
  }

  const handleSave = async () => {
    if (!article) return

    try {
      await api.put(`/admin-api/blog/posts/${article.id}`, {
        slug: article.slug,
        category_id: article.category_id,
        status: article.status,
        is_active: true,
        published_at: article.status === "published" ? new Date().toISOString() : null,
        cover_image_url: "",
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        tag_ids: [],
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error("Failed to update post", err)
      alert("Не удалось сохранить изменения")
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">Загрузка...</div>
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
        {error || "Статья не найдена"}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <nav className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-6">
              <Link href="/admin/blog" className="text-[#6B9BD1] hover:text-[#5a8bc4] text-sm">
                ← Назад
              </Link>
              <h1 className="text-lg font-medium text-white">Редактирование статьи</h1>
            </div>
            <div className="flex items-center space-x-4">
              {saved && <span className="text-green-600 text-sm">Сохранено</span>}
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors text-sm"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок (RU)</label>
                <input
                  type="text"
                  value={article.title.ru}
                  onChange={(e) => {
                    const nextTitleRu = e.target.value
                    setArticle((prev) => (prev ? { ...prev, title: { ...prev.title, ru: nextTitleRu } } : prev))
                    updateSlugIfNeeded(nextTitleRu, article.title.en)
                  }}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок (EN)</label>
                <input
                  type="text"
                  value={article.title.en}
                  onChange={(e) => {
                    const nextTitleEn = e.target.value
                    setArticle((prev) => (prev ? { ...prev, title: { ...prev.title, en: nextTitleEn } } : prev))
                    updateSlugIfNeeded(article.title.ru, nextTitleEn)
                  }}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Краткое описание (RU)</label>
                <textarea
                  value={article.excerpt.ru}
                  onChange={(e) =>
                    setArticle((prev) =>
                      prev ? { ...prev, excerpt: { ...prev.excerpt, ru: e.target.value } } : prev
                    )
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Краткое описание (EN)</label>
                <textarea
                  value={article.excerpt.en}
                  onChange={(e) =>
                    setArticle((prev) =>
                      prev ? { ...prev, excerpt: { ...prev.excerpt, en: e.target.value } } : prev
                    )
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setArticle((prev) => (prev ? { ...prev, slug: e.target.value } : prev))
                  }}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
                <select
                  value={article.category_id ?? ""}
                  onChange={(e) =>
                    setArticle((prev) =>
                      prev
                        ? {
                            ...prev,
                            category_id: e.target.value ? Number(e.target.value) : null,
                          }
                        : prev
                    )
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name.ru}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Статус</label>
                <select
                  value={article.status}
                  onChange={(e) =>
                    setArticle((prev) => (prev ? { ...prev, status: e.target.value as PostStatus } : prev))
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликовано</option>
                  <option value="archived">Архив</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Контент (RU)</label>
                <RichTextEditor
                  value={article.content.ru}
                  onChange={(value) =>
                    setArticle((prev) =>
                      prev ? { ...prev, content: { ...prev.content, ru: value } } : prev
                    )
                  }
                  onImageUpload={async (file) => {
                    const form = new FormData()
                    form.append("file", file)
                    const res = await api.post("/admin-api/blog/upload-image", form, {
                      headers: { "Content-Type": "multipart/form-data" },
                    })
                    return res.data.url
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Контент (EN)</label>
                <RichTextEditor
                  value={article.content.en}
                  onChange={(value) =>
                    setArticle((prev) =>
                      prev ? { ...prev, content: { ...prev.content, en: value } } : prev
                    )
                  }
                  onImageUpload={async (file) => {
                    const form = new FormData()
                    form.append("file", file)
                    const res = await api.post("/admin-api/blog/upload-image", form, {
                      headers: { "Content-Type": "multipart/form-data" },
                    })
                    return res.data.url
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


