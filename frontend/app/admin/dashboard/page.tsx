"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadSubmissions, setUnreadSubmissions] = useState<any[]>([])
  const [unreadCommentsCount, setUnreadCommentsCount] = useState(0)
  const [unreadComments, setUnreadComments] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)


  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
    } else {
      const savedSubmissions = localStorage.getItem("formSubmissions")
      if (savedSubmissions) {
        const submissions = JSON.parse(savedSubmissions)
        const unread = submissions.filter((sub: any) => !sub.read).length
        setUnreadCount(unread)
        setUnreadSubmissions(submissions.filter((sub: any) => !sub.read))
      }
      const token = localStorage.getItem("adminToken")
      if (token) {
        fetch("/admin-api/blog/comments", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : Promise.reject(res)))
          .then((list) => {
            const unreadList = (list || []).filter((c: any) => !c.is_read)
            setUnreadComments(unreadList)
            setUnreadCommentsCount(unreadList.length)
          })
          .catch(() => {
            setUnreadComments([])
            setUnreadCommentsCount(0)
          })
      }
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin")
  }

  const totalNotifications = unreadCommentsCount + unreadCount

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
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="relative text-gray-400 hover:text-white"
                  aria-label="Notifications"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z"
                    />
                  </svg>
                  {totalNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#6B9BD1] text-[10px] font-bold text-white">
                      {totalNotifications}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-800 bg-[#1a1a1a] p-3 shadow-xl">
                    <div className="mb-2 text-xs text-gray-400">Уведомления</div>
                    {totalNotifications === 0 ? (
                      <div className="text-sm text-gray-500">Нет новых уведомлений</div>
                    ) : (
                      <div className="space-y-3">
                        {unreadComments.slice(0, 3).map((c: any) => (
                          <div key={`c-${c.id}`} className="text-sm text-gray-300">
                            <div className="text-[10px] uppercase tracking-wide text-[#6B9BD1]">Комментарий</div>
                            <div className="font-medium text-white">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.post_title || `#${c.post_id}`}</div>
                          </div>
                        ))}
                        {unreadSubmissions.slice(0, 3).map((s: any) => (
                          <div key={`s-${s.id}`} className="text-sm text-gray-300">
                            <div className="text-[10px] uppercase tracking-wide text-[#6B9BD1]">Заявка</div>
                            <div className="font-medium text-white">{s.name}</div>
                            <div className="text-xs text-gray-500">{s.pageSource || "Форма"}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex flex-col gap-2 text-xs">
                      <Link href="/admin/comments" className="text-[#6B9BD1] hover:text-[#5a8bc4]">
                        Перейти к комментариям
                      </Link>
                      <Link href="/admin/submissions" className="text-[#6B9BD1] hover:text-[#5a8bc4]">
                        Перейти к заявкам
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">
                Выйти
              </button>
            </div>
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

          <Link
            href="/admin/comments"
            className="block p-6 bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-800 hover:border-[#6B9BD1] transition-all"
          >
            <h3 className="text-base font-medium text-white mb-2">Комментарии</h3>
            <p className="text-sm text-gray-400">Модерация комментариев к статьям</p>
          </Link>

          <Link
            href="/admin/account"
            className="block p-6 bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-800 hover:border-[#6B9BD1] transition-all"
          >
            <h3 className="text-base font-medium text-white mb-2">Аккаунт</h3>
            <p className="text-sm text-gray-400">Смена логина и пароля</p>
          </Link>

          <Link
            href="/admin/site-settings"
            className="block p-6 bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-800 hover:border-[#6B9BD1] transition-all"
          >
            <h3 className="text-base font-medium text-white mb-2">Настройки сайта</h3>
            <p className="text-sm text-gray-400">Видимость, индексация, sitemap</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
