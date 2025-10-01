"use client"

import { StudioHeader } from "@/components/studio/StudioHeader"
import { ChatPanel } from "@/components/studio/ChatPanel"
import { Canvas } from "@/components/studio/Canvas"
import { Inspector } from "@/components/studio/Inspector"
import { Toolbar } from "@/components/studio/Toolbar"
import { useStudioStore } from "@/lib/studio/store"
import { useEffect } from "react"

export default function StudioPage() {
  const hydrate = useStudioStore((s) => s.hydrateFromLocalStorage)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <div className="min-h-screen flex flex-col">
      <StudioHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 border-r border-border overflow-auto p-3 bg-card/30 space-y-4">
          <Toolbar />
          <ChatPanel />
        </aside>
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
