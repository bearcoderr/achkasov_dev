import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import CookieBanner from "@/components/cookie-banner"
import FloatingContactForm from "@/components/floating-contact-form"
import Preloader from "@/components/preloader"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Aleksey Achkasov - Backend Developer",
  description: "Backend developer specializing in Python and Django. Portfolio and blog about web development.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.className} ${jetbrainsMono.variable} antialiased`}>
        <Preloader />
        {children}
        <CookieBanner />
        <FloatingContactForm lang="ru" />
        <Analytics />
      </body>
    </html>
  )
}
