"use client"

import { Rnd } from "react-rnd"
import { useRef, useState } from "react"
import { useStudioStore } from "@/lib/studio/store"
import { snap } from "@/lib/studio/utils"

export function Canvas() {
  const page = useStudioStore((s) => s.getCurrentPage())
  const select = useStudioStore((s) => s.selectElement)
  const update = useStudioStore((s) => s.updateElement)
  const selectedId = useStudioStore((s) => s.selection.elementId)
  const addElement = useStudioStore((s) => s.addElement)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [rotatingId, setRotatingId] = useState<string | null>(null)
  const elRefs = useRef<Record<string, HTMLDivElement | null>>({})

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
          onResize={(_, __, ref, ___, pos) =>
            update(page.id, el.id, {
              rect: {
                x: snap(pos.x),
                y: snap(pos.y),
                w: snap(ref.offsetWidth),
                h: snap(ref.offsetHeight),
              },
            })
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
              : (el.type === "shape" ? "" : "backdrop-blur-sm shadow-sm")
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
              transform: st.rotateDeg ? `rotate(${st.rotateDeg}deg)` : undefined,
              transformOrigin: "center",
            }
            if (el.type === "text") {
              const isEditing = editingId === el.id
              return (
                <div
                  style={{ ...containerStyle, direction: "ltr", textTransform: "none" }}
                  className="w-full h-full flex items-start justify-start px-1 py-0.5"
                  onDoubleClick={() => setEditingId(el.id)}
                  ref={(r) => (elRefs.current[el.id] = r)}
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
            if (el.type === "shape") {
              const kind = (el as any).props?.kind || "rect"
              if (kind === "rect" || kind === "ellipse") {
                return (
                  <div
                    style={{
                      ...containerStyle,
                      borderRadius: kind === "ellipse" ? 9999 : containerStyle.borderRadius,
                    }}
                    className="w-full h-full"
                    ref={(r) => (elRefs.current[el.id] = r)}
                  />
                )
              }
              const dashed = !!(el as any).props?.dashed
              const arrow = !!(el as any).props?.arrow || kind === "arrow"
              return (
                <svg width={el.rect.w} height={el.rect.h} className="pointer-events-none" style={{ transform: containerStyle.transform, transformOrigin: "center" }} ref={(r) => (elRefs.current[el.id] = r as any)}>
                  <defs>
                    <marker id={`arrow-${el.id}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L0,6 L9,3 z" fill={containerStyle.borderColor as any} />
                    </marker>
                  </defs>
                  <line
                    x1={0}
                    y1={el.rect.h / 2}
                    x2={el.rect.w}
                    y2={el.rect.h / 2}
                    stroke={containerStyle.borderColor as any}
                    strokeWidth={(containerStyle.borderWidth as number) || 2}
                    strokeDasharray={dashed ? "6 6" : undefined}
                    markerEnd={arrow ? `url(#arrow-${el.id})` : undefined}
                  />
                </svg>
              )
            }
            return (
              <div style={containerStyle} className="w-full h-full grid place-items-center text-xs select-none px-2 text-center" ref={(r) => (elRefs.current[el.id] = r)}>
                {el.type === "button" ? (el.text || "Botão") : el.type}
              </div>
            )
          })()}
          {selectedId === el.id && editingId !== el.id && (
            <div
              className="absolute left-0 right-0 -top-2 h-4 cursor-grab"
              onMouseDown={(e) => {
                e.stopPropagation()
                setRotatingId(el.id)
                const onMove = (ev: MouseEvent) => {
                  if (rotatingId !== el.id && rotatingId !== null) return
                  const ref = elRefs.current[el.id]
                  if (!ref) return
                  const rect = ref.getBoundingClientRect()
                  const cx = rect.left + rect.width / 2
                  const cy = rect.top + rect.height / 2
                  const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI)
                  update(page.id, el.id, { style: { ...(el.style || {}), rotateDeg: angle } as any })
                }
                const onUp = () => {
                  setRotatingId(null)
                  window.removeEventListener("mousemove", onMove)
                  window.removeEventListener("mouseup", onUp)
                }
                window.addEventListener("mousemove", onMove)
                window.addEventListener("mouseup", onUp)
              }}
              title="Arraste na borda para rotacionar"
            />
          )}
        </Rnd>
      ))}
    </div>
  )
}
