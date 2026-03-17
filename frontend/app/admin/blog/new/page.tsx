"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import axios from "axios"

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false })

interface Category {
  id: number
  name: { ru: string; en: string }
  slug: string
}

type PostStatus = "draft" | "published"

function slugify(value: string) {
  const map: Record<string, string> = {
    a: "a", b: "b", v: "v", g: "g", d: "d", e: "e", yo: "yo", zh: "zh", z: "z", i: "i", j: "y", k: "k", l: "l", m: "m", n: "n", o: "o", p: "p", r: "r", s: "s", t: "t", u: "u", f: "f", h: "h", c: "ts", ch: "ch", sh: "sh", sch: "sch", y: "y", ye: "e", yu: "yu", ya: "ya",
  }

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

export default function NewArticle() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    titleRu: "",
    titleEn: "",
    excerptRu: "",
    excerptEn: "",
    slug: "",
    categoryId: "",
    contentRu: "",
    contentEn: "",
    status: "draft" as PostStatus,
  })
  const [activeLanguage, setActiveLanguage] = useState<"ru" | "en">("ru")
  const [categories, setCategories] = useState<Category[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

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
    } else {
      api
        .get("/admin/blog/categories")
        .then((res) => setCategories(res.data || []))
        .catch((err) => {
          console.error("Failed to load categories", err)
        })
    }
  }, [router])

  const updateSlugIfNeeded = (nextTitleRu: string, nextTitleEn: string) => {
    if (slugTouched) return
    const source = nextTitleRu || nextTitleEn
    setFormData((prev) => ({ ...prev, slug: slugify(source) }))
  }

  const handleSave = async () => {
    if (!formData.titleRu || !formData.titleEn || !formData.slug) {
      alert("Заполните все обязательные поля")
      return
    }

    setIsSaving(true)
    try {
      await api.post("/admin-api/blog/posts", {
        slug: formData.slug,
        category_id: formData.categoryId ? Number(formData.categoryId) : null,
        status: formData.status,
        is_active: true,
        published_at: formData.status === "published" ? new Date().toISOString() : null,
        cover_image_url: "",
        title: { ru: formData.titleRu, en: formData.titleEn },
        excerpt: { ru: formData.excerptRu, en: formData.excerptEn },
        content: { ru: formData.contentRu, en: formData.contentEn },
        tag_ids: [],
      })
      router.push("/admin/blog")
    } catch (err) {
      console.error("Failed to create post", err)
      alert("Не удалось сохранить статью")
    } finally {
      setIsSaving(false)
    }
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
              <h1 className="text-lg font-medium text-white">Новая статья</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors disabled:opacity-60"
            >
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6 space-y-6">
          <div className="flex space-x-4 border-b border-gray-800 pb-4">
            <button
              onClick={() => setActiveLanguage("ru")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeLanguage === "ru" ? "bg-[#6B9BD1] text-white" : "bg-[#0f0f0f] text-gray-400"
              }`}
            >
              Русский
            </button>
            <button
              onClick={() => setActiveLanguage("en")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeLanguage === "en" ? "bg-[#6B9BD1] text-white" : "bg-[#0f0f0f] text-gray-400"
              }`}
            >
              English
            </button>
          </div>

          {activeLanguage === "ru" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок (RU)</label>
                <input
                  type="text"
                  value={formData.titleRu}
                  onChange={(e) => {
                    const nextTitleRu = e.target.value
                    setFormData({ ...formData, titleRu: nextTitleRu })
                    updateSlugIfNeeded(nextTitleRu, formData.titleEn)
                  }}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Краткое описание (RU)</label>
                <textarea
                  value={formData.excerptRu}
                  onChange={(e) => setFormData({ ...formData, excerptRu: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Содержимое (RU)</label>
                <RichTextEditor
                  value={formData.contentRu}
                  onChange={(value: string) => setFormData({ ...formData, contentRu: value })}
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
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок (EN)</label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => {
                    const nextTitleEn = e.target.value
                    setFormData({ ...formData, titleEn: nextTitleEn })
                    updateSlugIfNeeded(formData.titleRu, nextTitleEn)
                  }}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Краткое описание (EN)</label>
                <textarea
                  value={formData.excerptEn}
                  onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Содержимое (EN)</label>
                <RichTextEditor
                  value={formData.contentEn}
                  onChange={(value: string) => setFormData({ ...formData, contentEn: value })}
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
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setFormData({ ...formData, slug: e.target.value })
                }}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.ru}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <label className="block text-sm text-gray-300 mr-3">Статус</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatus })}
              className="px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}


