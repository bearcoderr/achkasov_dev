"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

// ============= INTERFACES =============

interface LocalizedField {
  ru: string
  en: string
}

interface Service {
  id: number
  title: LocalizedField
  description: LocalizedField
  details: LocalizedField
  icon: string
}

interface Project {
  id: number
  title: LocalizedField
  description: LocalizedField
  image: string
  tags: string[]
  link: string
}

interface Experience {
  id: number
  year: string
  company: LocalizedField
  position: LocalizedField
  description: LocalizedField
}

interface SkillCategory {
  id: number
  name: LocalizedField
  skills: string[]
}

interface Certificate {
  id: number
  title: LocalizedField
  description: LocalizedField
  provider: string
  image_url: string
  issue_date: string
  credential_url?: string
  order?: number
  is_active?: boolean
}

interface PersonalFact {
  id: number
  emoji: string
  title: LocalizedField
  description: LocalizedField
  order?: number
  is_active?: boolean
}

interface SettingsData {
  email: string
  phone: string
  location: LocalizedField
  contact_title: LocalizedField
  contact_description: LocalizedField
  footer_rights: LocalizedField
}

interface SocialLinks {
  github?: string
  linkedin?: string
  telegram?: string
}

interface HomePageData {
  hero: {
    id?: number
    title: LocalizedField
    subtitle: LocalizedField
    description: LocalizedField
    cta: LocalizedField
    image: string
    cv_url: LocalizedField
  }
  about: {
    id?: number
    title: LocalizedField
    description: LocalizedField
  }
  services: Service[]
  projects: Project[]
  experience: Experience[]
  skills: SkillCategory[]
  certificates: Certificate[]
  personal: PersonalFact[]
}

// ============= API CONFIG =============

const API_BASE_URL = ""

// Axios instance с автоматическим добавлением токена
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Интерцептор для добавления токена к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ============= MAIN COMPONENT =============

export default function AdminHomePage() {
  const router = useRouter()

  const [data, setData] = useState<HomePageData>({
    hero: {
      title: { ru: "", en: "" },
      subtitle: { ru: "", en: "" },
      description: { ru: "", en: "" },
      cta: { ru: "", en: "" },
      image: "",
      cv_url: { ru: "", en: "" },
    },
    about: {
      title: { ru: "", en: "" },
      description: { ru: "", en: "" },
    },
    services: [],
    projects: [],
    experience: [],
    skills: [],
    certificates: [],
    personal: [],
  })

  const [activeTab, setActiveTab] = useState<"hero" | "about" | "services" | "projects" | "experience" | "skills" | "certificates" | "personal" | "contacts">("hero")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingCertificateImage, setIsUploadingCertificateImage] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settingsData, setSettingsData] = useState<SettingsData>({
    email: "",
    phone: "",
    location: { ru: "", en: "" },
    contact_title: { ru: "", en: "" },
    contact_description: { ru: "", en: "" },
    footer_rights: { ru: "", en: "" },
  })
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({})

  // Модальные состояния
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [editingSkillCategory, setEditingSkillCategory] = useState<SkillCategory | null>(null)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [editingPersonalFact, setEditingPersonalFact] = useState<PersonalFact | null>(null)
  const [showArchivedCertificates, setShowArchivedCertificates] = useState(false)
  const [showArchivedPersonal, setShowArchivedPersonal] = useState(false)

  // ============= LIFECYCLE =============

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
      return
    }
    loadAllData()
  }, [router])
  useEffect(() => {
    loadAllData()
  }, [showArchivedCertificates, showArchivedPersonal])

  // ============= DATA LOADING =============

  const loadAllData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [heroRes, aboutRes, servicesRes, projectsRes, experienceRes, skillsRes, certificatesRes, personalRes, settingsRes, socialRes] = await Promise.all([
        api.get("/admin-api/hero"),
        api.get("/admin-api/about"),
        api.get("/admin-api/services"),
        api.get("/admin-api/projects"),
        api.get("/admin-api/experience"),
        api.get("/admin-api/skills"),
        api.get(`/admin-api/certificates${showArchivedCertificates ? "?include_archived=true" : ""}`),
        api.get(`/admin-api/personal${showArchivedPersonal ? "?include_archived=true" : ""}`),
        api.get("/admin-api/settings"),
        api.get("/admin-api/social-links"),
      ])

      setData({
        hero: heroRes.data,
        about: aboutRes.data,
        services: servicesRes.data,
        projects: projectsRes.data,
        experience: experienceRes.data,
        skills: skillsRes.data,
        certificates: certificatesRes.data,
        personal: personalRes.data,
      })
      setSettingsData(settingsRes.data)
      setSocialLinks(socialRes.data || {})
    } catch (err: any) {
      console.error("Error loading data:", err)
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken")
        router.push("/admin")
      } else {
        setError("Ошибка загрузки данных. Попробуйте обновить страницу.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ============= SAVE FUNCTIONS =============

  const saveHero = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const response = await api.put("/admin-api/hero", data.hero)
      setData({ ...data, hero: response.data })
      showSaveSuccess()
    } catch (err) {
      console.error("Error saving hero:", err)
      setError("Ошибка сохранения Hero секции")
    } finally {
      setIsSaving(false)
    }
  }

  const saveAbout = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const response = await api.put("/admin-api/about", data.about)
      setData({ ...data, about: response.data })
      showSaveSuccess()
    } catch (err) {
      console.error("Error saving about:", err)
      setError("Ошибка сохранения About секции")
    } finally {
      setIsSaving(false)
    }
  }

  const showSaveSuccess = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSave = () => {
    if (activeTab === "hero") {
      saveHero()
    } else if (activeTab === "about") {
      saveAbout()
    } else if (activeTab === "contacts") {
      saveContacts()
    }
    // Остальные табы сохраняются через модальные окна
  }

  const saveContacts = async () => {
    setIsSaving(true)
    setError(null)

    try {
      await api.put("/admin-api/settings", settingsData)
      await api.put("/admin-api/social-links", socialLinks)
      showSaveSuccess()
    } catch (err) {
      console.error("Error saving contacts:", err)
      setError("Ошибка сохранения контактов и ссылок")
    } finally {
      setIsSaving(false)
    }
  }

  // ============= SERVICE FUNCTIONS =============

  const addService = () => {
    const newService: Service = {
      id: 0, // временный ID
      title: { ru: "", en: "" },
      description: { ru: "", en: "" },
      details: { ru: "", en: "" },
      icon: "🚀",
    }
    setEditingService(newService)
  }

  const saveService = async () => {
    if (!editingService) return

    setIsSaving(true)
    setError(null)

    try {
      if (editingService.id === 0) {
        // Создание новой услуги
        const response = await api.post("/admin-api/services", editingService)
        setData({ ...data, services: [...data.services, response.data] })
      } else {
        // Обновление существующей
        const response = await api.put(`/admin-api/services/${editingService.id}`, editingService)
        setData({
          ...data,
          services: data.services.map(s => s.id === editingService.id ? response.data : s)
        })
      }
      setEditingService(null)
      showSaveSuccess()
    } catch (err) {
      console.error("Error saving service:", err)
      setError("Ошибка сохранения услуги")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteService = async (id: number) => {
    if (!confirm("Удалить эту услугу?")) return

    setIsSaving(true)
    try {
      await api.delete(`/admin-api/services/${id}`)
      setData({ ...data, services: data.services.filter(s => s.id !== id) })
      showSaveSuccess()
    } catch (err) {
      console.error("Error deleting service:", err)
      setError("Ошибка удаления услуги")
    } finally {
      setIsSaving(false)
    }
  }

  // ============= PROJECT FUNCTIONS =============

  const addProject = () => {
    const newProject: Project = {
      id: 0,
      title: { ru: "", en: "" },
      description: { ru: "", en: "" },
      image: "",
      tags: [],
      link: "",
    }
    setEditingProject(newProject)
  }

  const saveProject = async () => {
    if (!editingProject) return

    setIsSaving(true)
    setError(null)

    try {
      if (editingProject.id === 0) {
        const response = await api.post("/admin-api/projects", editingProject)
        setData({ ...data, projects: [...data.projects, response.data] })
      } else {
        const response = await api.put(`/admin-api/projects/${editingProject.id}`, editingProject)
        setData({
          ...data,
          projects: data.projects.map(p => p.id === editingProject.id ? response.data : p)
        })
      }
      setEditingProject(null)
      showSaveSuccess()
    } catch (err) {
      console.error("Error saving project:", err)
      setError("Ошибка сохранения проекта")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteProject = async (id: number) => {
    if (!confirm("Удалить этот проект?")) return

    setIsSaving(true)
    try {
      await api.delete(`/admin-api/projects/${id}`)
      setData({ ...data, projects: data.projects.filter(p => p.id !== id) })
      showSaveSuccess()
    } catch (err) {
      console.error("Error deleting project:", err)
      setError("Ошибка удаления проекта")
    } finally {
      setIsSaving(false)
    }
  }

  // ============= EXPERIENCE FUNCTIONS =============

  const addExperience = () => {
    const newExp: Experience = {
      id: 0,
      year: "",
      company: { ru: "", en: "" },
      position: { ru: "", en: "" },
      description: { ru: "", en: "" },
    }
    setEditingExperience(newExp)
  }

  const saveExperience = async () => {
    if (!editingExperience) return

    setIsSaving(true)
    setError(null)

    try {
      if (editingExperience.id === 0) {
        const response = await api.post("/admin-api/experience", editingExperience)
        setData({ ...data, experience: [...data.experience, response.data] })
      } else {
        const response = await api.put(`/admin-api/experience/${editingExperience.id}`, editingExperience)
        setData({
          ...data,
          experience: data.experience.map(e => e.id === editingExperience.id ? response.data : e)
        })
      }
      setEditingExperience(null)
      showSaveSuccess()
    } catch (err) {
      console.error("Error saving experience:", err)
      setError("Ошибка сохранения опыта")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteExperience = async (id: number) => {
    if (!confirm("Удалить этот опыт?")) return

    setIsSaving(true)
    try {
      await api.delete(`/admin-api/experience/${id}`)
      setData({ ...data, experience: data.experience.filter(e => e.id !== id) })
      showSaveSuccess()
    } catch (err) {
      console.error("Error deleting experience:", err)
      setError("Ошибка удаления опыта")
    } finally {
      setIsSaving(false)
    }
  }

  // ============= SKILLS FUNCTIONS =============

  const addSkillCategory = () => {
    const newCategory: SkillCategory = {
      id: 0,
      name: { ru: "", en: "" },
      skills: [],
    }
    setEditingSkillCategory(newCategory)
  }

  const saveSkillCategory = async () => {
    if (!editingSkillCategory) return

    setIsSaving(true)
    setError(null)

    try {
      if (editingSkillCategory.id === 0) {
        const response = await api.post("/admin-api/skills", editingSkillCategory)
        setData({ ...data, skills: [...data.skills, response.data] })
      } else {
        const response = await api.put(`/admin-api/skills/${editingSkillCategory.id}`, editingSkillCategory)
        setData({
          ...data,
          skills: data.skills.map(s => s.id === editingSkillCategory.id ? response.data : s)
        })
      }
      setEditingSkillCategory(null)
      showSaveSuccess()
    } catch (err) {
      console.error("Error saving skill category:", err)
      setError("Ошибка сохранения категории навыков")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteSkillCategory = async (id: number) => {
    if (!confirm("Удалить эту категорию навыков?")) return

    setIsSaving(true)
    try {
      await api.delete(`/admin-api/skills/${id}`)
      setData({ ...data, skills: data.skills.filter(s => s.id !== id) })
      showSaveSuccess()
    } catch (err) {
      console.error("Error deleting skill category:", err)
      setError("Ошибка удаления категории")
    } finally {
      setIsSaving(false)
    }
  }

  // ============= CERTIFICATE FUNCTIONS =============

  const addCertificate = () => {
    const newCertificate: Certificate = {
      id: 0,
      title: { ru: "", en: "" },
      description: { ru: "", en: "" },
      provider: "",
      image_url: "",
      issue_date: "",
      credential_url: "",
      order: undefined,
    }
    setEditingCertificate(newCertificate)
  }

  const saveCertificate = async () => {
    if (!editingCertificate) return

    setIsSaving(true)
    setError(null)

    try {
      if (editingCertificate.id === 0) {
        const response = await api.post("/admin-api/certificates", editingCertificate)
        setData({ ...data, certificates: [...data.certificates, response.data] })
      } else {
        const response = await api.put(`/admin-api/certificates/${editingCertificate.id}`, editingCertificate)
        setData({
          ...data,
          certificates: data.certificates.map(c => c.id === editingCertificate.id ? response.data : c)
        })
      }
      setEditingCertificate(null)
      showSaveSuccess()
    } catch (err) {
      console.error("Error saving certificate:", err)
      setError("Ошибка сохранения сертификата")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteCertificate = async (id: number) => {
    if (!confirm("Удалить этот сертификат?")) return

    setIsSaving(true)
    try {
      await api.delete(`/admin-api/certificates/${id}`)
      setData({ ...data, certificates: data.certificates.filter(c => c.id !== id) })
      showSaveSuccess()
    } catch (err) {
      console.error("Error deleting certificate:", err)
      setError("Ошибка удаления сертификата")
    } finally {
      setIsSaving(false)
    }
  }

  const restoreCertificate = async (id: number) => {
    setIsSaving(true)
    try {
      await api.post(`/admin-api/certificates/${id}/restore`)
      loadAllData()
      showSaveSuccess()
    } catch (err) {
      console.error("Error restoring certificate:", err)
      setError("Ошибка восстановления сертификата")
    } finally {
      setIsSaving(false)
    }
  }

  // ============= PERSONAL FACTS FUNCTIONS =============

  const addPersonalFact = () => {
    const newFact: PersonalFact = {
      id: 0,
      emoji: "",
      title: { ru: "", en: "" },
      description: { ru: "", en: "" },
      order: undefined,
    }
    setEditingPersonalFact(newFact)
  }

  const savePersonalFact = async () => {
    if (!editingPersonalFact) return

    setIsSaving(true)
    setError(null)

    try {
      if (editingPersonalFact.id === 0) {
        const response = await api.post("/admin-api/personal", editingPersonalFact)
        setData({ ...data, personal: [...data.personal, response.data] })
      } else {
        const response = await api.put(`/admin-api/personal/${editingPersonalFact.id}`, editingPersonalFact)
        setData({
          ...data,
          personal: data.personal.map(p => p.id === editingPersonalFact.id ? response.data : p)
        })
      }
      setEditingPersonalFact(null)
      showSaveSuccess()
    } catch (err) {
      console.error("Error saving personal fact:", err)
      setError("Ошибка сохранения личного факта")
    } finally {
      setIsSaving(false)
    }
  }

  const deletePersonalFact = async (id: number) => {
    if (!confirm("Удалить этот факт?")) return

    setIsSaving(true)
    try {
      await api.delete(`/admin-api/personal/${id}`)
      setData({ ...data, personal: data.personal.filter(p => p.id !== id) })
      showSaveSuccess()
    } catch (err) {
      console.error("Error deleting personal fact:", err)
      setError("Ошибка удаления личного факта")
    } finally {
      setIsSaving(false)
    }
  }

  const restorePersonalFact = async (id: number) => {
    setIsSaving(true)
    try {
      await api.post(`/admin-api/personal/${id}/restore`)
      loadAllData()
      showSaveSuccess()
    } catch (err) {
      console.error("Error restoring personal fact:", err)
      setError("Ошибка восстановления личного факта")
    } finally {
      setIsSaving(false)
    }
  }

  // ============= IMAGE UPLOAD =============

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "project") => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === "hero") {
        setIsUploadingImage(true)
        setError(null)
        try {
          const formData = new FormData()
          formData.append("file", file)
          const response = await api.post("/admin-api/hero/upload-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          const url = response.data?.webp_url || response.data?.url
          if (!url) {
            throw new Error("No URL returned")
          }
          setData({ ...data, hero: { ...data.hero, image: url } })
        } catch (err) {
          console.error("Error uploading hero image:", err)
          setError("Ошибка загрузки изображения Hero")
        } finally {
          setIsUploadingImage(false)
        }
      } else if (type === "project") {
        if (!editingProject) return
        setIsUploadingImage(true)
        setError(null)
        try {
          const formData = new FormData()
          formData.append("file", file)
          const response = await api.post("/admin-api/projects/upload-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          const url = response.data?.url
          if (!url) {
            throw new Error("No URL returned")
          }
          setEditingProject({ ...editingProject, image: url })
        } catch (err) {
          console.error("Error uploading project image:", err)
          setError("Ошибка загрузки изображения проекта")
        } finally {
          setIsUploadingImage(false)
        }
      }
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>, lang: "ru" | "en") => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsSaving(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await api.post(`/admin-api/hero/upload-resume?lang=${lang}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const url = response.data?.url
      if (!url) {
        throw new Error("No URL returned")
      }
      setData({ ...data, hero: { ...data.hero, cv_url: { ...data.hero.cv_url, [lang]: url } } })
    } catch (err) {
      console.error("Error uploading resume:", err)
      setError("Ошибка загрузки резюме")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCertificateImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingCertificate) return
    setIsUploadingCertificateImage(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await api.post("/admin-api/certificates/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const url = response.data?.url
      if (!url) {
        throw new Error("No URL returned")
      }
      setEditingCertificate({ ...editingCertificate, image_url: url })
    } catch (err) {
      console.error("Error uploading certificate image:", err)
      setError("Ошибка загрузки изображения сертификата")
    } finally {
      setIsUploadingCertificateImage(false)
    }
  }

  // ============= RENDER =============

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B9BD1] mx-auto mb-4"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Navigation */}
      <nav className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-6">
              <Link href="/admin/dashboard" className="text-[#6B9BD1] hover:text-[#5a8bc4] text-sm">
                ← Назад
              </Link>
              <h1 className="text-lg font-medium text-white">Редактирование главной страницы</h1>
            </div>
            <div className="flex items-center space-x-4">
              {error && <span className="text-red-500 text-sm">{error}</span>}
              {saved && <span className="text-green-500 text-sm">✓ Сохранено</span>}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-800">
          {/* Tabs */}
          <div className="border-b border-gray-800">
            <nav className="flex -mb-px overflow-x-auto">
              {["hero", "about", "services", "projects", "experience", "skills", "certificates", "personal", "contacts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "border-[#6B9BD1] text-[#6B9BD1]"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab === "hero" && "Hero"}
                  {tab === "about" && "О себе"}
                  {tab === "services" && "Услуги"}
                  {tab === "projects" && "Проекты"}
                  {tab === "experience" && "Опыт"}
                  {tab === "skills" && "Навыки"}
                  {tab === "certificates" && "Сертификаты"}
                  {tab === "personal" && "Немного обо мне"}
                  {tab === "contacts" && "Контакты и ссылки"}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* HERO TAB */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-white">Hero секция</h2>

                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Фото</label>
                  <div className="flex items-center gap-4">
                    {data.hero.image && (
                      <img
                        src={data.hero.image}
                        alt="Hero"
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "hero")}
                      className="text-sm text-gray-400"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Резюме (RU / EN)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf"
                        onChange={(e) => handleResumeUpload(e, "ru")}
                        className="text-sm text-gray-400"
                      />
                      <input
                        type="text"
                        value={data.hero.cv_url.ru}
                        readOnly
                        className="w-full px-3 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                        placeholder="URL резюме (RU)"
                      />
                    </div>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf"
                        onChange={(e) => handleResumeUpload(e, "en")}
                        className="text-sm text-gray-400"
                      />
                      <input
                        type="text"
                        value={data.hero.cv_url.en}
                        readOnly
                        className="w-full px-3 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                        placeholder="URL резюме (EN)"
                      />
                    </div>
                  </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Заголовок (RU)</label>
                    <input
                      type="text"
                      value={data.hero.title.ru}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, title: { ...data.hero.title, ru: e.target.value } } })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Заголовок (EN)</label>
                    <input
                      type="text"
                      value={data.hero.title.en}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, title: { ...data.hero.title, en: e.target.value } } })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Подзаголовок (RU)</label>
                    <input
                      type="text"
                      value={data.hero.subtitle.ru}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, subtitle: { ...data.hero.subtitle, ru: e.target.value } },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Подзаголовок (EN)</label>
                    <input
                      type="text"
                      value={data.hero.subtitle.en}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, subtitle: { ...data.hero.subtitle, en: e.target.value } },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Описание (RU)</label>
                    <input
                      type="text"
                      value={data.hero.description.ru}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, description: { ...data.hero.description, ru: e.target.value } },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Описание (EN)</label>
                    <input
                      type="text"
                      value={data.hero.description.en}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, description: { ...data.hero.description, en: e.target.value } },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Текст кнопки (RU)</label>
                    <input
                      type="text"
                      value={data.hero.cta.ru}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, cta: { ...data.hero.cta, ru: e.target.value } } })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Текст кнопки (EN)</label>
                    <input
                      type="text"
                      value={data.hero.cta.en}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, cta: { ...data.hero.cta, en: e.target.value } } })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-white">О себе</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Заголовок (RU)</label>
                    <input
                      type="text"
                      value={data.about.title.ru}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, title: { ...data.about.title, ru: e.target.value } },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Заголовок (EN)</label>
                    <input
                      type="text"
                      value={data.about.title.en}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, title: { ...data.about.title, en: e.target.value } },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Описание (RU)</label>
                    <textarea
                      rows={6}
                      value={data.about.description.ru}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, description: { ...data.about.description, ru: e.target.value } },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Описание (EN)</label>
                    <textarea
                      rows={6}
                      value={data.about.description.en}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, description: { ...data.about.description, en: e.target.value } },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SERVICES TAB */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">Услуги</h2>
                  <button
                    onClick={addService}
                    className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors text-sm"
                  >
                    + Добавить услугу
                  </button>
                </div>

                <div className="space-y-4">
                  {data.services.map((service) => (
                    <div key={service.id} className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{service.icon}</span>
                            <h3 className="font-medium text-white">{service.title.ru || "Без названия"}</h3>
                          </div>
                          <p className="text-sm text-gray-400">{service.description.ru}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingService(service)}
                            className="text-sm text-[#6B9BD1] hover:text-[#5a8bc4]"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => deleteService(service.id)}
                            className="text-sm text-red-500 hover:text-red-600"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {data.services.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Услуг пока нет. Добавьте первую услугу.</p>
                  </div>
                )}
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">Проекты</h2>
                  <button
                    onClick={addProject}
                    className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors text-sm"
                  >
                    + Добавить проект
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects.map((project) => (
                    <div key={project.id} className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]">
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.title.ru}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white mb-1">{project.title.ru || "Без названия"}</h3>
                          <p className="text-sm text-gray-400 mb-2">{project.description.ru}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProject(project)}
                            className="text-sm text-[#6B9BD1] hover:text-[#5a8bc4]"
                          >
                            Ред.
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="text-sm text-red-500 hover:text-red-600"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {data.projects.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Проектов пока нет. Добавьте первый проект.</p>
                  </div>
                )}
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === "experience" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">Опыт работы</h2>
                  <button
                    onClick={addExperience}
                    className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors text-sm"
                  >
                    + Добавить опыт
                  </button>
                </div>

                <div className="space-y-4">
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{exp.year}</span>
                            <span className="text-gray-500">•</span>
                            <span className="font-medium text-white">{exp.company.ru}</span>
                          </div>
                          <p className="text-sm text-gray-400 mb-1">{exp.position.ru}</p>
                          <p className="text-sm text-gray-500">{exp.description.ru}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingExperience(exp)}
                            className="text-sm text-[#6B9BD1] hover:text-[#5a8bc4]"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => deleteExperience(exp.id)}
                            className="text-sm text-red-500 hover:text-red-600"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {data.experience.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Опыт работы пока не добавлен. Добавьте первую запись.</p>
                  </div>
                )}
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">Навыки по категориям</h2>
                  <button
                    onClick={addSkillCategory}
                    className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors text-sm"
                  >
                    + Добавить категорию
                  </button>
                </div>

                <div className="space-y-4">
                  {data.skills.map((category) => (
                    <div key={category.id} className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-white">{category.name.ru || "Без названия"}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingSkillCategory(category)}
                            className="text-sm text-[#6B9BD1] hover:text-[#5a8bc4]"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => deleteSkillCategory(category.id)}
                            className="text-sm text-red-500 hover:text-red-600"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {data.skills.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Навыки пока не добавлены. Добавьте первую категорию.</p>
                  </div>
                )}
              </div>
            )}

            {/* CERTIFICATES TAB */}
            {activeTab === "certificates" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">Сертификаты</h2>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={showArchivedCertificates}
                        onChange={(e) => setShowArchivedCertificates(e.target.checked)}
                      />
                      Показывать архив
                    </label>
                    <button
                      onClick={addCertificate}
                      className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors text-sm"
                    >
                      + Добавить сертификат
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.certificates.map((cert) => (
                    <div key={cert.id} className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]">
                      {cert.image_url && (
                        <img
                          src={cert.image_url}
                          alt={cert.title.ru}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white mb-1">{cert.title.ru || "Без названия"}</h3>
                          <p className="text-sm text-gray-400 mb-2">{cert.provider}</p>
                          <p className="text-xs text-gray-500">{cert.issue_date}</p>
                          {cert.order !== undefined && (
                            <p className="text-xs text-gray-600">Порядок: {cert.order}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingCertificate(cert)}
                            className="text-sm text-[#6B9BD1] hover:text-[#5a8bc4]"
                          >
                            Редактировать
                          </button>
                          {cert.is_active === false ? (
                            <button
                              onClick={() => restoreCertificate(cert.id)}
                              className="text-sm text-green-500 hover:text-green-400"
                            >
                              Восстановить
                            </button>
                          ) : (
                            <button
                              onClick={() => deleteCertificate(cert.id)}
                              className="text-sm text-red-500 hover:text-red-600"
                            >
                              Удалить
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {data.certificates.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Сертификатов пока нет. Добавьте первый сертификат.</p>
                  </div>
                )}
              </div>
            )}

            {/* PERSONAL TAB */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">Немного обо мне</h2>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={showArchivedPersonal}
                        onChange={(e) => setShowArchivedPersonal(e.target.checked)}
                      />
                      Показывать архив
                    </label>
                    <button
                      onClick={addPersonalFact}
                      className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors text-sm"
                    >
                      + Добавить факт
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.personal.map((fact) => (
                    <div key={fact.id} className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-3xl mb-2">{fact.emoji}</div>
                          <h3 className="font-medium text-white mb-1">{fact.title.ru || "Без названия"}</h3>
                          <p className="text-sm text-gray-400">{fact.description.ru}</p>
                          {fact.order !== undefined && (
                            <p className="text-xs text-gray-600 mt-2">Порядок: {fact.order}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingPersonalFact(fact)}
                            className="text-sm text-[#6B9BD1] hover:text-[#5a8bc4]"
                          >
                            Редактировать
                          </button>
                          {fact.is_active === false ? (
                            <button
                              onClick={() => restorePersonalFact(fact.id)}
                              className="text-sm text-green-500 hover:text-green-400"
                            >
                              Восстановить
                            </button>
                          ) : (
                            <button
                              onClick={() => deletePersonalFact(fact.id)}
                              className="text-sm text-red-500 hover:text-red-600"
                            >
                              Удалить
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {data.personal.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Фактов пока нет. Добавьте первый.</p>
                  </div>
                )}
              </div>
            )}

            {/* CONTACTS TAB */}
            {activeTab === "contacts" && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-white">Контакты и ссылки</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      value={settingsData.email}
                      onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Телефон</label>
                    <input
                      type="text"
                      value={settingsData.phone}
                      onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Локация (RU)</label>
                    <input
                      type="text"
                      value={settingsData.location.ru}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          location: { ...settingsData.location, ru: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Локация (EN)</label>
                    <input
                      type="text"
                      value={settingsData.location.en}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          location: { ...settingsData.location, en: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Заголовок контактов (RU)</label>
                    <input
                      type="text"
                      value={settingsData.contact_title.ru}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          contact_title: { ...settingsData.contact_title, ru: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Заголовок контактов (EN)</label>
                    <input
                      type="text"
                      value={settingsData.contact_title.en}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          contact_title: { ...settingsData.contact_title, en: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Описание контактов (RU)</label>
                    <textarea
                      rows={3}
                      value={settingsData.contact_description.ru}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          contact_description: { ...settingsData.contact_description, ru: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Описание контактов (EN)</label>
                    <textarea
                      rows={3}
                      value={settingsData.contact_description.en}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          contact_description: { ...settingsData.contact_description, en: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Footer права (RU)</label>
                    <input
                      type="text"
                      value={settingsData.footer_rights.ru}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          footer_rights: { ...settingsData.footer_rights, ru: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Footer права (EN)</label>
                    <input
                      type="text"
                      value={settingsData.footer_rights.en}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          footer_rights: { ...settingsData.footer_rights, en: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">GitHub</label>
                    <input
                      type="text"
                      value={socialLinks.github || ""}
                      onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">LinkedIn</label>
                    <input
                      type="text"
                      value={socialLinks.linkedin || ""}
                      onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Telegram</label>
                    <input
                      type="text"
                      value={socialLinks.telegram || ""}
                      onChange={(e) => setSocialLinks({ ...socialLinks, telegram: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============= MODALS ============= */}

      {/* Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-6">
              {editingService.id > 0 ? "Редактировать услугу" : "Новая услуга"}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Иконка (эмодзи)</label>
                <input
                  type="text"
                  value={editingService.icon}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Название (RU)</label>
                  <input
                    type="text"
                    value={editingService.title.ru}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        title: { ...editingService.title, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Название (EN)</label>
                  <input
                    type="text"
                    value={editingService.title.en}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        title: { ...editingService.title, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Описание (RU)</label>
                  <textarea
                    rows={3}
                    value={editingService.description.ru}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        description: { ...editingService.description, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Описание (EN)</label>
                  <textarea
                    rows={3}
                    value={editingService.description.en}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        description: { ...editingService.description, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Детали (RU)</label>
                  <textarea
                    rows={6}
                    value={editingService.details.ru}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        details: { ...editingService.details, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Детали (EN)</label>
                  <textarea
                    rows={6}
                    value={editingService.details.en}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        details: { ...editingService.details, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveService}
                disabled={isSaving}
                className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors disabled:opacity-50"
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-6">
              {editingProject.id > 0 ? "Редактировать проект" : "Новый проект"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Название (RU)</label>
                  <input
                    type="text"
                    value={editingProject.title.ru}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: { ...editingProject.title, ru: e.target.value } })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Название (EN)</label>
                  <input
                    type="text"
                    value={editingProject.title.en}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: { ...editingProject.title, en: e.target.value } })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Описание (RU)</label>
                  <textarea
                    rows={3}
                    value={editingProject.description.ru}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        description: { ...editingProject.description, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Описание (EN)</label>
                  <textarea
                    rows={3}
                    value={editingProject.description.en}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        description: { ...editingProject.description, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Ссылка на изображение</label>
                {editingProject.image && (
                  <img
                    src={editingProject.image}
                    alt={editingProject.title.ru || "Project image"}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "project")}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
                <input
                  type="text"
                  value={editingProject.image}
                  readOnly
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  placeholder="URL появится после загрузки"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Теги (через запятую)</label>
                <input
                  type="text"
                  value={editingProject.tags.join(", ")}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Ссылка на проект</label>
                <input
                  type="text"
                  value={editingProject.link}
                  onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveProject}
                disabled={isSaving || isUploadingImage}
                className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors disabled:opacity-50"
              >
                {isUploadingImage ? "Загрузка изображения..." : isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {editingExperience && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-6">
              {editingExperience.id > 0 ? "Редактировать опыт" : "Новый опыт"}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Год/Период</label>
                <input
                  type="text"
                  placeholder="2020 — настоящее время"
                  value={editingExperience.year}
                  onChange={(e) => setEditingExperience({ ...editingExperience, year: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Компания (RU)</label>
                  <input
                    type="text"
                    value={editingExperience.company.ru}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        company: { ...editingExperience.company, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Компания (EN)</label>
                  <input
                    type="text"
                    value={editingExperience.company.en}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        company: { ...editingExperience.company, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Должность (RU)</label>
                  <input
                    type="text"
                    value={editingExperience.position.ru}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        position: { ...editingExperience.position, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Должность (EN)</label>
                  <input
                    type="text"
                    value={editingExperience.position.en}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        position: { ...editingExperience.position, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Описание (RU)</label>
                  <textarea
                    rows={4}
                    value={editingExperience.description.ru}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        description: { ...editingExperience.description, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Описание (EN)</label>
                  <textarea
                    rows={4}
                    value={editingExperience.description.en}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        description: { ...editingExperience.description, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingExperience(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveExperience}
                disabled={isSaving}
                className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors disabled:opacity-50"
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Category Modal */}
      {editingSkillCategory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-6">
              {editingSkillCategory.id > 0 ? "Редактировать категорию" : "Новая категория"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Название категории (RU)</label>
                  <input
                    type="text"
                    value={editingSkillCategory.name.ru}
                    onChange={(e) =>
                      setEditingSkillCategory({
                        ...editingSkillCategory,
                        name: { ...editingSkillCategory.name, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Название категории (EN)</label>
                  <input
                    type="text"
                    value={editingSkillCategory.name.en}
                    onChange={(e) =>
                      setEditingSkillCategory({
                        ...editingSkillCategory,
                        name: { ...editingSkillCategory.name, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Навыки (через запятую)</label>
                <textarea
                  rows={4}
                  value={editingSkillCategory.skills.join(", ")}
                  onChange={(e) =>
                    setEditingSkillCategory({
                      ...editingSkillCategory,
                      skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  placeholder="React, Next.js, TypeScript"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingSkillCategory(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveSkillCategory}
                disabled={isSaving}
                className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors disabled:opacity-50"
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {editingCertificate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-6">
              {editingCertificate.id > 0 ? "Редактировать сертификат" : "Новый сертификат"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Название (RU)</label>
                  <input
                    type="text"
                    value={editingCertificate.title.ru}
                    onChange={(e) =>
                      setEditingCertificate({
                        ...editingCertificate,
                        title: { ...editingCertificate.title, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Название (EN)</label>
                  <input
                    type="text"
                    value={editingCertificate.title.en}
                    onChange={(e) =>
                      setEditingCertificate({
                        ...editingCertificate,
                        title: { ...editingCertificate.title, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Описание (RU)</label>
                  <textarea
                    rows={3}
                    value={editingCertificate.description.ru}
                    onChange={(e) =>
                      setEditingCertificate({
                        ...editingCertificate,
                        description: { ...editingCertificate.description, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Описание (EN)</label>
                  <textarea
                    rows={3}
                    value={editingCertificate.description.en}
                    onChange={(e) =>
                      setEditingCertificate({
                        ...editingCertificate,
                        description: { ...editingCertificate.description, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Провайдер</label>
                  <input
                    type="text"
                    value={editingCertificate.provider}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, provider: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Дата</label>
                  <input
                    type="text"
                    value={editingCertificate.issue_date}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, issue_date: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Изображение</label>
                {editingCertificate.image_url && (
                  <img
                    src={editingCertificate.image_url}
                    alt={editingCertificate.title.ru || "Certificate image"}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCertificateImageUpload}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
                <input
                  type="text"
                  value={editingCertificate.image_url}
                  readOnly
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  placeholder="URL появится после загрузки"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Порядок</label>
                <input
                  type="number"
                  value={editingCertificate.order ?? ""}
                  onChange={(e) =>
                    setEditingCertificate({
                      ...editingCertificate,
                      order: e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Ссылка на подтверждение (опционально)</label>
                <input
                  type="text"
                  value={editingCertificate.credential_url || ""}
                  onChange={(e) => setEditingCertificate({ ...editingCertificate, credential_url: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingCertificate(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveCertificate}
                disabled={isSaving || isUploadingCertificateImage}
                className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors disabled:opacity-50"
              >
                {isUploadingCertificateImage ? "Загрузка изображения..." : isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personal Fact Modal */}
      {editingPersonalFact && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-6">
              {editingPersonalFact.id > 0 ? "Редактировать факт" : "Новый факт"}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Эмодзи</label>
                <input
                  type="text"
                  value={editingPersonalFact.emoji}
                  onChange={(e) => setEditingPersonalFact({ ...editingPersonalFact, emoji: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Название (RU)</label>
                  <input
                    type="text"
                    value={editingPersonalFact.title.ru}
                    onChange={(e) =>
                      setEditingPersonalFact({
                        ...editingPersonalFact,
                        title: { ...editingPersonalFact.title, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Название (EN)</label>
                  <input
                    type="text"
                    value={editingPersonalFact.title.en}
                    onChange={(e) =>
                      setEditingPersonalFact({
                        ...editingPersonalFact,
                        title: { ...editingPersonalFact.title, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Описание (RU)</label>
                  <textarea
                    rows={3}
                    value={editingPersonalFact.description.ru}
                    onChange={(e) =>
                      setEditingPersonalFact({
                        ...editingPersonalFact,
                        description: { ...editingPersonalFact.description, ru: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Описание (EN)</label>
                  <textarea
                    rows={3}
                    value={editingPersonalFact.description.en}
                    onChange={(e) =>
                      setEditingPersonalFact({
                        ...editingPersonalFact,
                        description: { ...editingPersonalFact.description, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Порядок</label>
                <input
                  type="number"
                  value={editingPersonalFact.order ?? ""}
                  onChange={(e) =>
                    setEditingPersonalFact({
                      ...editingPersonalFact,
                      order: e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingPersonalFact(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={savePersonalFact}
                disabled={isSaving}
                className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors disabled:opacity-50"
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
