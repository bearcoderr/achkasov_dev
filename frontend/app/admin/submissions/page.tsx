"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Submission {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  pageSource?: string
  date: string
  read?: boolean
}

export default function AdminSubmissions() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
    } else {
      const savedSubmissions = localStorage.getItem("formSubmissions")
      if (savedSubmissions) {
        const parsed = JSON.parse(savedSubmissions)
        setSubmissions(parsed)
      }
      setIsLoading(false)
    }
  }, [router])

  const markAsRead = (id: string) => {
    const updated = submissions.map((sub) => (sub.id === id ? { ...sub, read: true } : sub))
    setSubmissions(updated)
    localStorage.setItem("formSubmissions", JSON.stringify(updated))
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
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                    Нет заявок
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission.id} className={submission.read ? "" : "bg-[#121212]"}>
                    <td className="px-6 py-4 text-sm text-white">{submission.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{submission.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{submission.phone || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{submission.pageSource || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(submission.date).toLocaleString("ru-RU")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          submission.read ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
                        }`}
                      >
                        {submission.read ? "Прочитано" : "Новое"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {!submission.read && (
                        <button onClick={() => markAsRead(submission.id)} className="text-[#6B9BD1] hover:text-[#5a8bc4]">
                          Отметить прочитанным
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
