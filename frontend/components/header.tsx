"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [lang, setLang] = useState<"ru" | "en">("ru")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "ru" | "en"
    if (savedLang) setLang(savedLang)
  }, [])

  const switchLang = (newLang: "ru" | "en") => {
    setLang(newLang)
    localStorage.setItem("lang", newLang)
    window.location.reload()
  }

  const nav = {
    ru: {
      about: "О себе",
      services: "Услуги",
      projects: "Проекты",
      experience: "Опыт",
      skills: "Навыки",
      blog: "Блог",
      contact: "Контакты",
      admin: "Админка",
    },
    en: {
      about: "About",
      services: "Services",
      projects: "Projects",
      experience: "Experience",
      skills: "Skills",
      blog: "Blog",
      contact: "Contact",
      admin: "Admin",
    },
  }

  const t = nav[lang]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          AA
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <button
            onClick={() => scrollToSection("about")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.about}
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.services}
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.projects}
          </button>
          <button
            onClick={() => scrollToSection("experience")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.experience}
          </button>
          <button
            onClick={() => scrollToSection("skills")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.skills}
          </button>
          <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {t.blog}
          </Link>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.contact}
          </button>
          <Link href="/admin" className="text-sm text-primary transition-colors hover:text-primary/80">
            {t.admin}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 p-1">
            <button
              onClick={() => switchLang("ru")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                lang === "ru" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              RU
            </button>
            <button
              onClick={() => switchLang("en")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-lg md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-6 py-6">
            <button onClick={() => scrollToSection("about")} className="text-left text-sm text-muted-foreground">
              {t.about}
            </button>
            <button onClick={() => scrollToSection("services")} className="text-left text-sm text-muted-foreground">
              {t.services}
            </button>
            <button onClick={() => scrollToSection("projects")} className="text-left text-sm text-muted-foreground">
              {t.projects}
            </button>
            <button onClick={() => scrollToSection("experience")} className="text-left text-sm text-muted-foreground">
              {t.experience}
            </button>
            <button onClick={() => scrollToSection("skills")} className="text-left text-sm text-muted-foreground">
              {t.skills}
            </button>
            <Link href="/blog" className="text-left text-sm text-muted-foreground">
              {t.blog}
            </Link>
            <button onClick={() => scrollToSection("contact")} className="text-left text-sm text-muted-foreground">
              {t.contact}
            </button>
            <Link href="/admin" className="text-left text-sm text-primary">
              {t.admin}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
