// Multilingual Support
const translations = {
  ru: {
    name: "Алексей Ачкасов",
    "nav.about": "О себе",
    "nav.services": "Услуги",
    "nav.projects": "Проекты",
    "nav.experience": "Опыт",
    "nav.skills": "Навыки",
    "nav.blog": "Блог",
    "nav.contacts": "Контакты",
    "about.greeting": "Привет, я Алексей Ачкасов",
    "about.description":
      "Backend-разработчик на Python и Django. За 11 лет в IT я прошёл путь от UI/UX-дизайнера до фриланс-разработчика. Специализируюсь на создании интернет-магазинов, веб-приложений и интеграции сервисов.",
    "about.cta": "Связаться со мной",
    "services.title": "Что я могу",
    "services.item1.title": "Разработка интернет-магазинов",
    "services.item1.desc": "Создание полнофункциональных e-commerce решений на Django с интеграцией платёжных систем",
    "services.item2.title": "Веб-приложения",
    "services.item2.desc": "Разработка сложных веб-приложений с архитектурой REST API и современным стеком технологий",
    "services.item3.title": "Интеграция сервисов",
    "services.item3.desc": "Подключение и настройка сторонних API, CRM-систем, платёжных шлюзов",
    "services.item4.title": "Оптимизация производительности",
    "services.item4.desc": "Улучшение скорости работы существующих проектов, оптимизация баз данных",
    "services.item5.title": "Консультации",
    "services.item5.desc": "Помощь в выборе технологий, архитектурные решения, code review",
    "services.item6.title": "Поддержка проектов",
    "services.item6.desc": "Техническая поддержка, исправление ошибок, добавление новых функций",
    "projects.title": "Проекты",
    "projects.project1.title": "E-commerce платформа",
    "projects.project1.desc": "Интернет-магазин с системой управления заказами, интеграцией платежей и CRM",
    "projects.project2.title": "API для мобильного приложения",
    "projects.project2.desc": "REST API с JWT-аутентификацией, документацией и rate limiting",
    "projects.project3.title": "Система бронирования",
    "projects.project3.desc": "Веб-приложение для управления бронированиями с календарём и уведомлениями",
    "projects.project4.title": "Аналитическая панель",
    "projects.project4.desc": "Dashboard для визуализации бизнес-метрик с графиками и отчётами",
    "experience.title": "Опыт работы",
    "experience.job1.date": "2020 — настоящее время",
    "experience.job1.position": "Фриланс Backend-разработчик",
    "experience.job1.company": "Самозанятость",
    "experience.job1.desc":
      "Разработка веб-приложений на Python/Django для российских и международных клиентов. Создание интернет-магазинов, API, интеграция с внешними сервисами.",
    "experience.job2.date": "2017 — 2020",
    "experience.job2.position": "Python Developer",
    "experience.job2.company": "IT-компания",
    "experience.job2.desc":
      "Разработка и поддержка корпоративных веб-приложений. Работа с Django, PostgreSQL, Redis. Участие в code review и менторинг junior-разработчиков.",
    "experience.job3.date": "2013 — 2017",
    "experience.job3.position": "UI/UX Designer",
    "experience.job3.company": "Дизайн-студия",
    "experience.job3.desc":
      "Проектирование пользовательских интерфейсов для веб и мобильных приложений. Создание прототипов, работа с клиентами, подготовка UI-kit'ов.",
    "skills.title": "Навыки",
    "contacts.title": "Контакты",
    "contacts.subtitle": "Свяжитесь со мной для обсуждения проекта",
    "footer.rights": "Все права защищены",
    "blog.title": "Блог — Алексей Ачкасов",
    "blog.header": "Блог",
    "blog.subtitle": "Статьи о разработке, Python, Django и технологиях",
    "blog.categories.django": "Django",
    "blog.categories.api": "API",
    "blog.categories.devops": "DevOps",
    "blog.readMore": "Читать",
    "blog.article1.title": "Оптимизация запросов в Django ORM",
    "blog.article1.preview":
      "Разбираем основные способы оптимизации работы с базой данных в Django: select_related, prefetch_related, аннотации и агрегации. Практические примеры и замеры производительности.",
    "blog.article2.title": "JWT аутентификация в Django REST Framework",
    "blog.article2.preview":
      "Пошаговое руководство по внедрению JWT-токенов в ваш API. Настройка, безопасность, refresh tokens и лучшие практики работы с аутентификацией.",
    "blog.article3.title": "Docker для Python-проектов",
    "blog.article3.preview":
      "Как правильно контейнеризировать Django-приложение. Создание Dockerfile, docker-compose, работа с volumes и переменными окружения.",
    "article.back": "← Назад в блог",
    "article.formTitle": "Оставьте комментарий",
    "form.name": "Имя",
    "form.email": "Email",
    "form.message": "Сообщение",
    "form.submit": "Отправить",
    "article1.title": "Оптимизация запросов в Django ORM",
    "article1.intro":
      "Django ORM — мощный инструмент для работы с базами данных, но неправильное использование может привести к проблемам производительности. В этой статье разберём основные методы оптимизации запросов.",
    "article1.section1.title": "Проблема N+1 запросов",
    "article1.section1.p1":
      "Одна из самых распространённых проблем — это N+1 запросов. Она возникает, когда вы запрашиваете список объектов, а затем для каждого объекта выполняете дополнительный запрос к связанным данным.",
    "article1.section1.p2":
      "Например, если у вас есть модель Post с внешним ключом на Author, и вы делаете такой запрос в шаблоне:",
    "article1.section2.title": "Решение: select_related",
    "article1.section2.p1":
      "Для связей ForeignKey и OneToOne используйте select_related. Этот метод выполняет SQL JOIN и загружает все данные одним запросом.",
    "article1.section2.p2": "В результате вместо N+1 запросов выполнится всего один запрос с JOIN.",
    "article1.section3.title": "prefetch_related для ManyToMany",
    "article1.section3.p1":
      "Для связей ManyToMany и обратных ForeignKey используйте prefetch_related. Он выполняет отдельный запрос для связанных объектов и объединяет их в Python.",
    "article1.section4.title": "Аннотации и агрегации",
    "article1.section4.p1":
      "Используйте annotate() и aggregate() для вычислений на уровне базы данных вместо загрузки всех данных в Python.",
    "article1.section4.p2": "Это значительно быстрее, чем загружать все посты и считать комментарии в Python.",
    "article1.conclusion.title": "Заключение",
    "article1.conclusion.p1":
      "Правильная оптимизация запросов критична для производительности Django-приложений. Используйте Django Debug Toolbar для отслеживания запросов и применяйте описанные методы там, где это необходимо.",
    "article2.title": "JWT аутентификация в Django REST Framework",
    "article2.intro":
      "JWT (JSON Web Token) — стандарт для создания токенов доступа, который идеально подходит для REST API. В этой статье рассмотрим, как правильно внедрить JWT в Django REST Framework.",
    "article2.section1.title": "Что такое JWT?",
    "article2.section1.p1":
      "JWT — это компактный токен, состоящий из трёх частей: заголовка, полезной нагрузки и подписи. Он позволяет безопасно передавать информацию между клиентом и сервером.",
    "article2.section1.p2":
      "Главное преимущество JWT — токен содержит всю необходимую информацию о пользователе, и сервер может проверить его подлинность без обращения к базе данных.",
    "article2.section2.title": "Установка и настройка",
    "article2.section2.p1":
      "Для работы с JWT в Django REST Framework используется библиотека djangorestframework-simplejwt. Установите её через pip и добавьте в настройки проекта.",
    "article2.section2.p2": "После этого создайте эндпоинты для получения и обновления токенов.",
    "article2.section3.title": "Access и Refresh токены",
    "article2.section3.p1":
      "JWT использует два типа токенов: access token (короткоживущий) и refresh token (долгоживущий). Access token используется для авторизации запросов, а refresh token — для получения нового access token.",
    "article2.section3.p2":
      "Это повышает безопасность: если access token скомпрометирован, он перестанет работать через короткое время.",
    "article2.section4.title": "Защита эндпоинтов",
    "article2.section4.p1":
      "Чтобы защитить API-эндпоинты, используйте permission classes из DRF. Для JWT достаточно добавить IsAuthenticated.",
    "article2.section4.p2": "Клиент должен отправлять access token в заголовке Authorization: Bearer {token}.",
    "article2.conclusion.title": "Лучшие практики",
    "article2.conclusion.p1":
      "Храните refresh token в httpOnly cookie для защиты от XSS-атак. Устанавливайте короткое время жизни для access token (5-15 минут). Используйте HTTPS для всех запросов. Реализуйте механизм revoke токенов для экстренных случаев.",
    "article3.title": "Docker для Python-проектов",
    "article3.intro":
      "Docker упрощает развёртывание и масштабирование приложений. В этой статье разберём, как правильно контейнеризировать Django-проект и настроить окружение для разработки и продакшена.",
    "article3.section1.title": "Зачем нужен Docker?",
    "article3.section1.p1":
      'Docker решает проблему "у меня работает". Контейнер содержит всё необходимое: код, зависимости, системные библиотеки. Это гарантирует, что приложение будет работать одинаково на любой машине.',
    "article3.section1.p2":
      "Кроме того, Docker упрощает настройку окружения для новых разработчиков и облегчает развёртывание на серверах.",
    "article3.section2.title": "Создание Dockerfile",
    "article3.section2.p1":
      "Dockerfile — это инструкция для сборки образа. Для Django-приложения создайте многоступенчатый Dockerfile с оптимизацией слоёв.",
    "article3.section2.p2":
      "Используйте официальный образ Python, установите зависимости, скопируйте код и укажите команду запуска.",
    "article3.section3.title": "Docker Compose",
    "article3.section3.p1":
      "Docker Compose позволяет описать многоконтейнерное приложение в одном файле. Для Django обычно нужны контейнеры для приложения, базы данных и, возможно, Redis.",
    "article3.section3.p2":
      "Создайте docker-compose.yml с сервисами web, db и redis. Используйте volumes для персистентности данных.",
    "article3.section4.title": "Переменные окружения",
    "article3.section4.p1":
      "Никогда не храните секреты в Dockerfile или коде. Используйте переменные окружения для конфигурации. Создайте .env файл для локальной разработки.",
    "article3.section4.p2": "Docker Compose автоматически подхватит .env файл и передаст переменные в контейнеры.",
    "article3.conclusion.title": "Продакшн",
    "article3.conclusion.p1":
      "Для продакшена используйте отдельный Dockerfile с оптимизациями: многоступенчатую сборку, минимальный базовый образ (alpine), установку только production-зависимостей. Используйте Nginx в качестве reverse proxy.",
  },
  en: {
    name: "Aleksey Achkasov",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.projects": "Projects",
    "nav.experience": "Experience",
    "nav.skills": "Skills",
    "nav.blog": "Blog",
    "nav.contacts": "Contacts",
    "about.greeting": "Hi, I'm Aleksey Achkasov",
    "about.description":
      "Backend developer specializing in Python and Django. With 11 years in IT, I've gone from UI/UX designer to freelance developer. I specialize in e-commerce development, web applications, and service integrations.",
    "about.cta": "Contact Me",
    "services.title": "What I Do",
    "services.item1.title": "E-commerce Development",
    "services.item1.desc": "Building full-featured e-commerce solutions on Django with payment system integrations",
    "services.item2.title": "Web Applications",
    "services.item2.desc": "Developing complex web applications with REST API architecture and modern tech stack",
    "services.item3.title": "Service Integration",
    "services.item3.desc": "Connecting and configuring third-party APIs, CRM systems, payment gateways",
    "services.item4.title": "Performance Optimization",
    "services.item4.desc": "Improving speed of existing projects, database optimization",
    "services.item5.title": "Consulting",
    "services.item5.desc": "Help with technology selection, architectural decisions, code review",
    "services.item6.title": "Project Support",
    "services.item6.desc": "Technical support, bug fixes, adding new features",
    "projects.title": "Projects",
    "projects.project1.title": "E-commerce Platform",
    "projects.project1.desc": "Online store with order management system, payment integration, and CRM",
    "projects.project2.title": "Mobile App API",
    "projects.project2.desc": "REST API with JWT authentication, documentation, and rate limiting",
    "projects.project3.title": "Booking System",
    "projects.project3.desc": "Web application for managing bookings with calendar and notifications",
    "projects.project4.title": "Analytics Dashboard",
    "projects.project4.desc": "Dashboard for visualizing business metrics with charts and reports",
    "experience.title": "Work Experience",
    "experience.job1.date": "2020 — Present",
    "experience.job1.position": "Freelance Backend Developer",
    "experience.job1.company": "Self-Employed",
    "experience.job1.desc":
      "Developing web applications in Python/Django for Russian and international clients. Creating e-commerce sites, APIs, integrating external services.",
    "experience.job2.date": "2017 — 2020",
    "experience.job2.position": "Python Developer",
    "experience.job2.company": "IT Company",
    "experience.job2.desc":
      "Development and support of corporate web applications. Working with Django, PostgreSQL, Redis. Participating in code reviews and mentoring junior developers.",
    "experience.job3.date": "2013 — 2017",
    "experience.job3.position": "UI/UX Designer",
    "experience.job3.company": "Design Studio",
    "experience.job3.desc":
      "Designing user interfaces for web and mobile applications. Creating prototypes, working with clients, preparing UI kits.",
    "skills.title": "Skills",
    "contacts.title": "Contacts",
    "contacts.subtitle": "Get in touch to discuss your project",
    "footer.rights": "All rights reserved",
    "blog.title": "Blog — Aleksey Achkasov",
    "blog.header": "Blog",
    "blog.subtitle": "Articles about development, Python, Django, and technologies",
    "blog.categories.django": "Django",
    "blog.categories.api": "API",
    "blog.categories.devops": "DevOps",
    "blog.readMore": "Read",
    "blog.article1.title": "Django ORM Query Optimization",
    "blog.article1.preview":
      "Exploring the main ways to optimize database work in Django: select_related, prefetch_related, annotations, and aggregations. Practical examples and performance measurements.",
    "blog.article2.title": "JWT Authentication in Django REST Framework",
    "blog.article2.preview":
      "Step-by-step guide to implementing JWT tokens in your API. Setup, security, refresh tokens, and best practices for authentication.",
    "blog.article3.title": "Docker for Python Projects",
    "blog.article3.preview":
      "How to properly containerize a Django application. Creating Dockerfile, docker-compose, working with volumes and environment variables.",
    "article.back": "← Back to Blog",
    "article.formTitle": "Leave a Comment",
    "form.name": "Name",
    "form.email": "Email",
    "form.message": "Message",
    "form.submit": "Send",
    "article1.title": "Django ORM Query Optimization",
    "article1.intro":
      "Django ORM is a powerful tool for working with databases, but improper use can lead to performance issues. In this article, we'll explore the main methods for query optimization.",
    "article1.section1.title": "The N+1 Query Problem",
    "article1.section1.p1":
      "One of the most common problems is N+1 queries. It occurs when you query a list of objects and then execute an additional query for related data for each object.",
    "article1.section1.p2":
      "For example, if you have a Post model with a foreign key to Author, and you make such a query in the template:",
    "article1.section2.title": "Solution: select_related",
    "article1.section2.p1":
      "For ForeignKey and OneToOne relationships, use select_related. This method performs an SQL JOIN and loads all data in one query.",
    "article1.section2.p2": "As a result, instead of N+1 queries, only one query with JOIN will be executed.",
    "article1.section3.title": "prefetch_related for ManyToMany",
    "article1.section3.p1":
      "For ManyToMany relationships and reverse ForeignKey, use prefetch_related. It executes a separate query for related objects and combines them in Python.",
    "article1.section4.title": "Annotations and Aggregations",
    "article1.section4.p1":
      "Use annotate() and aggregate() for calculations at the database level instead of loading all data into Python.",
    "article1.section4.p2": "This is much faster than loading all posts and counting comments in Python.",
    "article1.conclusion.title": "Conclusion",
    "article1.conclusion.p1":
      "Proper query optimization is critical for Django application performance. Use Django Debug Toolbar to track queries and apply the described methods where necessary.",
    "article2.title": "JWT Authentication in Django REST Framework",
    "article2.intro":
      "JWT (JSON Web Token) is a standard for creating access tokens that is ideal for REST APIs. In this article, we'll look at how to properly implement JWT in Django REST Framework.",
    "article2.section1.title": "What is JWT?",
    "article2.section1.p1":
      "JWT is a compact token consisting of three parts: header, payload, and signature. It allows secure information exchange between client and server.",
    "article2.section1.p2":
      "The main advantage of JWT is that the token contains all the necessary information about the user, and the server can verify its authenticity without accessing the database.",
    "article2.section2.title": "Installation and Setup",
    "article2.section2.p1":
      "To work with JWT in Django REST Framework, use the djangorestframework-simplejwt library. Install it via pip and add it to your project settings.",
    "article2.section2.p2": "After that, create endpoints for obtaining and refreshing tokens.",
    "article2.section3.title": "Access and Refresh Tokens",
    "article2.section3.p1":
      "JWT uses two types of tokens: access token (short-lived) and refresh token (long-lived). The access token is used to authorize requests, and the refresh token is used to obtain a new access token.",
    "article2.section3.p2":
      "This increases security: if an access token is compromised, it will stop working after a short time.",
    "article2.section4.title": "Protecting Endpoints",
    "article2.section4.p1":
      "To protect API endpoints, use permission classes from DRF. For JWT, just add IsAuthenticated.",
    "article2.section4.p2": "The client must send the access token in the Authorization: Bearer {token} header.",
    "article2.conclusion.title": "Best Practices",
    "article2.conclusion.p1":
      "Store the refresh token in httpOnly cookies to protect against XSS attacks. Set a short lifetime for the access token (5-15 minutes). Use HTTPS for all requests. Implement a token revoke mechanism for emergencies.",
    "article3.title": "Docker for Python Projects",
    "article3.intro":
      "Docker simplifies deployment and scaling of applications. In this article, we'll look at how to properly containerize a Django project and set up an environment for development and production.",
    "article3.section1.title": "Why Docker?",
    "article3.section1.p1":
      "Docker solves the 'works on my machine' problem. A container contains everything you need: code, dependencies, system libraries. This ensures that the application will work the same way on any machine.",
    "article3.section1.p2":
      "Additionally, Docker simplifies environment setup for new developers and facilitates server deployment.",
    "article3.section2.title": "Creating a Dockerfile",
    "article3.section2.p1":
      "A Dockerfile is an instruction for building an image. For a Django application, create a multi-stage Dockerfile with layer optimization.",
    "article3.section2.p2":
      "Use the official Python image, install dependencies, copy code, and specify the startup command.",
    "article3.section3.title": "Docker Compose",
    "article3.section3.p1":
      "Docker Compose allows you to describe a multi-container application in one file. For Django, you usually need containers for the application, database, and possibly Redis.",
    "article3.section3.p2":
      "Create a docker-compose.yml with web, db, and redis services. Use volumes for data persistence.",
    "article3.section4.title": "Environment Variables",
    "article3.section4.p1":
      "Never store secrets in Dockerfile or code. Use environment variables for configuration. Create a .env file for local development.",
    "article3.section4.p2": "Docker Compose will automatically pick up the .env file and pass variables to containers.",
    "article3.conclusion.title": "Production",
    "article3.conclusion.p1":
      "For production, use a separate Dockerfile with optimizations: multi-stage build, minimal base image (alpine), installing only production dependencies. Use Nginx as a reverse proxy.",
  },
}

// Get saved language or default to Russian
let currentLang = localStorage.getItem("lang") || "ru"

// Function to update page text
function updateLanguage(lang) {
  currentLang = lang
  localStorage.setItem("lang", lang)

  // Update all elements with data-translate attribute
  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate")
    if (translations[lang][key]) {
      element.textContent = translations[lang][key]
    }
  })

  // Update document title
  if (document.querySelector("title[data-translate]")) {
    const titleKey = document.querySelector("title").getAttribute("data-translate")
    if (translations[lang][titleKey]) {
      document.title = translations[lang][titleKey]
    }
  }

  // Update active language button
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active")
    }
  })

  // Update HTML lang attribute
  document.documentElement.lang = lang
}

// Initialize language on page load
document.addEventListener("DOMContentLoaded", () => {
  updateLanguage(currentLang)

  // Language switcher event listeners
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang")
      updateLanguage(lang)
    })
  })

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
      })
    })
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href !== "#" && href !== "") {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }
    })
  })

  // Form validation
  const forms = document.querySelectorAll(".contact-form")
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const email = this.querySelector('input[type="email"]')
      const name = this.querySelector('input[name="name"]')
      const message = this.querySelector("textarea")

      if (!email.value || !name.value || !message.value) {
        e.preventDefault()
        alert(currentLang === "ru" ? "Пожалуйста, заполните все поля" : "Please fill in all fields")
        return false
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.value)) {
        e.preventDefault()
        alert(currentLang === "ru" ? "Пожалуйста, введите корректный email" : "Please enter a valid email")
        return false
      }
    })
  })
})
