"use client"

import { useState } from "react"
import { toPng } from "html-to-image"
import { useStudioStore } from "@/lib/studio/store"
import { applyActions } from "@/lib/studio/actions"

export function ChatPanel() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const state = useStudioStore((s) => s.state)
  const chat = useStudioStore((s) => s.chat)
  const addChat = useStudioStore((s) => s.addChat)
  const [visionOn, setVisionOn] = useState(false)
  const [openVisionIdx, setOpenVisionIdx] = useState<number | null>(null)

  async function onSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const msg = input
    addChat("user", msg, { usedVision: visionOn })
    setInput("")
    setLoading(true)
    try {
      let imagePayload: any = undefined
      if (visionOn) {
        const node = document.getElementById("studio-canvas-root")
        if (node) {
          const dataUrl = await toPng(node, { pixelRatio: 1 })
          imagePayload = { data: dataUrl.split(",")[1], mime: "image/png" }
        }
      }
      const res = await fetch("/api/studio/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, projectState: state, image: imagePayload }),
      })
      const data = await res.json()
      if (!res.ok) {
        addChat("assistant", `Erro: ${data.error || "falha"}`)
        return
      }
      if (data.ask) {
        addChat("assistant", data.ask)
        return
      }
      const result = applyActions(data.actions)
      const summary = data.summary || `Apliquei ${result.applied} ações.`
      addChat("assistant", summary, { usedVision: !!imagePayload, visionDescription: data.visionDescription })
    } catch (err: any) {
      addChat("assistant", `Erro: ${String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="min-h-0 flex-1 overflow-auto space-y-2 text-sm pb-2">
        {chat.map((m, i) => (
          <div key={i} className={m.role === "assistant" ? "text-muted-foreground" : "text-foreground"}>
            <span className="font-medium mr-1">{m.role === "assistant" ? "IA:" : "Você:"}</span>
            {m.content}
            {m.meta?.usedVision && (
              <button
                className="ml-2 inline-flex items-center px-2 py-0.5 text-xs rounded border border-border hover:bg-card"
                onClick={() => setOpenVisionIdx(openVisionIdx === i ? null : i)}
                title="Ver descrição visual"
              >
                Visão
              </button>
            )}
            {openVisionIdx === i && m.meta?.visionDescription && (
              <div className="mt-2 p-2 rounded border border-border bg-card whitespace-pre-wrap text-foreground/90">
                {m.meta.visionDescription}
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={onSend} className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setVisionOn((v) => !v)}
          className={`shrink-0 px-2 py-2 rounded-md border text-xs ${visionOn ? "bg-primary text-primary-foreground border-transparent" : "border-border hover:bg-card"}`}
          title="Ativar/desativar visão"
        >
          {visionOn ? "Visão ON" : "Visão OFF"}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2"
          placeholder="Descreva mudanças (ex.: criar página de login)"
        />
        <button disabled={loading} className="shrink-0 px-3 py-2 rounded-md bg-primary text-primary-foreground">
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  )
}
