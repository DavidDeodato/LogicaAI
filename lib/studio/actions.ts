import { z } from "zod"
import { useStudioStore } from "./store"
import type { ProjectState } from "./types"

// Schemas
export const addPage = z.object({ type: z.literal("add_page"), payload: z.object({ name: z.string().min(1) }) })
export const selectPage = z.object({ type: z.literal("select_page"), payload: z.object({ pageId: z.string().min(1) }) })
export const renamePage = z.object({ type: z.literal("rename_page"), payload: z.object({ pageId: z.string(), name: z.string() }) })
export const deletePage = z.object({ type: z.literal("delete_page"), payload: z.object({ pageId: z.string() }) })
export const addBlock = z.object({
  type: z.literal("add_block"),
  payload: z.object({
    pageId: z.string().optional(),
    type: z.enum(["text", "button", "input", "box", "image"]),
    text: z.string().optional(),
    rect: z
      .object({ x: z.number().optional(), y: z.number().optional(), w: z.number().optional(), h: z.number().optional() })
      .optional(),
  }),
})
export const updateBlockText = z.object({
  type: z.literal("update_block_text"),
  payload: z.object({ pageId: z.string(), elementId: z.string(), text: z.string() }),
})
export const moveBlock = z.object({
  type: z.literal("move_block"),
  payload: z.object({ pageId: z.string(), elementId: z.string(), x: z.number(), y: z.number() }),
})
export const resizeBlock = z.object({
  type: z.literal("resize_block"),
  payload: z.object({ pageId: z.string(), elementId: z.string(), w: z.number(), h: z.number() }),
})
export const deleteBlock = z.object({ type: z.literal("delete_block"), payload: z.object({ pageId: z.string(), elementId: z.string() }) })
export const linkPages = z.object({ type: z.literal("link_pages"), payload: z.object({ fromPageId: z.string(), toPageId: z.string() }) })

export const ActionSchema = z.discriminatedUnion("type", [
  addPage,
  selectPage,
  renamePage,
  deletePage,
  addBlock,
  updateBlockText,
  moveBlock,
  resizeBlock,
  deleteBlock,
  linkPages,
])

export type Action = z.infer<typeof ActionSchema>

function slug(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, "-")
}

export function applyActions(actions: unknown): { applied: number; errors: string[] } {
  const arr = Array.isArray(actions) ? actions : []
  const store = useStudioStore.getState()
  let applied = 0
  const errors: string[] = []
  const alias = new Map<string, string>() // slug(name) -> pageId

  for (const raw of arr) {
    const parsed = ActionSchema.safeParse(raw)
    if (!parsed.success) {
      errors.push("invalid action payload")
      continue
    }
    const a = parsed.data
    try {
      switch (a.type) {
        case "add_page": {
          const before = store.state.pages.length
          store.addPage(a.payload.name)
          const afterList = store.state.pages
          const created = afterList[afterList.length - 1]
          alias.set(slug(a.payload.name), created.id)
          store.selectPage(created.id)
          break
        }
        case "select_page": {
          const pid = resolvePageId(a.payload.pageId)
          if (pid) store.selectPage(pid)
          break
        }
        case "rename_page": {
          const pid = resolvePageId(a.payload.pageId)
          if (pid) store.renamePage(pid, a.payload.name)
          break
        }
        case "delete_page": {
          // não implementado no MVP
          break
        }
        case "add_block": {
          const pid = resolvePageId(a.payload.pageId)
          if (pid) store.selectPage(pid)
          store.addElement(a.payload.type)
          const selectedId = store.selection.elementId
          if (pid && selectedId) {
            const patch: any = {}
            if (a.payload.text) patch.text = a.payload.text
            if (a.payload.rect) patch.rect = { ...a.payload.rect }
            if (Object.keys(patch).length) store.updateElement(pid, selectedId, patch)
          }
          break
        }
        case "update_block_text":
          store.updateElement(resolvePageId(a.payload.pageId)!, a.payload.elementId, { text: a.payload.text })
          break
        case "move_block":
          store.updateElement(resolvePageId(a.payload.pageId)!, a.payload.elementId, { rect: { x: a.payload.x, y: a.payload.y } as any })
          break
        case "resize_block":
          store.updateElement(resolvePageId(a.payload.pageId)!, a.payload.elementId, { rect: { w: a.payload.w, h: a.payload.h } as any })
          break
        case "delete_block":
          store.deleteElement(resolvePageId(a.payload.pageId)!, a.payload.elementId)
          break
        case "link_pages":
          // futuro: refletir visualmente
          break
      }
      applied++
    } catch (e) {
      errors.push(String(e))
    }
  }
  return { applied, errors }

  function resolvePageId(idOrName?: string): string | undefined {
    if (!idOrName) {
      const cur = store.getCurrentPage()
      return cur?.id
    }
    const byAlias = alias.get(slug(idOrName))
    if (byAlias) return byAlias
    const exact = store.state.pages.find((p) => p.id === idOrName)?.id
    if (exact) return exact
    const byName = store.getPageByName(idOrName)?.id
    if (byName) return byName
    // fallback: current page
    return store.getCurrentPage()?.id
  }
}

export type AiResponse = { actions?: Action[]; summary?: string; ask?: string; error?: string }

export function toSafeProjectState(state: ProjectState) {
  const clone: ProjectState = JSON.parse(JSON.stringify(state))
  clone.pages.forEach((p) => {
    p.elements.forEach((e) => {
      if (e.text && e.text.length > 1000) e.text = e.text.slice(0, 1000)
    })
  })
  return clone
}
