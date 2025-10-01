"use client"

import { Rnd } from "react-rnd"
import { useStudioStore } from "@/lib/studio/store"
import { snap } from "@/lib/studio/utils"

export function Canvas() {
  const page = useStudioStore((s) => s.getCurrentPage())
  const select = useStudioStore((s) => s.selectElement)
  const update = useStudioStore((s) => s.updateElement)
  const addElement = useStudioStore((s) => s.addElement)

  if (!page)
    return (
      <div className="h-full grid place-items-center text-muted-foreground">
        Nenhuma página. <button className="ml-2 underline" onClick={() => addElement("text")}>Criar elemento exemplo</button>
      </div>
    )

  return (
    <div className="relative min-h-[calc(100vh-140px)] p-6">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage:
          "linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)",
        backgroundSize: "8px 8px",
      }} />

      {page.elements.map((el) => (
        <Rnd
          key={el.id}
          size={{ width: el.rect.w, height: el.rect.h }}
          position={{ x: el.rect.x, y: el.rect.y }}
          bounds="parent"
          onDragStop={(_, d) =>
            update(page.id, el.id, { rect: { ...el.rect, x: snap(d.x), y: snap(d.y) } })
          }
          onResizeStop={(_, __, ref, delta, pos) =>
            update(page.id, el.id, {
              rect: {
                x: snap(pos.x),
                y: snap(pos.y),
                w: snap(ref.offsetWidth),
                h: snap(ref.offsetHeight),
              },
            })
          }
          onClick={() => select(el.id)}
          className="border border-border bg-card/60 backdrop-blur-sm rounded-md shadow-sm"
        >
          <div className="w-full h-full grid place-items-center text-xs select-none px-2 text-center">
            {el.type === "text" ? el.text || "Texto" : el.type === "button" ? (el.text || "Botão") : el.type}
          </div>
        </Rnd>
      ))}
    </div>
  )
}
