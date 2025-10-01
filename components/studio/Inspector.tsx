"use client"

import { useStudioStore } from "@/lib/studio/store"
import type { Element } from "@/lib/studio/types"

export function Inspector() {
  const currentPage = useStudioStore((s) => s.getCurrentPage())
  const selectedId = useStudioStore((s) => s.selection.elementId)
  const element = currentPage?.elements.find((e) => e.id === selectedId)
  const renamePage = useStudioStore((s) => s.renamePage)
  const updateElement = useStudioStore((s) => s.updateElement)
  const deleteElement = useStudioStore((s) => s.deleteElement)
  const bringForward = useStudioStore((s) => s.bringForward)
  const sendBackward = useStudioStore((s) => s.sendBackward)

  if (!currentPage) return <div className="text-sm text-muted-foreground">Crie uma página para começar.</div>

  return (
    <div className="space-y-4 text-sm">
      <div>
        <div className="font-semibold mb-1">Página</div>
        <input
          value={currentPage.name}
          onChange={(e) => renamePage(currentPage.id, e.target.value)}
          className="w-full rounded-md border border-border bg-background px-2 py-1"
        />
      </div>

      {element ? (
        <div className="space-y-2">
          <div className="font-semibold">Elemento: {element.type}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteElement(currentPage.id, element.id)}
              className="px-2 py-1 rounded-md border border-destructive text-destructive hover:bg-destructive/10 text-xs"
            >
              Excluir elemento
            </button>
            {(() => {
              const idx = currentPage.elements.findIndex((e) => e.id === element.id)
              const atBottom = idx <= 0
              const atTop = idx >= currentPage.elements.length - 1
              return (
                <div className="flex items-center gap-1">
                  <button
                    disabled={atTop}
                    onClick={() => bringForward(currentPage.id, element.id)}
                    className={`px-2 py-1 rounded-md border text-xs ${atTop ? "opacity-50 cursor-not-allowed" : "hover:bg-card"}`}
                    title="Subir uma camada"
                  >
                    ↑ Subir
                  </button>
                  <button
                    disabled={atBottom}
                    onClick={() => sendBackward(currentPage.id, element.id)}
                    className={`px-2 py-1 rounded-md border text-xs ${atBottom ? "opacity-50 cursor-not-allowed" : "hover:bg-card"}`}
                    title="Descer uma camada"
                  >
                    ↓ Descer
                  </button>
                </div>
              )
            })()}
          </div>
          {"text" in element && (
            <div>
              <label className="block mb-1">Texto</label>
              <input
                value={element.text ?? ""}
                onChange={(e) => updateElement(currentPage.id, element.id, { text: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-2 py-1"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {(["x", "y", "w", "h"] as const).map((k) => (
              <div key={k}>
                <label className="block mb-1 uppercase text-xs">{k}</label>
                <input
                  type="number"
                  value={element.rect[k]}
                  onChange={(e) =>
                    updateElement(currentPage.id, element.id, {
                      rect: { ...element.rect, [k]: Number(e.target.value) },
                    })
                  }
                  className="w-full rounded-md border border-border bg-background px-2 py-1"
                />
              </div>
            ))}
          </div>

          {/* Estilo */}
          {renderStyleSection(element)}
        </div>
      ) : (
        <div className="text-muted-foreground">Selecione um elemento no canvas.</div>
      )}
    </div>
  )

  function renderStyleSection(el: Element) {
    const st = el.style || {}
    const palette = ["#111111", "#1f2937", "#374151", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#ffffff"]
    const setStyle = (patch: Partial<Element["style"]>) =>
      updateElement(currentPage!.id, el.id, { style: { ...st, ...patch } })

    return (
      <div className="space-y-2">
        <div className="font-semibold mt-2">Estilo</div>
        <div className="grid grid-cols-2 gap-2 items-end">
          <div>
            <label className="block mb-1">Cor de fundo</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={st.backgroundColor || "#111111"}
                onChange={(e) => setStyle({ backgroundColor: e.target.value })}
              />
              <div className="flex gap-1">
                {palette.map((c) => (
                  <button
                    key={c}
                    className="w-5 h-5 rounded border"
                    style={{ backgroundColor: c }}
                    title={c}
                    onClick={() => setStyle({ backgroundColor: c })}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block mb-1">Cor do texto</label>
            <input
              type="color"
              value={st.textColor || "#f5f5f5"}
              onChange={(e) => setStyle({ textColor: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1">Borda (px)</label>
            <input
              type="number"
              min={0}
              value={st.borderWidth ?? 1}
              onChange={(e) => setStyle({ borderWidth: Number(e.target.value) })}
              className="w-full rounded-md border border-border bg-background px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1">Cor da borda</label>
            <input
              type="color"
              value={st.borderColor || "#2a2a2a"}
              onChange={(e) => setStyle({ borderColor: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1">Raio (px)</label>
            <input
              type="number"
              min={0}
              value={st.borderRadius ?? 8}
              onChange={(e) => setStyle({ borderRadius: Number(e.target.value) })}
              className="w-full rounded-md border border-border bg-background px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1">Opacidade</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={st.opacity ?? 1}
              onChange={(e) => setStyle({ opacity: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="font-semibold mt-3">Tipografia</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1">Fonte</label>
            <select
              value={st.fontFamily || "system-ui, -apple-system, Segoe UI, Arial, sans-serif"}
              onChange={(e) => setStyle({ fontFamily: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-2 py-1"
            >
              <option value="system-ui, -apple-system, Segoe UI, Arial, sans-serif">Sistema</option>
              <option value="Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif">Inter</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Courier New, monospace">Monospace</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Tamanho (px)</label>
            <input
              type="number"
              min={10}
              value={st.fontSize ?? 14}
              onChange={(e) => setStyle({ fontSize: Number(e.target.value) })}
              className="w-full rounded-md border border-border bg-background px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1">Peso</label>
            <select
              value={(st.fontWeight as any) ?? 500}
              onChange={(e) => setStyle({ fontWeight: Number(e.target.value) })}
              className="w-full rounded-md border border-border bg-background px-2 py-1"
            >
              {[300, 400, 500, 600, 700, 800].map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Z-index</label>
            <input
              type="number"
              value={st.zIndex ?? 1}
              onChange={(e) => setStyle({ zIndex: Number(e.target.value) })}
              className="w-full rounded-md border border-border bg-background px-2 py-1"
            />
          </div>
        </div>
      </div>
    )
  }
}
