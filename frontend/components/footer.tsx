"use client"

import Link from "next/link"
import { Github, Linkedin } from "lucide-react"

interface FooterProps {
  lang: "ru" | "en"
  data: {
    rights: string
    privacy: string
    social_links: {
      github?: string
      linkedin?: string
      telegram?: string
    }
  }
}

export default function Footer({ lang, data }: FooterProps) {
  return (
    <footer className="border-t border-border/40 bg-card/30 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Социальные сети */}
          <div className="flex items-center gap-6">
            {data.social_links.github && (
              <a
                href={data.social_links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            )}
            {data.social_links.linkedin && (
              <a
                href={data.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            )}
            {data.social_links.telegram && (
              <a
                href={data.social_links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Telegram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            )}
          </div>

          {/* Копирайт и ссылки */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              {data.privacy}
            </Link>
            <span>© 2025 Aleksey Achkasov. {data.rights}.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}