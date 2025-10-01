"use client"

import { create } from "zustand"
import { genId } from "./utils"
import type { ElementType, Page, ProjectState } from "./types"

const now = () => new Date().toISOString()

type Selection = { elementId?: string }
export type ChatMsg = { role: "user" | "assistant"; content: string; ts: string }

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
  addElement: (type: ElementType) => void
  updateElement: (pageId: string, elementId: string, patch: Partial<Page["elements"][number]>) => void
  deleteElement: (pageId: string, elementId: string) => void
  addChat: (role: ChatMsg["role"], content: string) => void
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
  addElement: (type) => {
    const s = get().state
    const page = get().getCurrentPage()
    if (!page) return
    const el = {
      id: genId(),
      type,
      rect: { x: 80, y: 80, w: 160, h: 48 },
      text: type === "text" || type === "button" ? (type === "text" ? "Texto" : "Botão") : undefined,
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
            elements: p.elements.map((e) => (e.id === elementId ? { ...e, ...patch, rect: { ...e.rect, ...(patch as any).rect } } : e)),
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
  addChat: (role, content) => {
    const list = [...get().chat, { role, content, ts: now() }]
    set({ chat: list })
    get().persistToLocalStorage()
  },
}))
