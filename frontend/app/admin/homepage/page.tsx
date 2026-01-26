"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Service {
  id: string
  title: { ru: string; en: string }
  description: { ru: string; en: string }
  details: { ru: string; en: string }
  icon: string
}

interface Project {
  id: string
  title: { ru: string; en: string }
  description: { ru: string; en: string }
  image: string
  tags: string[]
  link: string
}

interface Experience {
  id: string
  year: string
  company: { ru: string; en: string }
  position: { ru: string; en: string }
  description: { ru: string; en: string }
}

interface SkillCategory {
  id: string
  name: { ru: string; en: string }
  skills: string[]
}

interface HomePageData {
  hero: {
    title: { ru: string; en: string }
    subtitle: { ru: string; en: string }
    description: { ru: string; en: string }
    cta: { ru: string; en: string }
    image: string
  }
  about: {
    title: { ru: string; en: string }
    description: { ru: string; en: string }
  }
  services: Service[]
  projects: Project[]
  experience: Experience[]
  skills: SkillCategory[]
}

export default function AdminHomePage() {
  const router = useRouter()
  const [data, setData] = useState<HomePageData>({
    hero: {
      title: { ru: "Алексей Ачкасов", en: "Alexey Achkasov" },
      subtitle: { ru: "Backend-разработчик", en: "Backend Developer" },
      description: {
        ru: "Специализируюсь на Python и Django. Создаю надежные веб-приложения и интернет-магазины.",
        en: "Specializing in Python and Django. Building reliable web applications and online stores.",
      },
      cta: { ru: "Связаться со мной", en: "Contact Me" },
      image: "/professional-developer-portrait-photo.jpg",
    },
    about: {
      title: { ru: "О себе", en: "About Me" },
      description: {
        ru: "За 11 лет в IT я прошёл путь от UI/UX-дизайнера до backend-разработчика. Работаю с Python, Django, PostgreSQL и современными технологиями. Создаю масштабируемые решения для бизнеса.",
        en: "Over 11 years in IT, I've gone from UI/UX designer to backend developer. I work with Python, Django, PostgreSQL and modern technologies. Creating scalable business solutions.",
      },
    },
    services: [
      {
        id: "1",
        title: { ru: "Разработка интернет-магазинов", en: "E-commerce Development" },
        description: {
          ru: "Полнофункциональные e-commerce решения на Django",
          en: "Full-featured e-commerce solutions on Django",
        },
        details: {
          ru: "Каталог товаров с фильтрацией и поиском\nКорзина и процесс оформления заказа\nИнтеграция платежных систем (Stripe, PayPal, ЮKassa)\nЛичный кабинет пользователя с историей заказов\nАдминистративная панель для управления\nSEO-оптимизация и аналитика",
          en: "Product catalog with filtering and search\nCart and checkout process\nPayment systems integration (Stripe, PayPal, YuKassa)\nUser account with order history\nAdministrative panel for management\nSEO optimization and analytics",
        },
        icon: "🛒",
      },
      {
        id: "2",
        title: { ru: "API разработка", en: "API Development" },
        description: { ru: "RESTful API с Django REST Framework", en: "RESTful API with Django REST Framework" },
        details: {
          ru: "Проектирование архитектуры API\nРазработка endpoints с полной документацией\nJWT аутентификация и авторизация\nВалидация данных и обработка ошибок\nВерсионирование API\nИнтеграция с мобильными приложениями",
          en: "API architecture design\nDevelopment of endpoints with full documentation\nJWT authentication and authorization\nData validation and error handling\nAPI versioning\nMobile app integration",
        },
        icon: "🔌",
      },
      {
        id: "3",
        title: { ru: "Интеграции", en: "Integrations" },
        description: { ru: "Подключение внешних сервисов и CRM", en: "Connecting external services and CRM" },
        details: {
          ru: "Интеграция с платежными системами\nПодключение CRM (Bitrix24, amoCRM)\nAPI сторонних сервисов\nСинхронизация данных между системами\nНастройка webhooks и уведомлений\nАвтоматизация бизнес-процессов",
          en: "Payment system integration\nCRM integration (Bitrix24, amoCRM)\nThird-party service APIs\nData synchronization between systems\nWebhooks and notifications setup\nBusiness process automation",
        },
        icon: "🔗",
      },
      {
        id: "4",
        title: { ru: "Оптимизация", en: "Optimization" },
        description: { ru: "Улучшение производительности приложений", en: "Application performance improvement" },
        details: {
          ru: "Аудит производительности и узких мест\nОптимизация запросов к базе данных\nКэширование (Redis, Memcached)\nНастройка асинхронных задач (Celery)\nОптимизация frontend загрузки\nМониторинг и профилирование",
          en: "Performance and bottleneck audit\nDatabase query optimization\nCaching (Redis, Memcached)\nAsynchronous tasks setup (Celery)\nFrontend loading optimization\nMonitoring and profiling",
        },
        icon: "⚡",
      },
      {
        id: "5",
        title: { ru: "Консультации", en: "Consulting" },
        description: { ru: "Архитектурные решения и аудит", en: "Architectural solutions and audit" },
        details: {
          ru: "Технический аудит существующих проектов\nРекомендации по архитектуре\nCode review и рефакторинг\nВыбор технологического стека\nОценка сроков и стоимости разработки\nМенторство и обучение команды",
          en: "Technical audit of existing projects\nArchitecture recommendations\nCode review and refactoring\nTechnology stack selection\nDevelopment timeline and cost estimation\nMentoring and team training",
        },
        icon: "💡",
      },
      {
        id: "6",
        title: { ru: "Поддержка", en: "Support" },
        description: { ru: "Долгосрочная поддержка проектов", en: "Long-term project support" },
        details: {
          ru: "Исправление багов и ошибок\nОбновление зависимостей и библиотек\nДобавление новых функций\nМониторинг работы приложения\nРезервное копирование данных\nТехническая поддержка пользователей",
          en: "Bug fixes\nDependency and library updates\nAdding new features\nApplication monitoring\nData backups\nUser technical support",
        },
        icon: "🛠",
      },
    ],
    projects: [
      {
        id: "1",
        title: { ru: "E-commerce платформа", en: "E-commerce Platform" },
        description: {
          ru: "Интернет-магазин с каталогом, корзиной, оплатой и CRM",
          en: "Online store with catalog, cart, payment and CRM",
        },
        image: "/modern-ecommerce-platform.jpg",
        tags: ["Django", "PostgreSQL", "Redis", "Celery"],
        link: "#",
      },
      {
        id: "2",
        title: { ru: "API для мобильного приложения", en: "Mobile App API" },
        description: {
          ru: "RESTful API с аутентификацией и real-time уведомлениями",
          en: "RESTful API with authentication and real-time notifications",
        },
        image: "/mobile-api-backend.jpg",
        tags: ["Django REST", "JWT", "WebSocket"],
        link: "#",
      },
      {
        id: "3",
        title: { ru: "Система управления контентом", en: "Content Management System" },
        description: {
          ru: "CMS для корпоративного сайта с многоязычностью",
          en: "CMS for corporate website with multilingual support",
        },
        image: "/cms-dashboard.png",
        tags: ["Django", "Docker", "nginx"],
        link: "#",
      },
    ],
    experience: [
      {
        id: "1",
        year: "2020 — настоящее время",
        company: { ru: "Самозанятость", en: "Self-employed" },
        position: { ru: "Фриланс Backend-разработчик", en: "Freelance Backend Developer" },
        description: {
          ru: "Разработка веб-приложений на Django для различных клиентов",
          en: "Django web application development for various clients",
        },
      },
      {
        id: "2",
        year: "2017 — 2020",
        company: { ru: "Tech Company", en: "Tech Company" },
        position: { ru: "Backend-разработчик", en: "Backend Developer" },
        description: {
          ru: "Разработка и поддержка корпоративных систем",
          en: "Development and support of corporate systems",
        },
      },
      {
        id: "3",
        year: "2013 — 2017",
        company: { ru: "Digital Agency", en: "Digital Agency" },
        position: { ru: "Full-stack разработчик", en: "Full-stack Developer" },
        description: {
          ru: "Создание сайтов и веб-приложений для клиентов",
          en: "Creating websites and web applications for clients",
        },
      },
    ],
    skills: [
      {
        id: "1",
        name: { ru: "Backend", en: "Backend" },
        skills: ["Python", "Django", "Django REST", "FastAPI", "Celery"],
      },
      {
        id: "2",
        name: { ru: "Базы данных", en: "Databases" },
        skills: ["PostgreSQL", "Redis", "MongoDB"],
      },
      {
        id: "3",
        name: { ru: "DevOps", en: "DevOps" },
        skills: ["Docker", "nginx", "Linux", "Git"],
      },
      {
        id: "4",
        name: { ru: "Frontend", en: "Frontend" },
        skills: ["JavaScript", "React", "HTML/CSS"],
      },
    ],
  })
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "services" | "projects" | "experience" | "skills">(
    "hero",
  )
  const [isLoading, setIsLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [editingSkillCategory, setEditingSkillCategory] = useState<SkillCategory | null>(null)

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/admin")
    } else {
      const savedData = localStorage.getItem("homepageData")
      if (savedData) {
        setData(JSON.parse(savedData))
      }
      setIsLoading(false)
    }
  }, [router])

  const handleSave = () => {
    localStorage.setItem("homepageData", JSON.stringify(data))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "project") => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === "hero") {
          setData({ ...data, hero: { ...data.hero, image: reader.result as string } })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: { ru: "", en: "" },
      description: { ru: "", en: "" },
      details: { ru: "", en: "" },
      icon: "🚀",
    }
    setEditingService(newService)
  }

  const saveService = () => {
    if (editingService) {
      const existingIndex = data.services.findIndex((s) => s.id === editingService.id)
      if (existingIndex >= 0) {
        const newServices = [...data.services]
        newServices[existingIndex] = editingService
        setData({ ...data, services: newServices })
      } else {
        setData({ ...data, services: [...data.services, editingService] })
      }
      setEditingService(null)
    }
  }

  const deleteService = (id: string) => {
    if (confirm("Удалить эту услугу?")) {
      setData({ ...data, services: data.services.filter((s) => s.id !== id) })
    }
  }

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: { ru: "", en: "" },
      description: { ru: "", en: "" },
      image: "",
      tags: [],
      link: "",
    }
    setEditingProject(newProject)
  }

  const saveProject = () => {
    if (editingProject) {
      const existingIndex = data.projects.findIndex((p) => p.id === editingProject.id)
      if (existingIndex >= 0) {
        const newProjects = [...data.projects]
        newProjects[existingIndex] = editingProject
        setData({ ...data, projects: newProjects })
      } else {
        setData({ ...data, projects: [...data.projects, editingProject] })
      }
      setEditingProject(null)
    }
  }

  const deleteProject = (id: string) => {
    if (confirm("Удалить этот проект?")) {
      setData({ ...data, projects: data.projects.filter((p) => p.id !== id) })
    }
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      year: "",
      company: { ru: "", en: "" },
      position: { ru: "", en: "" },
      description: { ru: "", en: "" },
    }
    setEditingExperience(newExp)
  }

  const saveExperience = () => {
    if (editingExperience) {
      const existingIndex = data.experience.findIndex((e) => e.id === editingExperience.id)
      if (existingIndex >= 0) {
        const newExperience = [...data.experience]
        newExperience[existingIndex] = editingExperience
        setData({ ...data, experience: newExperience })
      } else {
        setData({ ...data, experience: [...data.experience, editingExperience] })
      }
      setEditingExperience(null)
    }
  }

  const deleteExperience = (id: string) => {
    if (confirm("Удалить этот опыт?")) {
      setData({ ...data, experience: data.experience.filter((e) => e.id !== id) })
    }
  }

  const addSkillCategory = () => {
    const newCategory: SkillCategory = {
      id: Date.now().toString(),
      name: { ru: "", en: "" },
      skills: [],
    }
    setEditingSkillCategory(newCategory)
  }

  const saveSkillCategory = () => {
    if (editingSkillCategory) {
      const existingIndex = data.skills.findIndex((s) => s.id === editingSkillCategory.id)
      if (existingIndex >= 0) {
        const newSkills = [...data.skills]
        newSkills[existingIndex] = editingSkillCategory
        setData({ ...data, skills: newSkills })
      } else {
        setData({ ...data, skills: [...data.skills, editingSkillCategory] })
      }
      setEditingSkillCategory(null)
    }
  }

  const deleteSkillCategory = (id: string) => {
    if (confirm("Удалить эту категорию навыков?")) {
      setData({ ...data, skills: data.skills.filter((s) => s.id !== id) })
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-gray-400">Загрузка...</div>
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
              <h1 className="text-lg font-medium text-white">Редактирование главной страницы</h1>
            </div>
            <div className="flex items-center space-x-4">
              {saved && <span className="text-green-500 text-sm">Сохранено</span>}
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
        <div className="bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-800">
          <div className="border-b border-gray-800">
            <nav className="flex -mb-px overflow-x-auto">
              {["hero", "about", "services", "projects", "experience", "skills"].map((tab) => (
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
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "hero" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-white">Hero секция</h2>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Фото</label>
                  <div className="flex items-center gap-4">
                    {data.hero.image && (
                      <img
                        src={data.hero.image || "/placeholder.svg"}
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

                {/* 4 Hero Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Заголовок (RU)</label>
                    <input
                      type="text"
                      value={data.hero.title.ru}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, title: { ...data.hero.title, ru: e.target.value } } })
                      }
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-white">О себе</h2>
                <div className="space-y-4">
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
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

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
                          <h3 className="font-medium text-white">{service.title.ru || "Без названия"}</h3>
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
                          src={project.image || "/placeholder.svg"}
                          alt={project.title.ru}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">{project.title.ru || "Без названия"}</h3>
                          <p className="text-sm text-gray-400">{project.description.ru}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProject(project)}
                            className="text-sm text-[#6B9BD1] hover:text-[#5a8bc4]"
                          >
                            Редактировать
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
                          <p className="text-sm text-gray-400">{exp.position.ru}</p>
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
          </div>
        </div>
      </div>

      {/* Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-6">
              {data.services.find((s) => s.id === editingService.id) ? "Редактировать услугу" : "Новая услуга"}
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
                className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {editingProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-6">
              {data.projects.find((p) => p.id === editingProject.id) ? "Редактировать проект" : "Новый проект"}
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
                <input
                  type="text"
                  value={editingProject.image}
                  onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6B9BD1]"
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
                      tags: e.target.value.split(",").map((t) => t.trim()),
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
                className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {editingExperience && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-6">
              {data.experience.find((e) => e.id === editingExperience.id) ? "Редактировать опыт" : "Новый опыт"}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Год</label>
                <input
                  type="text"
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
                className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {editingSkillCategory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-800">
            <h3 className="text-xl font-medium text-white mb-6">
              {data.skills.find((s) => s.id === editingSkillCategory.id)
                ? "Редактировать категорию"
                : "Новая категория"}
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
                      skills: e.target.value.split(",").map((s) => s.trim()),
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
                className="px-4 py-2 bg-[#6B9BD1] text-white rounded-lg hover:bg-[#5a8bc4] transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
