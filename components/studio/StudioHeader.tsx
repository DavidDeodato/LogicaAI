"use client"

import { useState } from "react"
import { useStudioStore } from "@/lib/studio/store"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function StudioHeader() {
  const project = useStudioStore((s) => s.project)
  const setProjectName = useStudioStore((s) => s.setProjectName)
  const state = useStudioStore((s) => s.state)
  const chat = useStudioStore((s) => s.chat)
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function sendToTeam() {
    setSending(true)
    setMsg(null)
    try {
      const res = await fetch("/api/studio/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: state, chat }),
      })
      const data = await res.json()
      setMsg(res.ok ? data.message || "Enviado" : data.error || "Falha ao enviar")
    } catch (e: any) {
      setMsg(String(e))
    } finally {
      setSending(false)
    }
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <input
          value={project.name}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-transparent outline-none text-lg font-semibold"
          placeholder="Sem título"
        />
        <div className="ml-auto flex items-center gap-2 text-sm">
          <ThemeToggle />
          <button className="px-3 py-1.5 rounded-md border border-border hover:bg-card">Importar</button>
          <button className="px-3 py-1.5 rounded-md border border-border hover:bg-card">Exportar</button>
          <button onClick={sendToTeam} disabled={sending} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground rounded">
            {sending ? "Enviando..." : "Enviar para equipe"}
          </button>
        </div>
        {msg && <div className="ml-4 text-xs text-muted-foreground">{msg}</div>}
      </div>
    </header>
  )
}
