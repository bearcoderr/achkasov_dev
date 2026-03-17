"use client"

import { useEffect, useRef } from "react"

interface CKEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function CKEditor({ value, onChange }: CKEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Plain textarea editor (no external dependency)
  }, [])

  return (
    <div>
      <textarea
        ref={editorRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        placeholder="Article content..."
      />
    </div>
  )
}
