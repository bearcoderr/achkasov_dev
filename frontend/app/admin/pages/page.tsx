"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Page {
  id: string
  title: { ru: string; en: string }
  slug: string
  content: { ru: string; en: string }
  published: boolean
}

export default function AdminPages() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newPage, setNewPage] = useState({ titleRu: "", titleEn: "", slug: "" })

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
    } else {
      const savedPages = localStorage.getItem("customPages")
      if (savedPages) setPages(JSON.parse(savedPages))
    }
  }, [router])

  const handleSave = () => {
    if (!newPage.titleRu || !newPage.titleEn || !newPage.slug) {
      alert("Заполните все поля")
      return
    }

    const page: Page = {
      id: Date.now().toString(),
      title: { ru: newPage.titleRu, en: newPage.titleEn },
      slug: newPage.slug,
      content: { ru: "", en: "" },
      published: false,
    }

    const updated = [...pages, page]
    setPages(updated)
    localStorage.setItem("customPages", JSON.stringify(updated))
    setShowModal(false)
    setNewPage({ titleRu: "", titleEn: "", slug: "" })
  }

  const handleDelete = (id: string) => {
    if (confirm("Удалить эту страницу?")) {
      const updated = pages.filter((p) => p.id !== id)
      setPages(updated)
      localStorage.setItem("customPages", JSON.stringify(updated))
    }
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
              <h1 className="text-lg font-medium text-white">Текстовые страницы</h1>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors"
            >
              Добавить страницу
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-[#0f0f0f]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Нет страниц. Добавьте первую страницу.
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id}>
                    <td className="px-6 py-4 text-sm text-white">{page.title.ru}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{page.slug}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          page.published ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {page.published ? "Опубликовано" : "Черновик"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/admin/pages/edit/${page.id}`} className="text-[#6B9BD1] hover:text-[#5a8bc4] mr-4">
                        Редактировать
                      </Link>
                      <button onClick={() => handleDelete(page.id)} className="text-red-400 hover:text-red-300">
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 w-full max-w-5xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Добавить страницу</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Название (RU)</label>
                  <input
                    type="text"
                    value={newPage.titleRu}
                    onChange={(e) => setNewPage({ ...newPage, titleRu: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Название (EN)</label>
                  <input
                    type="text"
                    value={newPage.titleEn}
                    onChange={(e) => setNewPage({ ...newPage, titleEn: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                <input
                  type="text"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  placeholder="privacy-policy"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  setNewPage({ titleRu: "", titleEn: "", slug: "" })
                }}
                className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
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
