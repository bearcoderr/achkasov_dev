"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

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
  seo_title: { ru: string; en: string }
  seo_description: { ru: string; en: string }
  og_image_url: string
  slug: string
  category_id: number | null
  status: PostStatus
}

function slugify(value: string) {
  const ruMap: Record<string, string> = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "zh", "з": "z", "и": "i", "й": "y",
    "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "", "ы": "y", "ь": "", "э": "e",
    "ю": "yu", "я": "ya",
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

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
      return
    }

    const token = localStorage.getItem("adminToken")
    if (!token) return

    const postIdRaw = Array.isArray(params.id) ? params.id[0] : params.id
    const postId = Number(postIdRaw)
    if (!postId || Number.isNaN(postId)) {
      router.push("/admin/blog")
      return
    }

    Promise.all([
      fetch("/admin-api/blog/categories", { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
      fetch(`/admin-api/blog/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
    ])
      .then(([categoriesRes, postRes]) => {
        setCategories(categoriesRes || [])
        const data = postRes
        setArticle({
          id: data.id,
          title: data.title,
          excerpt: data.excerpt || { ru: "", en: "" },
          content: data.content || { ru: "", en: "" },
          seo_title: data.seo_title || { ru: "", en: "" },
          seo_description: data.seo_description || { ru: "", en: "" },
          og_image_url: data.og_image_url || "",
          slug: data.slug,
          category_id: data.category_id ?? null,
          status: data.status,
        })
      })
      .catch(() => setError("Failed to load post"))
      .finally(() => setIsLoading(false))
  }, [router, params.id])

  const updateSlugIfNeeded = (nextTitleRu: string, nextTitleEn: string) => {
    if (slugTouched) return
    const source = nextTitleRu || nextTitleEn
    setArticle((prev) => (prev ? { ...prev, slug: slugify(source) } : prev))
  }

  const handleSave = async () => {
    if (!article) return
    const token = localStorage.getItem("adminToken")
    if (!token) return

    try {
      await fetch(`/admin-api/blog/posts/${article.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: article.slug,
          category_id: article.category_id,
          status: article.status,
          is_active: true,
          published_at: article.status === "published" ? new Date().toISOString() : null,
          cover_image_url: "",
          og_image_url: article.og_image_url,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          seo_title: article.seo_title,
          seo_description: article.seo_description,
          tag_ids: [],
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert("Failed to save changes")
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">Loading...</div>
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
        {error || "Post not found"}
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
                ← Back
              </Link>
              <h1 className="text-lg font-medium text-white">Edit Article</h1>
            </div>
            <div className="flex items-center space-x-4">
              {saved && <span className="text-green-600 text-sm">Saved</span>}
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors text-sm"
              >
                Save
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Title (RU)</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Title (EN)</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt (RU)</label>
                <textarea
                  value={article.excerpt.ru}
                  onChange={(e) =>
                    setArticle((prev) => prev ? { ...prev, excerpt: { ...prev.excerpt, ru: e.target.value } } : prev)
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt (EN)</label>
                <textarea
                  value={article.excerpt.en}
                  onChange={(e) =>
                    setArticle((prev) => prev ? { ...prev, excerpt: { ...prev.excerpt, en: e.target.value } } : prev)
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SEO Title (RU)</label>
                <input
                  type="text"
                  value={article.seo_title.ru}
                  onChange={(e) =>
                    setArticle((prev) => prev ? { ...prev, seo_title: { ...prev.seo_title, ru: e.target.value } } : prev)
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SEO Title (EN)</label>
                <input
                  type="text"
                  value={article.seo_title.en}
                  onChange={(e) =>
                    setArticle((prev) => prev ? { ...prev, seo_title: { ...prev.seo_title, en: e.target.value } } : prev)
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SEO Description (RU)</label>
                <textarea
                  value={article.seo_description.ru}
                  onChange={(e) =>
                    setArticle((prev) => prev ? { ...prev, seo_description: { ...prev.seo_description, ru: e.target.value } } : prev)
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SEO Description (EN)</label>
                <textarea
                  value={article.seo_description.en}
                  onChange={(e) =>
                    setArticle((prev) => prev ? { ...prev, seo_description: { ...prev.seo_description, en: e.target.value } } : prev)
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content (RU)</label>
              <RichTextEditor
                value={article.content.ru}
                onChange={(value) => setArticle((prev) => prev ? { ...prev, content: { ...prev.content, ru: value } } : prev)}
                onImageUpload={async (file) => {
                  const token = localStorage.getItem("adminToken")
                  const form = new FormData()
                  form.append("file", file)
                  const res = await fetch("/admin-api/blog/upload-image", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: form,
                  })
                  const data = await res.json()
                  return data.url
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content (EN)</label>
              <RichTextEditor
                value={article.content.en}
                onChange={(value) => setArticle((prev) => prev ? { ...prev, content: { ...prev.content, en: value } } : prev)}
                onImageUpload={async (file) => {
                  const token = localStorage.getItem("adminToken")
                  const form = new FormData()
                  form.append("file", file)
                  const res = await fetch("/admin-api/blog/upload-image", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: form,
                  })
                  const data = await res.json()
                  return data.url
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={article.category_id ?? ""}
                  onChange={(e) => setArticle((prev) => (prev ? { ...prev, category_id: Number(e.target.value) } : prev))}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name.ru}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Social Image URL</label>
                <input
                  type="text"
                  value={article.og_image_url}
                  onChange={(e) => setArticle((prev) => (prev ? { ...prev, og_image_url: e.target.value } : prev))}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={article.status}
                  onChange={(e) => setArticle((prev) => (prev ? { ...prev, status: e.target.value as PostStatus } : prev))}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
