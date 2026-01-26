"use client"

import { useEffect, useRef } from "react"

interface CKEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function CKEditor({ value, onChange }: CKEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // CKEditor will be loaded here when integrated with Django backend
    // For now, using a simple textarea
  }, [])

  return (
    <div>
      <textarea
        ref={editorRef as any}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        placeholder="Содержимое статьи... (CKEditor будет интегрирован с Django)"
      />
      <p className="text-xs text-gray-500 mt-2">
        Примечание: CKEditor будет полностью функционален после интеграции с Django
      </p>
    </div>
  )
}
