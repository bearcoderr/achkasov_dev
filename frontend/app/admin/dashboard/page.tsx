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
  const [draftTitle, setDraftTitle] = useState("")
  const [draftContent, setDraftContent] = useState("")
  const [draftStatus, setDraftStatus] = useState<string | null>(null)
  const [draftLink, setDraftLink] = useState<string | null>(null)
  const [isDraftSaving, setIsDraftSaving] = useState(false)


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

  const totalNotifications = unreadCommentsCount + unreadCount

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    )
  }

  const createDraft = async () => {
    if (!draftTitle.trim()) {
      setDraftStatus("Введите заголовок")
      return
    }
    setDraftStatus(null)
    setDraftLink(null)
    setIsDraftSaving(true)
    const token = localStorage.getItem("adminToken")
    if (!token) return

    const slug = `draft-${Date.now()}`
    const content = draftContent.trim()
    const excerpt = content ? content.slice(0, 160) : ""

    const payload = {
      slug,
      category_id: null,
      status: "draft",
      is_active: true,
      published_at: null,
      cover_image_url: "",
      og_image_url: "",
      title: { ru: draftTitle, en: "" },
      excerpt: { ru: excerpt, en: "" },
      content: { ru: content, en: "" },
      seo_title: null,
      seo_description: null,
      tag_ids: [],
    }

    try {
      const res = await fetch("/admin-api/blog/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        throw new Error("Failed")
      }
      const data = await res.json()
      setDraftStatus("Черновик создан")
      setDraftTitle("")
      setDraftContent("")
      if (data?.id) {
        setDraftLink(`/admin/blog/edit/${data.id}`)
      }
    } catch {
      setDraftStatus("Ошибка создания черновика")
    } finally {
      setIsDraftSaving(false)
    }
  }

  return (
    <div className="text-white">
      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
            <div>
              <div className="text-lg font-medium">Черновик</div>
              <div className="text-xs text-gray-400">Быстрая заметка в блог</div>
            </div>
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
      </header>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-gray-800 bg-[#121212] p-10 shadow-sm">
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Без названия"
              className="w-full border-0 bg-transparent text-2xl font-semibold text-white placeholder:text-gray-600 focus:outline-none"
            />
            <div className="mt-3 h-px w-full bg-gray-800" />
            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              placeholder="Начните писать..."
              rows={10}
              className="mt-4 w-full resize-none border-0 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none"
            />
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={createDraft}
                disabled={isDraftSaving}
                className="rounded-md bg-[#6B9BD1] px-4 py-2 text-sm text-white hover:bg-[#5a8bc4] disabled:opacity-60"
              >
                {isDraftSaving ? "Сохранение..." : "Создать черновик"}
              </button>
              {draftStatus && <div className="text-sm text-gray-400">{draftStatus}</div>}
              {draftLink && (
                <Link href={draftLink} className="text-sm text-[#6B9BD1] hover:text-[#5a8bc4]">
                  Открыть черновик
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
