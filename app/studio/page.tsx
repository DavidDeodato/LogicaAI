"use client"

import { StudioHeader } from "@/components/studio/StudioHeader"
import { ChatPanel } from "@/components/studio/ChatPanel"
import { Canvas } from "@/components/studio/Canvas"
import { Inspector } from "@/components/studio/Inspector"
import { Toolbar } from "@/components/studio/Toolbar"
import { useStudioStore } from "@/lib/studio/store"
import { useEffect, useRef, useState } from "react"

export default function StudioPage() {
  const hydrate = useStudioStore((s) => s.hydrateFromLocalStorage)
  const [chatWidth, setChatWidth] = useState<number>(384) // 96 * 4
  const dragging = useRef(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragging.current) return
      const next = Math.min(640, Math.max(280, e.clientX))
      setChatWidth(next)
    }
    function onUp() {
      dragging.current = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <StudioHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside style={{ width: chatWidth }} className="shrink-0 border-r border-border overflow-hidden p-3 bg-card/30 flex flex-col gap-4">
          <Toolbar />
          <div className="min-h-0 flex-1 overflow-hidden pr-1">
            <ChatPanel />
          </div>
        </aside>
        <div
          onMouseDown={() => {
            dragging.current = true
            document.body.style.cursor = "col-resize"
            document.body.style.userSelect = "none"
          }}
          className="w-1 cursor-col-resize bg-border hover:bg-primary/50 transition-colors"
          aria-label="Redimensionar painel do chat"
          role="separator"
          aria-orientation="vertical"
        />
        <main className="flex-1 overflow-auto bg-background">
          <Canvas />
        </main>
        <aside className="w-80 shrink-0 border-l border-border overflow-auto p-3 bg-card/30">
          <Inspector />
        </aside>
      </div>
    </div>
  )
}
