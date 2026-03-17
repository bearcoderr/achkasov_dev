"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

interface Category {
  id: number
  name: { ru: string; en: string }
  slug: string
  order?: number
  is_active?: boolean
}

interface Article {
  id: number
  title: { ru: string; en: string }
  slug: string
  category_id: number | null
  status: "draft" | "published" | "archived"
  is_active?: boolean
}

export default function AdminBlog() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"articles" | "categories">("articles")
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ nameRu: "", nameEn: "", slug: "" })
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
    } else {
      Promise.all([api.get("/admin-api/blog/categories"), api.get("/admin-api/blog/posts")])
        .then(([categoriesRes, postsRes]) => {
          setCategories(categoriesRes.data || [])
          setArticles(postsRes.data || [])
        })
        .catch((err) => {
          console.error("Failed to load blog data", err)
          setError("Ошибка загрузки данных")
        })
        .finally(() => setIsLoading(false))
    }
  }, [router])

  const handleSaveCategory = async () => {
    if (!newCategory.nameRu || !newCategory.nameEn || !newCategory.slug) {
      alert("Заполните все поля")
      return
    }

    try {
      const response = await api.post("/admin-api/blog/categories", {
        name: { ru: newCategory.nameRu, en: newCategory.nameEn },
        slug: newCategory.slug,
      })
      setCategories((prev) => [...prev, response.data])
      setShowCategoryModal(false)
      setNewCategory({ nameRu: "", nameEn: "", slug: "" })
    } catch (err) {
      console.error("Failed to create category", err)
      alert("Не удалось создать категорию")
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (confirm("Удалить эту категорию?")) {
      try {
        await api.delete(`/admin-api/blog/categories/${id}`)
        setCategories((prev) => prev.filter((c) => c.id !== id))
      } catch (err) {
        console.error("Failed to delete category", err)
        alert("Не удалось удалить категорию")
      }
    }
  }

  const handleDeleteArticle = async (id: number) => {
    if (confirm("Удалить эту статью?")) {
      try {
        await api.delete(`/admin-api/blog/posts/${id}`)
        setArticles((prev) => prev.filter((a) => a.id !== id))
      } catch (err) {
        console.error("Failed to delete article", err)
        alert("Не удалось удалить статью")
      }
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <nav className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-6">
              <Link href="/admin/dashboard" className="text-[#6B9BD1] hover:text-[#5a8bc4] text-sm">
                ← Назад
              </Link>
              <h1 className="text-lg font-medium text-white">Управление блогом</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800">
          <div className="border-b border-gray-800">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("articles")}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === "articles"
                    ? "border-[#6B9BD1] text-[#6B9BD1]"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Статьи
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === "categories"
                    ? "border-[#6B9BD1] text-[#6B9BD1]"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                Категории
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "articles" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">Статьи</h2>
                  <Link
                    href="/admin/blog/new"
                    className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors"
                  >
                    Добавить статью
                  </Link>
                </div>
                {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
                <div className="border border-gray-800 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-[#0f0f0f]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Название</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Категория</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Статус</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {articles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            Нет статей. Добавьте первую статью.
                          </td>
                        </tr>
                      ) : (
                        articles.map((article) => {
                          const category = categories.find((c) => c.id === article.category_id)
                          const isPublished = article.status === "published"
                          return (
                            <tr key={article.id}>
                              <td className="px-6 py-4 text-sm text-white">{article.title.ru}</td>
                              <td className="px-6 py-4 text-sm text-gray-400">{category?.name.ru || "-"}</td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    isPublished ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"
                                  }`}
                                >
                                  {isPublished ? "Опубликовано" : "Черновик"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <Link
                                  href={`/admin/blog/edit/${article.id}`}
                                  className="text-[#6B9BD1] hover:text-[#5a8bc4] mr-4"
                                >
                                  Редактировать
                                </Link>
                                <button
                                  onClick={() => handleDeleteArticle(article.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  Удалить
                                </button>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "categories" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">Категории</h2>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors"
                  >
                    Добавить категорию
                  </button>
                </div>
                {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
                <div className="border border-gray-800 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-[#0f0f0f]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                          Название (RU)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                          Название (EN)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Slug</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td className="px-6 py-4 text-sm text-white">{category.name.ru}</td>
                          <td className="px-6 py-4 text-sm text-white">{category.name.en}</td>
                          <td className="px-6 py-4 text-sm text-gray-400">{category.slug}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 w-full max-w-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Добавить категорию</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Название (RU)</label>
                  <input
                    type="text"
                    value={newCategory.nameRu}
                    onChange={(e) => setNewCategory({ ...newCategory, nameRu: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Название (EN)</label>
                  <input
                    type="text"
                    value={newCategory.nameEn}
                    onChange={(e) => setNewCategory({ ...newCategory, nameEn: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  placeholder="web-development"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCategoryModal(false)
                  setNewCategory({ nameRu: "", nameEn: "", slug: "" })
                }}
                className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-5 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

