"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const current = (theme || resolvedTheme || "dark") as string
  const isDark = current === "dark"
  if (!mounted) return null
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="px-3 py-1.5 rounded-md border border-border hover:bg-card text-sm"
      title={isDark ? "Modo claro" : "Modo escuro"}
    >
      {isDark ? "Claro" : "Escuro"}
    </button>
  )
}
