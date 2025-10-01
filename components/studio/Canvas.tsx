"use client"

import { Rnd } from "react-rnd"
import { useState } from "react"
import { useStudioStore } from "@/lib/studio/store"
import { snap } from "@/lib/studio/utils"

export function Canvas() {
  const page = useStudioStore((s) => s.getCurrentPage())
  const select = useStudioStore((s) => s.selectElement)
  const update = useStudioStore((s) => s.updateElement)
  const addElement = useStudioStore((s) => s.addElement)
  const [editingId, setEditingId] = useState<string | null>(null)

  if (!page)
    return (
      <div className="h-full grid place-items-center text-muted-foreground">
        Nenhuma página. <button className="ml-2 underline" onClick={() => addElement("text")}>Criar elemento exemplo</button>
      </div>
    )

  return (
    <div id="studio-canvas-root" className="relative min-h-[calc(100vh-140px)] p-6">
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
          enableResizing={editingId === el.id ? false : undefined}
          disableDragging={editingId === el.id}
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
          className={
            el.type === "text"
              ? editingId === el.id
                ? "border-2 border-dashed border-primary/70"
                : ""
              : "backdrop-blur-sm shadow-sm"
          }
        >
          {(() => {
            const st = el.style || {}
            const containerStyle: React.CSSProperties = {
              backgroundColor: st.backgroundColor ?? (el.type === "text" ? "transparent" : undefined),
              borderColor: st.borderColor,
              borderWidth: st.borderWidth,
              borderStyle: st.borderWidth ? "solid" : undefined,
              borderRadius: st.borderRadius,
              opacity: st.opacity,
              zIndex: st.zIndex,
              color: st.textColor,
              fontFamily: st.fontFamily,
              fontSize: st.fontSize,
              fontWeight: st.fontWeight as any,
            }
            if (el.type === "text") {
              const isEditing = editingId === el.id
              return (
                <div
                  style={{ ...containerStyle, direction: "ltr", textTransform: "none" }}
                  className="w-full h-full flex items-start justify-start px-1 py-0.5"
                  onDoubleClick={() => setEditingId(el.id)}
                >
                  <div
                    contentEditable={isEditing}
                    dir="ltr"
                    suppressContentEditableWarning
                    spellCheck={false}
                    style={{
                      outline: "none",
                      whiteSpace: "pre-wrap",
                      width: "100%",
                      height: "100%",
                      cursor: isEditing ? "text" : "move",
                      background: "transparent",
                      direction: "ltr",
                      unicodeBidi: "plaintext",
                      textAlign: "left",
                      textTransform: "none",
                    }}
                    onInput={(e) => {
                      const div = e.currentTarget as HTMLDivElement
                      const newHeight = Math.max(20, Math.ceil(div.scrollHeight))
                      update(page.id, el.id, { rect: { h: newHeight } as any })
                    }}
                    onBlur={(e) => {
                      const div = e.currentTarget as HTMLDivElement
                      const text = div.innerText || ""
                      const newHeight = Math.max(20, Math.ceil(div.scrollHeight))
                      update(page.id, el.id, { text, rect: { h: newHeight } as any })
                      setEditingId(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.currentTarget.blur()
                      }
                    }}
                  >
                    {el.text || "Texto"}
                  </div>
                </div>
              )
            }
            return (
              <div style={containerStyle} className="w-full h-full grid place-items-center text-xs select-none px-2 text-center">
                {el.type === "button" ? (el.text || "Botão") : el.type}
              </div>
            )
          })()}
        </Rnd>
      ))}
    </div>
  )
}
