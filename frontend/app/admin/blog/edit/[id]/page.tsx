"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

const CKEditor = dynamic(() => import("../../../../../components/ckeditor"), { ssr: false })

interface Article {
  id: string
  title: { ru: string; en: string }
  slug: string
  category: string
  content: { ru: string; en: string }
  published: boolean
  createdAt: string
}

interface Category {
  id: string
  name: { ru: string; en: string }
  slug: string
}

export default function EditArticle() {
  const router = useRouter()
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
    } else {
      const savedArticles = localStorage.getItem("blogArticles")
      const savedCategories = localStorage.getItem("blogCategories")

      if (savedCategories) {
        setCategories(JSON.parse(savedCategories))
      }

      if (savedArticles) {
        const articles = JSON.parse(savedArticles)
        const found = articles.find((a: Article) => a.id === params.id)
        if (found) {
          setArticle(found)
        }
      }
      setIsLoading(false)
    }
  }, [router, params.id])

  const handleSave = () => {
    if (!article) return

    const savedArticles = localStorage.getItem("blogArticles")
    if (savedArticles) {
      const articles = JSON.parse(savedArticles)
      const index = articles.findIndex((a: Article) => a.id === article.id)
      if (index >= 0) {
        articles[index] = article
        localStorage.setItem("blogArticles", JSON.stringify(articles))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    }
  }

  if (isLoading || !article) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">Загрузка...</div>
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
            {/* Article Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок (RU)</label>
                <input
                  type="text"
                  value={article.title.ru}
                  onChange={(e) => setArticle({ ...article, title: { ...article.title, ru: e.target.value } })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок (EN)</label>
                <input
                  type="text"
                  value={article.title.en}
                  onChange={(e) => setArticle({ ...article, title: { ...article.title, en: e.target.value } })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
                <select
                  value={article.category}
                  onChange={(e) => setArticle({ ...article, category: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name.ru}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Статус</label>
                <select
                  value={article.published ? "published" : "draft"}
                  onChange={(e) => setArticle({ ...article, published: e.target.value === "published" })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликовано</option>
                </select>
              </div>
            </div>

            {/* Content Editors */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Контент (RU)</label>
                <CKEditor
                  value={article.content.ru}
                  onChange={(value) => setArticle({ ...article, content: { ...article.content, ru: value } })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Контент (EN)</label>
                <CKEditor
                  value={article.content.en}
                  onChange={(value) => setArticle({ ...article, content: { ...article.content, en: value } })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
