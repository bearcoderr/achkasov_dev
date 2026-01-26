"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface MenuItem {
  id: string
  label: { ru: string; en: string }
  url: string
  order: number
}

export default function AdminMenu() {
  const router = useRouter()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "1", label: { ru: "Главная", en: "Home" }, url: "/", order: 1 },
    { id: "2", label: { ru: "Блог", en: "Blog" }, url: "/blog", order: 2 },
    { id: "3", label: { ru: "Контакты", en: "Contact" }, url: "#contact", order: 3 },
  ])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
    } else {
      const savedMenu = localStorage.getItem("menuItems")
      if (savedMenu) setMenuItems(JSON.parse(savedMenu))
    }
  }, [router])

  const handleSave = () => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      label: { ru: "", en: "" },
      url: "",
      order: menuItems.length + 1,
    }
    setMenuItems([...menuItems, newItem])
  }

  const removeMenuItem = (id: string) => {
    if (confirm("Удалить этот пункт меню?")) {
      setMenuItems(menuItems.filter((item) => item.id !== id))
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
              <h1 className="text-lg font-medium text-white">Управление меню</h1>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">Пункты меню</h2>
            <button
              onClick={addMenuItem}
              className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors text-sm"
            >
              + Добавить пункт
            </button>
          </div>

          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <div key={item.id} className="border border-gray-800 rounded-lg p-4 bg-[#0f0f0f]">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Название (RU)</label>
                    <input
                      type="text"
                      value={item.label.ru}
                      onChange={(e) => {
                        const newItems = [...menuItems]
                        newItems[index].label.ru = e.target.value
                        setMenuItems(newItems)
                      }}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Название (EN)</label>
                    <input
                      type="text"
                      value={item.label.en}
                      onChange={(e) => {
                        const newItems = [...menuItems]
                        newItems[index].label.en = e.target.value
                        setMenuItems(newItems)
                      }}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => {
                        const newItems = [...menuItems]
                        newItems[index].url = e.target.value
                        setMenuItems(newItems)
                      }}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button onClick={() => removeMenuItem(item.id)} className="text-sm text-red-400 hover:text-red-300">
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
