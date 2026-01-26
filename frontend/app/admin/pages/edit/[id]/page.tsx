"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

const CKEditor = dynamic(() => import("@/components/ckeditor"), { ssr: false })

interface PageData {
  id: string
  title: { ru: string; en: string }
  slug: string
  content: { ru: string; en: string }
  published: boolean
}

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState<PageData>({
    id: "",
    title: { ru: "", en: "" },
    slug: "",
    content: { ru: "", en: "" },
    published: false,
  })
  const [activeLanguage, setActiveLanguage] = useState<"ru" | "en">("ru")

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
    } else {
      const savedPages = localStorage.getItem("customPages")
      if (savedPages) {
        const pages = JSON.parse(savedPages)
        const page = pages.find((p: PageData) => p.id === params.id)
        if (page) {
          setFormData(page)
        }
      }
    }
  }, [router, params.id])

  const handleSave = () => {
    const savedPages = localStorage.getItem("customPages")
    if (savedPages) {
      const pages = JSON.parse(savedPages)
      const updatedPages = pages.map((p: PageData) => (p.id === formData.id ? formData : p))
      localStorage.setItem("customPages", JSON.stringify(updatedPages))
      router.push("/admin/pages")
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <nav className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-6">
              <Link href="/admin/pages" className="text-[#6B9BD1] hover:text-[#5a8bc4] text-sm">
                ← Назад
              </Link>
              <h1 className="text-lg font-medium text-white">Редактировать страницу</h1>
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
                  value={formData.title.ru}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ru: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Содержимое (RU)</label>
                <CKEditor
                  value={formData.content.ru}
                  onChange={(value: string) =>
                    setFormData({ ...formData, content: { ...formData.content, ru: value } })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок (EN)</label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Содержимое (EN)</label>
                <CKEditor
                  value={formData.content.en}
                  onChange={(value: string) =>
                    setFormData({ ...formData, content: { ...formData.content, en: value } })
                  }
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-800">
            <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
            />
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
