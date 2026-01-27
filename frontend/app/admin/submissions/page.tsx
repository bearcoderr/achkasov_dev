"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Submission {
  id: string
  name: string
  email: string
  phone: string
  message: string
  file?: { name: string; url: string } | null
  date: string
  read: boolean
  pageSource: string
}

export default function AdminSubmissions() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
    } else {
      const fetchSubmissions = async () => {
        try {
          const response = await fetch("http://localhost:8000/admin/submissions")
          const data = await response.json()
          const normalized = data.map(sub => ({
            ...sub,
            read: sub.is_read,
            date: sub.created_at,
            pageSource: sub.page_source,
            file: sub.file_url ? { name: sub.file_name, url: sub.file_url } : null,
          }))
          setSubmissions(normalized)
        } catch (err) {
          console.error(err)
        }
      }
      fetchSubmissions()
    }
  }, [router])


  const markAsRead = async (id: string) => {
    try {
      // Отправляем PUT-запрос на сервер
      await fetch(`http://localhost:8000/admin/submissions/${id}/read`, {
        method: "PUT",
      })

      // Обновляем локальный state
      const updated = submissions.map((sub) =>
          sub.id === id ? { ...sub, read: true } : sub
      )
      setSubmissions(updated)
    } catch (err) {
      console.error("Ошибка при пометке как прочитано:", err)
    }
  }



  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null)

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <nav className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-6">
              <Link href="/admin/dashboard" className="text-[#6B9BD1] hover:text-[#5a8bc4] text-sm">
                ← Назад
              </Link>
              <h1 className="text-lg font-medium text-white">Заявки с форм</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-[#0f0f0f]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Имя</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Телефон</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Страница</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Нет заявок
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission.id} className={!submission.read ? "bg-[#1a2332]" : ""}>
                    <td className="px-6 py-4 text-sm text-white">{submission.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{submission.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{submission.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{submission.pageSource}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(submission.created_at).toLocaleString("ru-RU")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          submission.read ? "bg-gray-800 text-gray-400" : "bg-blue-900/30 text-blue-400"
                        }`}
                      >
                        {submission.read ? "Прочитано" : "Новое"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-3">
                      <button
                          onClick={async () => {
                            setViewingSubmission(submission)
                            await markAsRead(submission.id)
                          }}
                          className="text-[#6B9BD1] hover:text-[#5a8bc4]"
                      >
                        Просмотр
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingSubmission && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 w-full max-w-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Заявка от {viewingSubmission.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Имя</label>
                <p className="text-white">{viewingSubmission.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <p className="text-white">{viewingSubmission.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Телефон</label>
                <p className="text-white">{viewingSubmission.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Страница отправки</label>
                <p className="text-white">{viewingSubmission.pageSource}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Дата</label>
                <p className="text-white">{new Date(viewingSubmission.date).toLocaleString("ru-RU")}</p>
              </div>
              {viewingSubmission.file && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Прикрепленный файл</label>
                  <a
                    href={viewingSubmission.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6B9BD1] hover:text-[#5a8bc4] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    {viewingSubmission.file.name}
                  </a>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Сообщение</label>
                <p className="text-white whitespace-pre-wrap">{viewingSubmission.message}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingSubmission(null)}
                className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
