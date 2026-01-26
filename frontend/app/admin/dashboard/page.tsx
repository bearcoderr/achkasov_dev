"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
    } else {
      const savedSubmissions = localStorage.getItem("formSubmissions")
      if (savedSubmissions) {
        const submissions = JSON.parse(savedSubmissions)
        const unread = submissions.filter((sub: any) => !sub.read).length
        setUnreadCount(unread)
      }
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <nav className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-lg font-medium text-white">Админ-панель</h1>
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">
              Выйти
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/homepage"
            className="block p-6 bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-800 hover:border-[#6B9BD1] transition-all"
          >
            <h3 className="text-base font-medium text-white mb-2">Главная страница</h3>
            <p className="text-sm text-gray-400">Редактирование контента главной страницы (RU/EN)</p>
          </Link>

          <Link
            href="/admin/blog"
            className="block p-6 bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-800 hover:border-[#6B9BD1] transition-all"
          >
            <h3 className="text-base font-medium text-white mb-2">Блог</h3>
            <p className="text-sm text-gray-400">Управление статьями и категориями блога</p>
          </Link>

          <Link
            href="/admin/pages"
            className="block p-6 bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-800 hover:border-[#6B9BD1] transition-all"
          >
            <h3 className="text-base font-medium text-white mb-2">Текстовые страницы</h3>
            <p className="text-sm text-gray-400">Добавление и редактирование страниц</p>
          </Link>

          <Link
            href="/admin/menu"
            className="block p-6 bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-800 hover:border-[#6B9BD1] transition-all"
          >
            <h3 className="text-base font-medium text-white mb-2">Меню</h3>
            <p className="text-sm text-gray-400">Управление меню сайта (RU/EN)</p>
          </Link>

          <Link
            href="/admin/submissions"
            className="block p-6 bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-800 hover:border-[#6B9BD1] transition-all relative"
          >
            <h3 className="text-base font-medium text-white mb-2">Заявки</h3>
            <p className="text-sm text-gray-400">Просмотр заявок с форм обратной связи</p>
            {unreadCount > 0 && (
              <span className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#6B9BD1] text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
