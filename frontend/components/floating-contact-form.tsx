"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FloatingContactFormProps {
  lang: "ru" | "en"
}

export default function FloatingContactForm({ lang }: FloatingContactFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" })
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const t = {
    ru: {
      title: "Свяжитесь со мной",
      namePlaceholder: "Ваше имя *",
      emailPlaceholder: "Email *",
      phonePlaceholder: "Телефон",
      messagePlaceholder: "Ваше сообщение *",
      attachFile: "Прикрепить файл",
      submit: "Отправить",
      success: "Спасибо!",
      successDesc: "Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.",
      required: "Это поле обязательно",
      invalidEmail: "Неверный формат email",
      minLength: "Минимум 2 символа",
      messageMinLength: "Минимум 10 символов",
    },
    en: {
      title: "Get in Touch",
      namePlaceholder: "Your name *",
      emailPlaceholder: "Email *",
      phonePlaceholder: "Phone",
      messagePlaceholder: "Your message *",
      attachFile: "Attach file",
      submit: "Send Message",
      success: "Thank you!",
      successDesc: "Your message has been sent. I'll get back to you soon.",
      required: "This field is required",
      invalidEmail: "Invalid email format",
      minLength: "Minimum 2 characters",
      messageMinLength: "Minimum 10 characters",
    },
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t[lang].required
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t[lang].minLength
    }

    if (!formData.email.trim()) {
      newErrors.email = t[lang].required
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t[lang].invalidEmail
    }

    if (!formData.message.trim()) {
      newErrors.message = t[lang].required
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t[lang].messageMinLength
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)
    if (match) {
      return [
        match[1] ? `+${match[1]}` : "",
        match[2] ? ` (${match[2]}` : "",
        match[3] ? `) ${match[3]}` : "",
        match[4] ? `-${match[4]}` : "",
        match[5] ? `-${match[5]}` : "",
      ].join("")
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Save submission to localStorage
    const submission = {
      id: Date.now().toString(),
      ...formData,
      file: file ? { name: file.name, url: "#" } : undefined,
      date: new Date().toISOString(),
      read: false,
      pageSource: window.location.pathname === "/" ? "Главная страница" : document.title,
    }

    const savedSubmissions = localStorage.getItem("formSubmissions")
    const submissions = savedSubmissions ? JSON.parse(savedSubmissions) : []
    submissions.unshift(submission)
    localStorage.setItem("formSubmissions", JSON.stringify(submissions))

    setSubmitted(true)
    setFormData({ name: "", email: "", phone: "", message: "" })
    setFile(null)
    setErrors({})

    setTimeout(() => {
      setSubmitted(false)
      setIsOpen(false)
    }, 3000)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#6B9BD1] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#5a8bc4]"
        aria-label="Open contact form"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-lg border border-gray-800 bg-[#1a1a1a] p-8 shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#6B9BD1]/20">
                  <svg className="h-8 w-8 text-[#6B9BD1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white">{t[lang].success}</h3>
                <p className="text-gray-400">{t[lang].successDesc}</p>
              </div>
            ) : (
              <>
                <h2 className="mb-6 text-2xl font-bold text-white">{t[lang].title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder={t[lang].namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500 ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder={t[lang].emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>

                  <div>
                    <Input
                      type="tel"
                      placeholder={t[lang].phonePlaceholder}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Textarea
                      rows={4}
                      placeholder={t[lang].messagePlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500 ${
                        errors.message ? "border-red-500" : ""
                      }`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 bg-[#0f0f0f] px-4 py-3 text-sm text-gray-400 transition-colors hover:border-[#6B9BD1]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      <span>{file ? file.name : t[lang]?.attachFile ?? t.ru.attachFile}</span>
                      <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-[#6B9BD1] hover:bg-[#5a8bc4]">
                    {t[lang].submit}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
