import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import CookieBanner from "@/components/cookie-banner"
import FloatingContactForm from "@/components/floating-contact-form"
import Preloader from "@/components/preloader"
import HeadFix from "@/components/head-fix"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-mono" })

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = {}
  try {
    const res = await fetch(`${baseUrl}/api/site-settings`, { cache: "no-store" })
    if (res.ok) settings = await res.json()
  } catch {
    settings = {}
  }

  const titleDefault = settings?.site_title || "Aleksey Achkasov — Backend Developer"
  const descriptionDefault =
    settings?.site_description ||
    "Backend developer specializing in Python, Django, and FastAPI. Portfolio and blog about web development."
  const noindex = Boolean(settings?.noindex)

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: titleDefault,
      template: `%s — ${titleDefault}`,
    },
    description: descriptionDefault,
    icons: {
      icon: [
        { url: settings?.favicon_light || "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
        { url: settings?.favicon_dark || "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      ],
      shortcut: settings?.favicon_svg || "/icon.svg",
      apple: settings?.apple_icon || "/apple-icon.png",
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      title: titleDefault,
      description: descriptionDefault,
      url: "/",
      siteName: titleDefault,
      locale: "ru_RU",
      images: settings?.og_default_image ? [settings.og_default_image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description: descriptionDefault,
      images: settings?.og_default_image ? [settings.og_default_image] : undefined,
    },
    generator: "v0.app",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.className} ${jetbrainsMono.variable} antialiased`}>
        <HeadFix />
        <Preloader />
        {children}
        <CookieBanner />
        <FloatingContactForm lang="ru" />
        <Analytics />
      </body>
    </html>
  )
}
