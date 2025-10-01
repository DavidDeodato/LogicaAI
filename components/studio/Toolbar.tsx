"use client"

import { useStudioStore } from "@/lib/studio/store"

export function Toolbar() {
  const pages = useStudioStore((s) => s.state.pages)
  const current = useStudioStore((s) => s.getCurrentPage())
  const addPage = useStudioStore((s) => s.addPage)
  const selectPage = useStudioStore((s) => s.selectPage)
  const addElement = useStudioStore((s) => s.addElement)

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs uppercase text-muted-foreground mb-1">Páginas</div>
        <div className="flex flex-wrap gap-2">
          {pages.map((p) => (
            <button
              key={p.id}
              className={`px-2 py-1 rounded-md border text-xs ${current?.id === p.id ? "bg-primary text-primary-foreground border-transparent" : "border-border hover:bg-card"}`}
              onClick={() => selectPage(p.id)}
            >
              {p.name}
            </button>
          ))}
          <button className="px-2 py-1 rounded-md border border-dashed border-border text-xs hover:bg-card" onClick={() => addPage()}>+ Nova</button>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase text-muted-foreground mb-1">Blocos</div>
        <div className="grid grid-cols-3 gap-2">
          <button className="px-2 py-1 rounded-md border border-border text-xs hover:bg-card" onClick={() => addElement("text")}>Texto</button>
          <button className="px-2 py-1 rounded-md border border-border text-xs hover:bg-card" onClick={() => addElement("button")}>Botão</button>
          <button className="px-2 py-1 rounded-md border border-border text-xs hover:bg-card" onClick={() => addElement("input")}>Input</button>
          <button className="px-2 py-1 rounded-md border border-border text-xs hover:bg-card" onClick={() => addElement("box")}>Caixa</button>
          <button className="px-2 py-1 rounded-md border border-border text-xs hover:bg-card" onClick={() => addElement("image")}>Imagem</button>
          <button className="px-2 py-1 rounded-md border border-border text-xs hover:bg-card" onClick={() => addElement("shape", { kind: "rect" })}>Retângulo</button>
          <button className="px-2 py-1 rounded-md border border-border text-xs hover:bg-card" onClick={() => addElement("shape", { kind: "ellipse" })}>Elipse</button>
          <button className="px-2 py-1 rounded-md border border-border text-xs hover:bg-card" onClick={() => addElement("shape", { kind: "line" })}>Linha</button>
          <button className="px-2 py-1 rounded-md border border-border text-xs hover:bg-card" onClick={() => addElement("shape", { kind: "arrow" })}>Seta</button>
        </div>
      </div>
    </div>
  )
}
