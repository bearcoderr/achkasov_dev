"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

const CKEditor = dynamic(() => import("@/components/ckeditor"), { ssr: false })

export default function NewArticle() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    titleRu: "",
    titleEn: "",
    slug: "",
    category: "",
    contentRu: "",
    contentEn: "",
    published: false,
  })
  const [activeLanguage, setActiveLanguage] = useState<"ru" | "en">("ru")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
    } else {
      const savedCategories = localStorage.getItem("blogCategories")
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories))
      }
    }
  }, [router])

  const handleSave = () => {
    if (!formData.titleRu || !formData.titleEn || !formData.slug || !formData.category) {
      alert("Заполните все обязательные поля")
      return
    }

    const articles = JSON.parse(localStorage.getItem("blogArticles") || "[]")
    const newArticle = {
      id: Date.now().toString(),
      title: { ru: formData.titleRu, en: formData.titleEn },
      slug: formData.slug,
      category: formData.category,
      content: { ru: formData.contentRu, en: formData.contentEn },
      published: formData.published,
      createdAt: new Date().toISOString(),
    }
    articles.push(newArticle)
    localStorage.setItem("blogArticles", JSON.stringify(articles))
    router.push("/admin/blog")
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
              className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors"
            >
              Сохранить
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
                  onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Содержимое (RU)</label>
                <CKEditor
                  value={formData.contentRu}
                  onChange={(value: string) => setFormData({ ...formData, contentRu: value })}
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
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Содержимое (EN)</label>
                <CKEditor
                  value={formData.contentEn}
                  onChange={(value: string) => setFormData({ ...formData, contentEn: value })}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 text-[#6B9BD1] focus:ring-[#6B9BD1] border-gray-700 rounded bg-[#0f0f0f]"
            />
            <label className="ml-2 block text-sm text-gray-300">Опубликовать</label>
          </div>
        </div>
      </div>
    </div>
  )
}
