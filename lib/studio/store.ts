"use client"

import { create } from "zustand"
import { genId } from "./utils"
import type { ElementType, Page, ProjectState, Element } from "./types"

const now = () => new Date().toISOString()

type Selection = { elementId?: string }
export type ChatMsgMeta = { usedVision?: boolean; visionDescription?: string }
export type ChatMsg = { role: "user" | "assistant"; content: string; ts: string; meta?: ChatMsgMeta }

type Store = {
  project: { id: string; name: string }
  state: ProjectState
  selection: Selection
  chat: ChatMsg[]
  hydrateFromLocalStorage: () => void
  persistToLocalStorage: () => void
  setProjectName: (name: string) => void
  getCurrentPage: () => Page | undefined
  getPageByName: (name: string) => Page | undefined
  selectElement: (id?: string) => void
  addPage: (name?: string) => void
  renamePage: (pageId: string, name: string) => void
  selectPage: (pageId: string) => void
  addElement: (type: ElementType, options?: any) => void
  updateElement: (pageId: string, elementId: string, patch: Partial<Element>) => void
  deleteElement: (pageId: string, elementId: string) => void
  bringForward: (pageId: string, elementId: string) => void
  sendBackward: (pageId: string, elementId: string) => void
  addChat: (role: ChatMsg["role"], content: string, meta?: ChatMsgMeta) => void
}

const initial: ProjectState = {
  id: genId(),
  name: "Sem título",
  entry: undefined,
  pages: [
    {
      id: "page-1",
      name: "Página 1",
      elements: [],
    },
  ],
  createdAt: now(),
  updatedAt: now(),
}

const initialChat: ChatMsg[] = [
  { role: "assistant", content: "Olá! Me diga o que deseja criar que eu monto as ações para você.", ts: now() },
]

export const useStudioStore = create<Store>((set, get) => ({
  project: { id: initial.id, name: initial.name },
  state: initial,
  selection: {},
  chat: initialChat,
  hydrateFromLocalStorage: () => {
    try {
      const raw = localStorage.getItem("studio:project")
      if (raw) {
        const data = JSON.parse(raw) as ProjectState
        set({ state: data, project: { id: data.id, name: data.name } })
      }
      const rawChat = localStorage.getItem("studio:chat")
      if (rawChat) set({ chat: JSON.parse(rawChat) as ChatMsg[] })
    } catch {}
  },
  persistToLocalStorage: () => {
    try {
      const s = get().state
      localStorage.setItem("studio:project", JSON.stringify(s))
      localStorage.setItem("studio:chat", JSON.stringify(get().chat))
    } catch {}
  },
  setProjectName: (name) => {
    const s = get().state
    const ns = { ...s, name, updatedAt: now() }
    set({ state: ns, project: { id: ns.id, name } })
    get().persistToLocalStorage()
  },
  getCurrentPage: () => {
    const s = get().state
    const id = s.entry || s.pages[0]?.id
    return s.pages.find((p) => p.id === id)
  },
  getPageByName: (name) => {
    const s = get().state
    const norm = name.trim().toLowerCase()
    return s.pages.find((p) => p.name.trim().toLowerCase() === norm)
  },
  selectElement: (id) => set({ selection: { elementId: id } }),
  addPage: (name = `Página ${get().state.pages.length + 1}`) => {
    const s = get().state
    const page: Page = { id: genId(), name, elements: [] }
    const ns = { ...s, pages: [...s.pages, page], updatedAt: now() }
    set({ state: ns })
    get().persistToLocalStorage()
  },
  renamePage: (pageId, name) => {
    const s = get().state
    const pages = s.pages.map((p) => (p.id === pageId ? { ...p, name } : p))
    set({ state: { ...s, pages, updatedAt: now() } })
    get().persistToLocalStorage()
  },
  selectPage: (pageId) => {
    const s = get().state
    const exists = s.pages.some((p) => p.id === pageId)
    if (!exists) return
    set({ state: { ...s, entry: pageId, updatedAt: now() } })
    get().persistToLocalStorage()
  },
  addElement: (type, options) => {
    const s = get().state
    const page = get().getCurrentPage()
    if (!page) return
    const el: Element = {
      id: genId(),
      type,
      rect: { x: 80, y: 80, w: 160, h: 48 },
      text: type === "text" || type === "button" ? (type === "text" ? "Texto" : "Botão") : undefined,
      style: {
        backgroundColor: type === "text" ? "transparent" : "#111111",
        textColor: type === "text" ? "#111111" : "#f5f5f5",
        borderColor: "#2a2a2a",
        borderWidth: type === "text" ? 0 : 1,
        borderRadius: type === "text" ? 0 : 8,
        fontSize: 14,
        fontWeight: type === "text" ? 500 : 500,
        fontFamily: "system-ui, -apple-system, Segoe UI, Arial, sans-serif",
        opacity: 1,
        zIndex: 1,
      },
      props: type === "shape" ? { kind: options?.kind || "rect", dashed: false, arrow: false } : undefined,
    }
    if (type === "shape") {
      if (el.props?.kind === "ellipse") el.style.borderRadius = 9999 as unknown as number
      if (el.props?.kind === "line" || el.props?.kind === "arrow") {
        el.rect.h = 24
        el.style.backgroundColor = "transparent"
      }
    }
    const pages = s.pages.map((p) => (p.id === page.id ? { ...p, elements: [...p.elements, el] } : p))
    set({ state: { ...s, pages, updatedAt: now() }, selection: { elementId: el.id } })
    get().persistToLocalStorage()
  },
  updateElement: (pageId, elementId, patch) => {
    const s = get().state
    const pages = s.pages.map((p) =>
      p.id === pageId
        ? {
            ...p,
            elements: p.elements.map((e) =>
              e.id === elementId
                ? {
                    ...e,
                    ...patch,
                    rect: { ...e.rect, ...(patch as any).rect },
                    style: { ...(e as Element).style, ...(patch as any).style },
                  }
                : e,
            ),
          }
        : p,
    )
    set({ state: { ...s, pages, updatedAt: now() } })
    get().persistToLocalStorage()
  },
  deleteElement: (pageId, elementId) => {
    const s = get().state
    const pages = s.pages.map((p) => (p.id === pageId ? { ...p, elements: p.elements.filter((e) => e.id !== elementId) } : p))
    set({ state: { ...s, pages, updatedAt: now() }, selection: {} })
    get().persistToLocalStorage()
  },
  bringForward: (pageId, elementId) => {
    const s = get().state
    const pages = s.pages.map((p) => {
      if (p.id !== pageId) return p
      const idx = p.elements.findIndex((e) => e.id === elementId)
      if (idx === -1 || idx === p.elements.length - 1) return p
      const arr = [...p.elements]
      ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
      // Reindex z-index para refletir ordem visual
      const withZ = arr.map((e, i) => ({ ...e, style: { ...(e as Element).style, zIndex: i + 1 } }))
      return { ...p, elements: withZ }
    })
    set({ state: { ...s, pages, updatedAt: now() } })
    get().persistToLocalStorage()
  },
  sendBackward: (pageId, elementId) => {
    const s = get().state
    const pages = s.pages.map((p) => {
      if (p.id !== pageId) return p
      const idx = p.elements.findIndex((e) => e.id === elementId)
      if (idx <= 0) return p
      const arr = [...p.elements]
      ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
      const withZ = arr.map((e, i) => ({ ...e, style: { ...(e as Element).style, zIndex: i + 1 } }))
      return { ...p, elements: withZ }
    })
    set({ state: { ...s, pages, updatedAt: now() } })
    get().persistToLocalStorage()
  },
  addChat: (role, content, meta) => {
    const list = [...get().chat, { role, content, ts: now(), meta }]
    set({ chat: list })
    get().persistToLocalStorage()
  },
}))
