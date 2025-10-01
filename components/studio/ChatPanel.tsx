"use client"

import { useState } from "react"
import { useStudioStore } from "@/lib/studio/store"
import { applyActions } from "@/lib/studio/actions"

export function ChatPanel() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const state = useStudioStore((s) => s.state)
  const chat = useStudioStore((s) => s.chat)
  const addChat = useStudioStore((s) => s.addChat)

  async function onSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const msg = input
    addChat("user", msg)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/studio/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, projectState: state }),
      })
      const data = await res.json()
      if (!res.ok) {
        addChat("assistant", `Erro: ${data.error || "falha"}`)
        return
      }
      const result = applyActions(data.actions)
      const summary = data.summary || `Apliquei ${result.applied} ações.`
      addChat("assistant", summary)
    } catch (err: any) {
      addChat("assistant", `Erro: ${String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-2 text-sm">
        {chat.map((m, i) => (
          <div key={i} className={m.role === "assistant" ? "text-muted-foreground" : "text-foreground"}>
            <span className="font-medium mr-1">{m.role === "assistant" ? "IA:" : "Você:"}</span>
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={onSend} className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2"
          placeholder="Descreva mudanças (ex.: criar página de login)"
        />
        <button disabled={loading} className="px-3 py-2 rounded-md bg-primary text-primary-foreground">
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  )
}
