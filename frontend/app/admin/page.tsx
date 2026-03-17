"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") === "true") {
      router.push("/admin/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/admin-api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Неверный логин или пароль")
      }

      const data = await response.json()
      // допустим, бек возвращает { token: "..." }
      localStorage.setItem("adminLoggedIn", "true")
      localStorage.setItem("adminToken", data.token)
      router.push("/admin/dashboard")
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при входе")
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white">Вход в админ-панель</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">{error}</div>
            )}
            <div className="space-y-4">
              <input
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent sm:text-sm"
                  placeholder="Логин"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <input
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent sm:text-sm"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#6B9BD1] hover:bg-[#5a8bc4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B9BD1] transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
  )
}
