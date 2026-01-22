# Содержит ваши статические данные (имитация БД)

"""Статические данные портфолио (имитация БД)"""
from src.core.entities.page import (
    HeroData, AboutData, Service, Project, Experience,
    SkillCategory, Certificate, PersonalFact, ContactInfo
)
from src.core.entities.base import LocalizedField



# About Section
ABOUT_DATA = AboutData(
    title=LocalizedField(ru="О себе", en="About Me"),
    text=LocalizedField(
        ru="За 11 лет в IT я прошёл путь от UI/UX-дизайнера до backend-разработчика. Работаю с Python, Django, PostgreSQL и современными технологиями. Создаю масштабируемые решения для бизнеса.",
        en="With 11 years in IT, I evolved from UI/UX designer to backend developer. I work with Python, Django, PostgreSQL and modern technologies. Creating scalable business solutions."
    )
)

# Services
SERVICES = [
    Service(
        title=LocalizedField(ru="Разработка интернет-магазинов", en="E-commerce Development"),
        description=LocalizedField(
            ru="Полнофункциональные e-commerce решения на Django",
            en="Full-featured online stores on Django"
        ),
        details={
            "ru": [
                "Каталог товаров с фильтрацией и поиском",
                "Корзина и процесс оформления заказа",
                "Интеграция платежных систем (Stripe, PayPal, ЮKassa)",
                "Личный кабинет пользователя с историей заказов",
                "Административная панель для управления",
                "SEO-оптимизация и аналитика"
            ],
            "en": [
                "Product catalog with filtering and search",
                "Shopping cart and checkout process",
                "Payment gateway integration (Stripe, PayPal)",
                "User dashboard with order history",
                "Admin panel for management",
                "SEO optimization and analytics"
            ]
        }
    ),
    Service(
        title=LocalizedField(ru="API разработка", en="API Development"),
        description=LocalizedField(
            ru="RESTful API с Django REST Framework",
            en="RESTful APIs with Django REST Framework"
        ),
        details={
            "ru": [
                "Проектирование архитектуры API",
                "Разработка endpoints с полной документацией",
                "JWT аутентификация и авторизация",
                "Валидация данных и обработка ошибок",
                "Версионирование API",
                "Интеграция с мобильными приложениями"
            ],
            "en": [
                "API architecture design",
                "Endpoint development with full documentation",
                "JWT authentication and authorization",
                "Data validation and error handling",
                "API versioning",
                "Mobile app integration"
            ]
        }
    ),
    Service(
        title=LocalizedField(ru="Интеграции", en="Integrations"),
        description=LocalizedField(
            ru="Подключение внешних сервисов и CRM",
            en="External services and CRM connection"
        ),
        details={
            "ru": [
                "Интеграция с платежными системами",
                "Подключение CRM (Bitrix24, amoCRM)",
                "API сторонних сервисов",
                "Синхронизация данных между системами",
                "Настройка webhooks и уведомлений",
                "Автоматизация бизнес-процессов"
            ],
            "en": [
                "Payment system integration",
                "CRM connection (Bitrix24, amoCRM)",
                "Third-party service APIs",
                "Data synchronization between systems",
                "Webhook and notification setup",
                "Business process automation"
            ]
        }
    )
]

# Projects
PROJECTS = [
    Project(
        title=LocalizedField(ru="E-commerce платформа", en="E-commerce Platform"),
        description=LocalizedField(
            ru="Интернет-магазин с каталогом, корзиной, оплатой и CRM",
            en="Online store with catalog, cart, payments and CRM"
        ),
        tech=["Django", "PostgreSQL", "Redis", "Celery"],
        demo_url="https://example.com",
        github_url="https://github.com/example"
    ),
    Project(
        title=LocalizedField(ru="API для мобильного приложения", en="Mobile App API"),
        description=LocalizedField(
            ru="RESTful API с аутентификацией и real-time уведомлениями",
            en="RESTful API with authentication and real-time notifications"
        ),
        tech=["Django REST", "JWT", "WebSocket"]
    ),
    Project(
        title=LocalizedField(ru="Система управления контентом", en="Content Management System"),
        description=LocalizedField(
            ru="CMS для корпоративного сайта с многоязычностью",
            en="CMS for corporate website with multilingual support"
        ),
        tech=["Django", "Docker", "nginx"]
    )
]

# Experience
EXPERIENCE = [
    Experience(
        period=LocalizedField(ru="2020 — настоящее время", en="2020 — Present"),
        position=LocalizedField(ru="Фриланс Backend-разработчик", en="Freelance Backend Developer"),
        company="Самозанятость",
        description=LocalizedField(
            ru="Разработка веб-приложений на Django для различных клиентов",
            en="Django web application development for various clients"
        )
    ),
    Experience(
        period=LocalizedField(ru="2017 — 2020", en="2017 — 2020"),
        position=LocalizedField(ru="Backend-разработчик", en="Backend Developer"),
        company="Tech Company",
        description=LocalizedField(
            ru="Разработка и поддержка корпоративных систем",
            en="Development and support of corporate systems"
        )
    )
]

# Skills
SKILLS = [
    SkillCategory(
        name=LocalizedField(ru="Backend", en="Backend"),
        items=["Python", "Django", "Django REST", "FastAPI", "Celery"]
    ),
    SkillCategory(
        name=LocalizedField(ru="Базы данных", en="Databases"),
        items=["PostgreSQL", "Redis", "MongoDB"]
    ),
    SkillCategory(
        name=LocalizedField(ru="DevOps", en="DevOps"),
        items=["Docker", "nginx", "Linux", "Git"]
    ),
    SkillCategory(
        name=LocalizedField(ru="Frontend", en="Frontend"),
        items=["JavaScript", "React", "HTML/CSS"]
    )
]

# Certificates
CERTIFICATES = [
    Certificate(
        title=LocalizedField(ru="Python для профессионалов", en="Python for Professionals"),
        provider="Stepik, 2023",
        description=LocalizedField(
            ru="Углубленное изучение Python: декораторы, генераторы, метаклассы, асинхронное программирование",
            en="Advanced Python: decorators, generators, metaclasses, asynchronous programming"
        ),
        image_url="/python-certificate.png",
        issue_date="2023-06-15"
    ),
    Certificate(
        title=LocalizedField(ru="Django Web Framework", en="Django Web Framework"),
        provider="Coursera, 2022",
        description=LocalizedField(
            ru="Разработка веб-приложений с Django: ORM, REST API, аутентификация, развертывание",
            en="Web development with Django: ORM, REST API, authentication, deployment"
        ),
        image_url="/django-certificate.jpg",
        issue_date="2022-09-20"
    )
]

# Personal Facts
PERSONAL_FACTS = [
    PersonalFact(
        emoji="✈️",
        title=LocalizedField(ru="Люблю путешествовать", en="Love to travel"),
        description=LocalizedField(
            ru="Посетил более 15 стран, люблю открывать новые культуры и кухни",
            en="Visited over 15 countries, enjoy discovering new cultures and cuisines"
        )
    ),
    PersonalFact(
        emoji="🍵",
        title=LocalizedField(ru="Ценитель китайского чая", en="Chinese tea enthusiast"),
        description=LocalizedField(
            ru="Изучаю чайную церемонию, коллекционирую редкие сорта пуэра",
            en="Study tea ceremony, collect rare pu-erh varieties"
        )
    )
]

# Contact Info
CONTACT_INFO = ContactInfo(
    email="aleksey@example.com",
    phone="+7 (999) 123-45-67",
    location=LocalizedField(ru="Москва, Россия", en="Moscow, Russia"),
    telegram="https://t.me/yourusername",
    github="https://github.com/yourusername",
    linkedin="https://linkedin.com/in/yourusername"
)