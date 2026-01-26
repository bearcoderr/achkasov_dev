"use client"

import { useEffect, useState } from "react"

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsVisible(false), 300)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`glass-preloader fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        progress >= 100 ? "pointer-events-none opacity-0" : ""
      }`}
    >
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="mb-8 text-7xl font-bold text-primary">{Math.floor(progress)}%</div>
        <div className="h-1 w-64 overflow-hidden rounded-full bg-muted/30">
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
