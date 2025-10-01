"use client"

import { useStudioStore } from "@/lib/studio/store"

export function Inspector() {
  const currentPage = useStudioStore((s) => s.getCurrentPage())
  const selectedId = useStudioStore((s) => s.selection.elementId)
  const element = currentPage?.elements.find((e) => e.id === selectedId)
  const renamePage = useStudioStore((s) => s.renamePage)
  const updateElement = useStudioStore((s) => s.updateElement)

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
        </div>
      ) : (
        <div className="text-muted-foreground">Selecione um elemento no canvas.</div>
      )}
    </div>
  )
}
